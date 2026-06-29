
(function(){
  async function updateLastActorLabel(){
    const el = document.getElementById('lastUpdate');
    if(!el || !window.client) return;
    try{
      const sessionResult = await client.auth.getSession();
      const currentEmail = sessionResult && sessionResult.data && sessionResult.data.session && sessionResult.data.session.user ? sessionResult.data.session.user.email : '';
      let label = currentEmail ? `By ${currentEmail}` : 'By unknown admin';
      try{
        const result = await client.from('audit_log').select('created_at, actor_email, action').order('created_at', { ascending:false }).limit(1);
        if(!result.error && result.data && result.data.length){
          const row = result.data[0];
          const time = row.created_at ? new Date(row.created_at).toLocaleTimeString('en-GB') : '';
          label = `By ${row.actor_email || currentEmail || 'unknown admin'}${row.action ? ' · ' + row.action : ''}${time ? ' · ' + time : ''}`;
        }
      }catch(e){}
      el.textContent = label;
      el.title = label;
    }catch(e){}
  }
  window.updateLastActorLabel = updateLastActorLabel;
  setInterval(updateLastActorLabel, 1500);
  document.addEventListener('click', function(e){
    if(e.target && (e.target.classList.contains('admin-action-btn') || e.target.id === 'approveAll' || e.target.id === 'deletePending')){
      setTimeout(updateLastActorLabel, 1200);
      setTimeout(updateLastActorLabel, 3000);
    }
  });
})();
