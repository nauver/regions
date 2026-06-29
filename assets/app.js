
const FALLBACK_REGIONS = [{"name": "Wallonia", "country": "BE", "lat": 50.5, "lon": 4.75, "nuts": "BE3"}, {"name": "Flanders", "country": "BE", "lat": 51.05, "lon": 3.73, "nuts": "BE2"}, {"name": "Brussels-Capital Region", "country": "BE", "lat": 50.85, "lon": 4.35, "nuts": "BE1"}, {"name": "Occitanie", "country": "FR", "lat": 43.61, "lon": 1.44, "nuts": "FRJ"}, {"name": "Bretagne", "country": "FR", "lat": 48.11, "lon": -1.68, "nuts": "FRH"}, {"name": "Auvergne-Rhône-Alpes", "country": "FR", "lat": 45.76, "lon": 4.84, "nuts": "FRK"}, {"name": "Cataluña", "country": "ES", "lat": 41.39, "lon": 2.17, "nuts": "ES51"}, {"name": "Toscana", "country": "IT", "lat": 43.77, "lon": 11.25, "nuts": "ITI1"}, {"name": "Bayern", "country": "DE", "lat": 48.14, "lon": 11.58, "nuts": "DE2"}, {"name": "Śląskie", "country": "PL", "lat": 50.26, "lon": 19.02, "nuts": "PL22"}, {"name": "Lisboa", "country": "PT", "lat": 38.72, "lon": -9.14, "nuts": "PT17"}, {"name": "Attiki", "country": "EL", "lat": 37.98, "lon": 23.73, "nuts": "EL30"}];
const NUTS_DATA_URL = 'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_20M_2024_4326_LEVL_2.geojson';
const DEFAULT_CONFIG = { SUPABASE_URL:'', SUPABASE_ANON_KEY:'', STORAGE_BUCKET:'participant-photos', DEMO_MODE:false, POLL_MS:2000, CLOUD_REFRESH_MS:30000 };
const APP_CONFIG = { ...DEFAULT_CONFIG, ...(window.APP_CONFIG || {}) };
const colours = ['#ff4fd8','#00d8ff','#28ff8a','#ff7a00','#7c3cff','#ffed00'];
let client = null;
let wallLastSignature = '';
let wallIndex = 0;
let lastCloudAt = 0;
let lastCloudSignature = '';
let regionCache = null;
let selectedRegion = null;
let miniMap = null;
let miniPin = null;
let screenMap = null;
let screenPinLayer = null;
let mapPinLayer = null;

function $(id){ return document.getElementById(id); }
function toast(message){ const t=$('toast'); if(!t)return; t.textContent=message; t.style.display='block'; setTimeout(()=>t.style.display='none',3000); }
function isConfigured(){ return APP_CONFIG.DEMO_MODE || (APP_CONFIG.SUPABASE_URL && APP_CONFIG.SUPABASE_ANON_KEY && APP_CONFIG.SUPABASE_URL.includes('supabase.co') && !APP_CONFIG.SUPABASE_ANON_KEY.includes('YOUR_')); }
function initClient(){ if(APP_CONFIG.DEMO_MODE)return null; if(!isConfigured()){ const w=$('configWarning'); if(w)w.style.display='block'; return null; } client = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY); return client; }
function cssPerson(){ return '<div class="css-person"></div>'; }
function personVisual(p){ if(p.photo_url && (p.photo_url.startsWith('http') || p.photo_url.startsWith('data:image/'))) return `<img src="${p.photo_url}" alt="">`; return cssPerson(); }
function normaliseParticipant(p){ return { ...p, where_label:p.where_label || `${p.region}, ${p.country}`, photo_url:p.photo_url || 'css-silhouette' }; }
function norm(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }

function collectCoords(coords, acc){
  if(typeof coords[0] === 'number'){ acc.push(coords); return; }
  coords.forEach(c => collectCoords(c, acc));
}
function featureCenter(feature){
  const pts=[]; collectCoords(feature.geometry.coordinates, pts);
  let minLon=999, maxLon=-999, minLat=999, maxLat=-999;
  pts.forEach(([lon,lat])=>{ if(lon<minLon)minLon=lon; if(lon>maxLon)maxLon=lon; if(lat<minLat)minLat=lat; if(lat>maxLat)maxLat=lat; });
  return { lat:(minLat+maxLat)/2, lon:(minLon+maxLon)/2 };
}
async function loadRegions(){
  if(regionCache) return regionCache;
  try{
    const res = await fetch(NUTS_DATA_URL, { cache:'force-cache' });
    if(!res.ok) throw new Error('NUTS fetch failed');
    const geo = await res.json();
    regionCache = geo.features.map(f=>{
      const p=f.properties||{};
      const c=featureCenter(f);
      return { name:p.NAME_LATN || p.NUTS_NAME || p.na || p.name || p.NUTS_ID, country:p.CNTR_CODE || '', nuts:p.NUTS_ID || p.id || '', lat:+c.lat.toFixed(5), lon:+c.lon.toFixed(5) };
    }).filter(r=>r.name && Number.isFinite(r.lat) && Number.isFinite(r.lon)).sort((a,b)=>a.name.localeCompare(b.name));
  }catch(e){ console.warn('Using fallback regions', e); regionCache = FALLBACK_REGIONS; }
  return regionCache;
}

