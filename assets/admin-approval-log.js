
(function(){
  let adminClient = null;

  async function getCurrentAdminEmail(){
    try{
      adminClient = adminClient || initClient();
      const { data } = await adminClient.auth.getSession();
      return data && data.session && data.session.user ? data.session.user.email : '';
    }catch(e){
      return '';
    }
  }

  function toCsv(rows){
    const cols = ['id','full_name','region','country','nuts_code','quote','approved','approved_by_email','approved_by_at','created_at','approved_at','consent_accepted','consent_version','consent_at','retention_until','photo_url'];
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

  async function approveParticipant(entry){
    const email = await getCurrentAdminEmail();
    await updateParticipant(entry.id, {
      approved: true,
      approved_at: new Date().toISOString(),
      approved_by_email: email || null,
      approved_by_at: new Date().toISOString()
    });
  }

  async function hideParticipant(entry){
    await updateParticipant(entry.id, {
      approved: false,
      approved_at: null
    });
  }

  window.initAdmin = async function initAdmin(){
    setVersion?.();
    adminClient = initClient();

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
      const pending = (await getAll()).filter(x => !x.approved);
      for(const entry of pending) await approveParticipant(entry);
      await renderAdmin();
    });

    document.getElementById('deletePending')?.addEventListener('click', async () => {
      if(!confirm('Delete all pending submissions?')) return;
      for(const entry of (await getAll()).filter(x => !x.approved)) await deleteParticipant(entry.id, entry);
      await renderAdmin();
    });

    await refresh();
    if(adminClient){
      adminClient.channel('participants-admin')
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
    if(document.getElementById('pendingCount')) document.getElementById('pendingCount').textContent = all.filter(e => !e.approved).length;
    if(document.getElementById('approvedCount')) document.getElementById('approvedCount').textContent = all.filter(e => e.approved).length;
    if(document.getElementById('totalCount')) document.getElementById('totalCount').textContent = all.length;

    list.innerHTML = '';

    entries.forEach(entry => {
      const approvedBy = entry.approved_by_email
        ? `<small class="approved-by">Approved by ${entry.approved_by_email}${entry.approved_by_at ? ' · ' + new Date(entry.approved_by_at).toLocaleString('en-GB') : ''}</small>`
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
          <span class="${entry.approved ? 'status-approved' : 'status-pending'}">${entry.approved ? 'Approved' : 'Pending'}</span>
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
          if(action === 'toggle'){
            if(entry.approved) await hideParticipant(entry);
            else await approveParticipant(entry);
          }
          if(action === 'delete'){
            if(confirm('Delete this participant and photo?')) await deleteParticipant(id, entry);
          }
          await renderAdmin();
        }catch(e){
          console.error(e);
          toast(e.message || 'Action failed');
        }
      });
    });
  };
})();
