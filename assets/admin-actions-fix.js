
(function(){
  let adminClient = null;

  function getClient(){
    adminClient = adminClient || initClient();
    return adminClient;
  }

  async function getCurrentAdminEmail(){
    const c = getClient();
    if(!c) return '';
    const { data } = await c.auth.getSession();
    return data && data.session && data.session.user ? data.session.user.email : '';
  }

  async function updateParticipantDirect(id, patch){
    const c = getClient();
    const { error } = await c
      .from('participants')
      .update(patch)
      .eq('id', id);

    if(error) throw error;

    // Do not use .single() here: if RLS does not allow SELECT after UPDATE,
    // PostgREST returns "Cannot coerce the result to a single JSON object".
    // The UPDATE itself is enough; the next getAll() refresh validates the state.
    return true;
  }

  async function approveParticipantDirect(entry){
    const email = await getCurrentAdminEmail();
    await updateParticipantDirect(entry.id, {
      approved: true,
      approved_at: new Date().toISOString(),
      approved_by_email: email || null,
      approved_by_at: new Date().toISOString(),
      hidden_by_email: null,
      hidden_at: null
    });
  }

  async function hideParticipantDirect(entry){
    const email = await getCurrentAdminEmail();
    await updateParticipantDirect(entry.id, {
      approved: false,
      approved_at: null,
      hidden_by_email: email || null,
      hidden_at: new Date().toISOString()
    });
  }

  function toCsv(rows){
    const cols = ['id','full_name','region','country','nuts_code','quote','approved','approved_by_email','approved_by_at','hidden_by_email','hidden_at','created_at','approved_at','consent_accepted','consent_version','consent_at','retention_until','photo_url'];
    const esc = v => '"' + String(v ?? '').replaceAll('"','""') + '"';
    return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
  }

  function downloadFile(name, content, type){
    const b = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = name;
    a.click();
  }

  function storagePathFromPublicUrl(url){
    try{
      const u = new URL(url);
      const marker = '/storage/v1/object/public/' + APP_CONFIG.STORAGE_BUCKET + '/';
      const idx = u.pathname.indexOf(marker);
      return idx >= 0 ? decodeURIComponent(u.pathname.slice(idx + marker.length)) : null;
    }catch(e){ return null; }
  }

  async function deleteParticipantDirect(entry){
    const c = getClient();
    try{
      if(entry.photo_url && entry.photo_url.startsWith('http')){
        const path = storagePathFromPublicUrl(entry.photo_url);
        if(path) await c.storage.from(APP_CONFIG.STORAGE_BUCKET).remove([path]);
      }
    }catch(e){ console.warn('Photo delete skipped', e); }
    const { error } = await c.from('participants').delete().eq('id', entry.id);
    if(error) throw error;
  }

  async function forcePublicPagesRefresh(){
    try{
      if(window.localStorage){
        localStorage.setItem('proudRegionLastAdminChange', String(Date.now()));
      }
    }catch(e){}
  }

  window.initAdmin = async function initAdmin(){
    if(typeof setVersion === 'function') setVersion();
    adminClient = getClient();

    async function refresh(){
      if(!adminClient){ toast('Configure Supabase first'); return; }
      const { data } = await adminClient.auth.getSession();
      const session = data && data.session ? data.session : null;
      const loginBox = document.querySelector('.admin-login');
      const tools = document.getElementById('adminTools');
      const list = document.getElementById('adminList');
      if(session){
        if(loginBox) loginBox.style.display = 'none';
        if(tools) tools.style.display = 'flex';
        if(list) list.style.display = 'grid';
        await renderAdmin();
      } else {
        if(loginBox) loginBox.style.display = 'grid';
        if(tools) tools.style.display = 'none';
        if(list) list.style.display = 'none';
      }
    }

    document.getElementById('loginBtn')?.addEventListener('click', async () => {
      const { error } = await adminClient.auth.signInWithPassword({
        email: document.getElementById('adminEmail').value.trim(),
        password: document.getElementById('adminPassword').value
      });
      if(error){ toast(error.message); return; }
      toast('Logged in');
      await refresh();
    });

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await adminClient.auth.signOut();
      toast('Logged out');
      await refresh();
    });

    ['adminSearch','adminFilter'].forEach(id => document.getElementById(id)?.addEventListener('input', renderAdmin));

    document.getElementById('exportJson')?.addEventListener('click', async () => downloadFile('participants.json', JSON.stringify(await getAll(), null, 2), 'application/json'));
    document.getElementById('exportCsv')?.addEventListener('click', async () => downloadFile('participants.csv', toCsv(await getAll()), 'text/csv'));

    document.getElementById('approveAll')?.addEventListener('click', async () => {
      const btn = document.getElementById('approveAll');
      try{
        btn.disabled = true;
        const pending = (await getAll()).filter(x => !x.approved);
        for(const entry of pending) await approveParticipantDirect(entry);
        await forcePublicPagesRefresh();
        toast(`${pending.length} approved`);
        await renderAdmin();
      }catch(e){
        console.error(e);
        toast(e.message || 'Approve all failed');
      }finally{
        btn.disabled = false;
      }
    });

    document.getElementById('deletePending')?.addEventListener('click', async () => {
      if(!confirm('Delete all pending submissions?')) return;
      try{
        const pending = (await getAll()).filter(x => !x.approved);
        for(const entry of pending) await deleteParticipantDirect(entry);
        await forcePublicPagesRefresh();
        toast(`${pending.length} pending deleted`);
        await renderAdmin();
      }catch(e){
        console.error(e);
        toast(e.message || 'Delete pending failed');
      }
    });

    await refresh();
    if(adminClient){
      adminClient.channel('participants-admin-fixed-v117')
        .on('postgres_changes', { event:'*', schema:'public', table:'participants' }, () => renderAdmin())
        .subscribe();
    }
  };

  window.renderAdmin = async function renderAdmin(){
    const list = document.getElementById('adminList');
    if(!list) return;

    let entries = await getAll();
    const search = norm(document.getElementById('adminSearch')?.value || '');
    const filter = document.getElementById('adminFilter')?.value || 'all';

    if(search) entries = entries.filter(e => norm(`${e.full_name} ${e.where_label} ${e.quote}`).includes(search));
    if(filter === 'pending') entries = entries.filter(e => !e.approved);
    if(filter === 'approved') entries = entries.filter(e => e.approved);

    const all = await getAll();
    document.getElementById('pendingCount').textContent = all.filter(e => !e.approved).length;
    document.getElementById('approvedCount').textContent = all.filter(e => e.approved).length;
    document.getElementById('totalCount').textContent = all.length;

    list.innerHTML = '';

    entries.forEach(entry => {
      const approvedBy = entry.approved_by_email
        ? `<small class="approved-by">Approved by ${entry.approved_by_email}${entry.approved_by_at ? ' · ' + new Date(entry.approved_by_at).toLocaleString('en-GB') : ''}</small>`
        : '';
      const hiddenBy = entry.hidden_by_email
        ? `<small class="approved-by">Hidden by ${entry.hidden_by_email}${entry.hidden_at ? ' · ' + new Date(entry.hidden_at).toLocaleString('en-GB') : ''}</small>`
        : '';

      const row = document.createElement('div');
      row.className = 'admin-item';
      row.innerHTML = `
        <div class="admin-thumb">${personVisual(entry)}</div>
        <div class="admin-text">
          <strong>${entry.full_name}</strong>
          <span>${entry.where_label}</span>
          <p>${entry.quote}</p>
          <small>Consent: ${entry.consent_accepted ? 'yes' : 'no'} · ${entry.consent_version || 'n/a'}</small>
          ${approvedBy}
          ${hiddenBy}
          <span class="${entry.approved ? 'status-approved' : 'status-pending'}">${entry.approved ? 'Approved' : 'Pending / Hidden'}</span>
        </div>
        <div class="admin-actions">
          <button type="button" class="btn admin-action-btn" data-action="toggle" data-id="${entry.id}">${entry.approved ? 'Hide' : 'Approve'}</button>
          <button type="button" class="btn danger admin-action-btn" data-action="delete" data-id="${entry.id}">Delete</button>
        </div>`;
      list.appendChild(row);
    });

    list.querySelectorAll('.admin-action-btn').forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault();
        const id = button.dataset.id;
        const action = button.dataset.action;
        const entry = entries.find(e => String(e.id) === String(id));
        try{
          button.disabled = true;
          if(action === 'toggle'){
            if(entry.approved){
              await hideParticipantDirect(entry);
              await forcePublicPagesRefresh();
              toast('Hidden from public pages');
            } else {
              await approveParticipantDirect(entry);
              await forcePublicPagesRefresh();
              toast('Approved');
            }
          }
          if(action === 'delete'){
            if(confirm('Delete this participant and photo?')){
              await deleteParticipantDirect(entry);
              await forcePublicPagesRefresh();
              toast('Deleted');
            }
          }
          await renderAdmin();
        }catch(e){
          console.error(e);
          toast(e.message || 'Action failed');
        }finally{
          button.disabled = false;
        }
      });
    });
  };
})();