async function getApproved(){
  if(!client) return [];
  const {data,error}=await client.from('participants').select('*').eq('approved',true).order('approved_at',{ascending:false,nullsFirst:false}).order('created_at',{ascending:false});
  if(error){ console.error(error); return []; }
  return (data||[]).map(normaliseParticipant);
}
async function getAll(){
  if(!client) return [];
  const {data,error}=await client.from('participants').select('*').order('created_at',{ascending:false});
  if(error){ console.error(error); toast(error.message); return []; }
  return (data||[]).map(normaliseParticipant);
}
async function insertParticipant(entry){ const {error}=await client.from('participants').insert(entry); if(error)throw error; }
async function updateParticipant(id,patch){ const {error}=await client.from('participants').update(patch).eq('id',id); if(error)throw error; }
async function deleteParticipant(id){ const {error}=await client.from('participants').delete().eq('id',id); if(error)throw error; }
function dataUrlToBlob(dataUrl){ const [meta,b64]=dataUrl.split(','); const mime=(meta.match(/data:(.*);base64/)||[])[1]||'image/jpeg'; const bin=atob(b64); const arr=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i); return new Blob([arr],{type:mime}); }
async function uploadPhoto(dataUrl){
  if(!dataUrl || !dataUrl.startsWith('data:image/')) return null;
  const path=`public/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const blob=dataUrlToBlob(dataUrl);
  const {error}=await client.storage.from(APP_CONFIG.STORAGE_BUCKET).upload(path, blob, {contentType:'image/jpeg', upsert:false});
  if(error)throw error;
  const {data}=client.storage.from(APP_CONFIG.STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function initLeafletMap(el, opts={}){
  if(!window.L || !el) return null;
  const map=L.map(el,{ zoomControl:opts.zoomControl ?? true, attributionControl:false, dragging:opts.dragging ?? true, scrollWheelZoom:opts.scrollWheelZoom ?? true }).setView([53, 14], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:10 }).addTo(map);
  return map;
}
function updateMiniMap(p){
  if(!window.L || !$('miniLeaflet') || !p) return;
  if(!miniMap){ miniMap=initLeafletMap($('miniLeaflet'), {zoomControl:false, dragging:false, scrollWheelZoom:false}); }
  if(!miniMap) return;
  const lat=Number(p.lat), lon=Number(p.lon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)) return;
  miniMap.setView([lat,lon],5,{animate:true});
  if(!miniPin) miniPin=L.circleMarker([lat,lon],{radius:8,color:'#fff',weight:3,fillColor:'#ff4fd8',fillOpacity:1}).addTo(miniMap);
  miniPin.setLatLng([lat,lon]);
}
function buildCloud(list=[]){
  const cloud=$('cloud'); if(!cloud)return; cloud.innerHTML=''; const source=list.length?list:[];
  source.slice(0,24).forEach((p,i)=>{ const c=document.createElement('div'); c.className='cloud-card'; c.style.left=(Math.random()*92)+'vw'; c.style.top=(Math.random()*84)+'vh'; c.style.transform=`scale(${.75+Math.random()*.9})`; c.innerHTML=personVisual(p); cloud.appendChild(c); });
  lastCloudAt=Date.now(); lastCloudSignature=source.map(p=>`${p.id}:${p.photo_url}`).join('|');
}
function maybeBuildCloud(list){ const sig=list.map(p=>`${p.id}:${p.photo_url}`).join('|'); if(sig!==lastCloudSignature || Date.now()-lastCloudAt >= (APP_CONFIG.CLOUD_REFRESH_MS||30000)) buildCloud(list); }
function setWallPerson(p, instant=false){
  const animated=[$('portraitWrap'),$('namePlate'),$('quotePanel')].filter(Boolean);
  if(!instant) animated.forEach(e=>e.classList.add('fade-out'));
  setTimeout(()=>{
    const accent=colours[(p.full_name.length+String(p.id).length)%colours.length];
    $('portraitWrap').innerHTML=personVisual(p); $('name').textContent=p.full_name; $('region').textContent=p.where_label; $('quote').textContent=p.quote; $('mapRegion').textContent=p.where_label;
    $('blob').style.setProperty('--accent',accent); $('quotePanel').style.setProperty('--accent',accent);
    updateMiniMap(p);
    animated.forEach(e=>e.classList.remove('fade-out'));
  }, instant?0:520);
}
async function tickWall(force=false){
  const list=await getApproved(); if(!list.length)return;
  const sig=list.map(x=>`${x.id}:${x.approved}:${x.approved_at||''}`).join('|');
  if(force || sig!==wallLastSignature){ wallLastSignature=sig; wallIndex=0; setWallPerson(list[0],true); maybeBuildCloud(list); return; }
  wallIndex=(wallIndex+1)%list.length; setWallPerson(list[wallIndex]); maybeBuildCloud(list);
}
async function pollWallChangesOnly(){ const list=await getApproved(); if(!list.length)return; const sig=list.map(x=>`${x.id}:${x.approved}:${x.approved_at||''}`).join('|'); if(sig!==wallLastSignature) await tickWall(true); }
async function initWall(){ initClient(); await tickWall(true); setInterval(()=>tickWall(false),15000); setInterval(()=>pollWallChangesOnly(), APP_CONFIG.POLL_MS||2000); if(client) client.channel('participants-wall').on('postgres_changes',{event:'*',schema:'public',table:'participants'},()=>tickWall(true)).subscribe(); }

async function setupRegionAutocomplete(){
  const input=$('regionSearch'), box=$('regionSuggestions'); if(!input||!box)return;
  const regions=await loadRegions();
  function render(q){
    const nq=norm(q); box.innerHTML=''; selectedRegion=null;
    if(nq.length<2){ box.style.display='none'; return; }
    const matches=regions.filter(r=>norm(`${r.name} ${r.country} ${r.nuts}`).includes(nq)).slice(0,10);
    matches.forEach(r=>{ const item=document.createElement('button'); item.type='button'; item.className='suggestion-item'; item.textContent=`${r.name}, ${r.country}${r.nuts ? ' · '+r.nuts : ''}`; item.onclick=()=>{ selectedRegion=r; input.value=`${r.name}, ${r.country}`; box.style.display='none'; }; box.appendChild(item); });
    box.style.display=matches.length?'grid':'none';
  }
  input.addEventListener('input',()=>render(input.value));
  input.addEventListener('blur',()=>setTimeout(()=>box.style.display='none',200));
  input.addEventListener('focus',()=>render(input.value));
}
async function initKiosk(){
  initClient(); await setupRegionAutocomplete(); let photoData=''; $('previewBox').innerHTML=cssPerson(); const video=$('video');
  $('startCamera')?.addEventListener('click',async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false}); video.srcObject=s; video.play(); toast('Camera started')}catch{toast('Camera unavailable')}});
  $('takePhoto')?.addEventListener('click',()=>{ if(!video.videoWidth){toast('Start camera first');return} const canvas=document.createElement('canvas'); canvas.width=900; canvas.height=900; const ctx=canvas.getContext('2d'); const size=Math.min(video.videoWidth,video.videoHeight); ctx.drawImage(video,(video.videoWidth-size)/2,(video.videoHeight-size)/2,size,size,0,0,900,900); photoData=canvas.toDataURL('image/jpeg',.82); $('previewBox').innerHTML=`<img src="${photoData}" alt="">`; });
  $('kioskForm')?.addEventListener('submit',async e=>{ e.preventDefault(); const f=e.currentTarget; try{ let region=selectedRegion; if(!region){ const all=await loadRegions(); region=all.find(r=>norm(`${r.name}, ${r.country}`)===norm(f.regionSearch.value)) || null; } if(!region){ toast('Choose a region from the suggestions'); $('regionSearch').focus(); return; } const photoUrl=await uploadPhoto(photoData); await insertParticipant({first_name:f.firstName.value.trim(),last_name:f.lastName.value.trim(),full_name:`${f.firstName.value.trim()} ${f.lastName.value.trim()}`.trim(),region:region.name,country:region.country,where_label:`${region.name}, ${region.country}`,lat:region.lat,lon:region.lon,quote:f.quote.value.trim(),photo_url:photoUrl||'css-silhouette',approved:false}); f.reset(); selectedRegion=null; photoData=''; $('previewBox').innerHTML=cssPerson(); toast('Submitted for approval'); }catch(err){ console.error(err); toast(err.message||'Submit failed'); } });
}
async function initAdmin(){
  initClient();
  async function refresh(){ if(!client){toast('Configure Supabase first');return} const {data}=await client.auth.getSession(); const session=data&&data.session?data.session:null; const loginBox=document.querySelector('.admin-login'); const list=$('adminList'); if(session){ if(loginBox)loginBox.style.display='none'; if(list)list.style.display='grid'; await renderAdmin(); }else{ if(loginBox)loginBox.style.display='grid'; if(list)list.style.display='none'; } }
  $('loginBtn')?.addEventListener('click',async()=>{ const {error}=await client.auth.signInWithPassword({email:$('adminEmail').value.trim(),password:$('adminPassword').value}); if(error){toast(error.message);return} toast('Logged in'); await refresh(); });
  $('logoutBtn')?.addEventListener('click',async()=>{ await client?.auth.signOut(); toast('Logged out'); await refresh(); });
  $('exportJson')?.addEventListener('click',async()=>{ const b=new Blob([JSON.stringify(await getAll(),null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='participants.json'; a.click(); });
  await refresh(); if(client) client.channel('participants-admin').on('postgres_changes',{event:'*',schema:'public',table:'participants'},()=>renderAdmin()).subscribe();
}
async function renderAdmin(){
  const listElement=$('adminList'); if(!listElement)return; const entries=await getAll(); listElement.innerHTML='';
  entries.forEach(entry=>{ const row=document.createElement('div'); row.className='admin-item'; row.innerHTML=`<div class="admin-thumb">${personVisual(entry)}</div><div class="admin-text"><strong>${entry.full_name}</strong><span>${entry.where_label}</span><p>${entry.quote}</p><span class="${entry.approved?'status-approved':'status-pending'}">${entry.approved?'Approved':'Pending'}</span></div><div class="admin-actions"><button type="button" class="btn admin-action-btn" data-action="toggle" data-id="${entry.id}">${entry.approved?'Hide':'Approve'}</button><button type="button" class="btn danger admin-action-btn" data-action="delete" data-id="${entry.id}">Delete</button></div>`; listElement.appendChild(row); });
  listElement.querySelectorAll('.admin-action-btn').forEach(button=>{ button.addEventListener('click',async event=>{ event.preventDefault(); event.stopPropagation(); try{ const action=button.dataset.action, id=button.dataset.id; if(action==='toggle'){ const entry=entries.find(item=>String(item.id)===String(id)); await updateParticipant(entry.id,{approved:!entry.approved,approved_at:!entry.approved?new Date().toISOString():null}); } if(action==='delete') await deleteParticipant(id); await renderAdmin(); }catch(error){ console.error(error); toast(error.message||'Action failed'); } }); });
}
function addPinsToLeaflet(map, layer, list){
  if(layer) layer.clearLayers(); else layer=L.layerGroup().addTo(map);
  list.forEach((p,i)=>{ const lat=Number(p.lat), lon=Number(p.lon); if(!Number.isFinite(lat)||!Number.isFinite(lon))return; const marker=L.circleMarker([lat,lon],{radius:9,color:'#fff',weight:3,fillColor:colours[i%colours.length],fillOpacity:1}); marker.bindTooltip(`${p.full_name} · ${p.where_label}`); marker.addTo(layer); });
  return layer;
}
async function initMap(){
  initClient(); const el=$('bigMap'); if(!el)return; const map=initLeafletMap(el,{zoomControl:true,dragging:true,scrollWheelZoom:true}); mapPinLayer=L.layerGroup().addTo(map);
  async function render(){ const list=await getApproved(); $('mapCount').textContent=list.length; mapPinLayer=addPinsToLeaflet(map,mapPinLayer,list); }
  await render(); setInterval(render,APP_CONFIG.POLL_MS||2000); if(client) client.channel('participants-map').on('postgres_changes',{event:'*',schema:'public',table:'participants'},render).subscribe();
}
async function initMapScreen(){
  initClient(); const el=$('screenMap'); if(!el)return; screenMap=initLeafletMap(el,{zoomControl:true,dragging:true,scrollWheelZoom:true}); screenPinLayer=L.layerGroup().addTo(screenMap);
  async function render(){ const list=await getApproved(); const count=$('screenMapCount'); if(count)count.textContent=list.length; screenPinLayer=addPinsToLeaflet(screenMap,screenPinLayer,list); }
  await render(); setInterval(render,APP_CONFIG.POLL_MS||2000); if(client) client.channel('participants-map-screen').on('postgres_changes',{event:'*',schema:'public',table:'participants'},render).subscribe();
}
