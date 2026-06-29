
const DEMO_DATA = [{"id": "demo-1", "first_name": "Ana", "last_name": "Laurent", "full_name": "Ana Laurent", "region": "Occitanie", "country": "France", "where_label": "Occitanie, France", "lat": 43.61, "lon": 1.44, "quote": "Mountains, sea and cities meet in one living culture.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-2", "first_name": "Milan", "last_name": "Horvat", "full_name": "Milan Horvat", "region": "Istria", "country": "Croatia", "where_label": "Istria, Croatia", "lat": 45.24, "lon": 13.94, "quote": "Coastal traditions and multilingual heritage make the region recognisable.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-3", "first_name": "Sofia", "last_name": "Mendes", "full_name": "Sofia Mendes", "region": "Lisbon Metropolitan Area", "country": "Portugal", "where_label": "Lisbon Metropolitan Area, Portugal", "lat": 38.72, "lon": -9.14, "quote": "Atlantic light, creativity and openness give the region its energy.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-4", "first_name": "Lukas", "last_name": "Weber", "full_name": "Lukas Weber", "region": "Bavaria", "country": "Germany", "where_label": "Bavaria, Germany", "lat": 48.14, "lon": 11.58, "quote": "Tradition and innovation grow together from villages to research centres.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-5", "first_name": "Nora", "last_name": "Peeters", "full_name": "Nora Peeters", "region": "Flanders", "country": "Belgium", "where_label": "Flanders, Belgium", "lat": 51.05, "lon": 3.73, "quote": "Historic towns, design and cycling culture create practical charm.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-6", "first_name": "Elena", "last_name": "Rossi", "full_name": "Elena Rossi", "region": "Tuscany", "country": "Italy", "where_label": "Tuscany, Italy", "lat": 43.77, "lon": 11.25, "quote": "Art, food and landscape are part of daily life.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-7", "first_name": "Jakub", "last_name": "Nowak", "full_name": "Jakub Nowak", "region": "Silesia", "country": "Poland", "where_label": "Silesia, Poland", "lat": 50.26, "lon": 19.02, "quote": "Industrial history has become creativity, reinvention and solidarity.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-8", "first_name": "Clara", "last_name": "Vidal", "full_name": "Clara Vidal", "region": "Catalonia", "country": "Spain", "where_label": "Catalonia, Spain", "lat": 41.39, "lon": 2.17, "quote": "Culture, design and Mediterranean life make the region distinctive.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-9", "first_name": "Iris", "last_name": "Bernard", "full_name": "Iris Bernard", "region": "Brittany", "country": "France", "where_label": "Brittany, France", "lat": 48.11, "lon": -1.68, "quote": "Maritime identity and local traditions give the region a strong voice.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-10", "first_name": "Hugo", "last_name": "Silva", "full_name": "Hugo Silva", "region": "Porto District", "country": "Portugal", "where_label": "Porto District, Portugal", "lat": 41.15, "lon": -8.61, "quote": "The river, the streets and local pride make the region welcoming.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-11", "first_name": "Marta", "last_name": "Greco", "full_name": "Marta Greco", "region": "Sicily", "country": "Italy", "where_label": "Sicily, Italy", "lat": 38.12, "lon": 13.36, "quote": "Every town and landscape carries Mediterranean history.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-12", "first_name": "Freja", "last_name": "Nielsen", "full_name": "Freja Nielsen", "region": "Capital Region of Denmark", "country": "Denmark", "where_label": "Capital Region of Denmark, Denmark", "lat": 55.68, "lon": 12.57, "quote": "Design culture, public trust and liveability make the region special.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-13", "first_name": "Asta", "last_name": "Koskinen", "full_name": "Asta Koskinen", "region": "Uusimaa", "country": "Finland", "where_label": "Uusimaa, Finland", "lat": 60.17, "lon": 24.94, "quote": "Clean nature and digital ambition shape everyday life.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-14", "first_name": "Rihards", "last_name": "Ozols", "full_name": "Rihards Ozols", "region": "Riga Planning Region", "country": "Latvia", "where_label": "Riga Planning Region, Latvia", "lat": 56.95, "lon": 24.11, "quote": "Urban energy, Baltic identity and nearby nature make the region stand out.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-15", "first_name": "Kadri", "last_name": "Tamm", "full_name": "Kadri Tamm", "region": "Harju County", "country": "Estonia", "where_label": "Harju County, Estonia", "lat": 59.44, "lon": 24.75, "quote": "Digital innovation and access to nature are part of daily life.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-16", "first_name": "Aoife", "last_name": "Murphy", "full_name": "Aoife Murphy", "region": "Leinster", "country": "Ireland", "where_label": "Leinster, Ireland", "lat": 53.35, "lon": -6.26, "quote": "Historic centres and strong communities give the region balance.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-17", "first_name": "Nikos", "last_name": "Georgiou", "full_name": "Nikos Georgiou", "region": "Crete", "country": "Greece", "where_label": "Crete, Greece", "lat": 35.34, "lon": 25.13, "quote": "Hospitality, landscape and resilience create a timeless identity.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-18", "first_name": "Helena", "last_name": "Papadopoulou", "full_name": "Helena Papadopoulou", "region": "Attica", "country": "Greece", "where_label": "Attica, Greece", "lat": 37.98, "lon": 23.73, "quote": "Ancient heritage and modern urban life shape each other.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-19", "first_name": "Eline", "last_name": "de Vries", "full_name": "Eline de Vries", "region": "South Holland", "country": "Netherlands", "where_label": "South Holland, Netherlands", "lat": 52.07, "lon": 4.3, "quote": "International outlook and smart infrastructure help cities reinvent themselves.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}, {"id": "demo-20", "first_name": "Julie", "last_name": "Perrin", "full_name": "Julie Perrin", "region": "Auvergne-Rhône-Alpes", "country": "France", "where_label": "Auvergne-Rhône-Alpes, France", "lat": 45.76, "lon": 4.84, "quote": "Mountains, industry and vibrant cities make the region powerful and diverse.", "photo_url": "css-silhouette", "approved": true, "created_at": "2026-06-26T08:00:00.000Z", "approved_at": "2026-06-26T08:00:00.000Z"}];
const REGION_OPTIONS = [{"region": "Occitanie", "country": "France", "lat": 43.61, "lon": 1.44}, {"region": "Istria", "country": "Croatia", "lat": 45.24, "lon": 13.94}, {"region": "Lisbon Metropolitan Area", "country": "Portugal", "lat": 38.72, "lon": -9.14}, {"region": "Bavaria", "country": "Germany", "lat": 48.14, "lon": 11.58}, {"region": "Flanders", "country": "Belgium", "lat": 51.05, "lon": 3.73}, {"region": "Tuscany", "country": "Italy", "lat": 43.77, "lon": 11.25}, {"region": "Silesia", "country": "Poland", "lat": 50.26, "lon": 19.02}, {"region": "Catalonia", "country": "Spain", "lat": 41.39, "lon": 2.17}, {"region": "Brittany", "country": "France", "lat": 48.11, "lon": -1.68}, {"region": "Porto District", "country": "Portugal", "lat": 41.15, "lon": -8.61}, {"region": "Sicily", "country": "Italy", "lat": 38.12, "lon": 13.36}, {"region": "Capital Region of Denmark", "country": "Denmark", "lat": 55.68, "lon": 12.57}, {"region": "Uusimaa", "country": "Finland", "lat": 60.17, "lon": 24.94}, {"region": "Riga Planning Region", "country": "Latvia", "lat": 56.95, "lon": 24.11}, {"region": "Harju County", "country": "Estonia", "lat": 59.44, "lon": 24.75}, {"region": "Leinster", "country": "Ireland", "lat": 53.35, "lon": -6.26}, {"region": "Crete", "country": "Greece", "lat": 35.34, "lon": 25.13}, {"region": "Attica", "country": "Greece", "lat": 37.98, "lon": 23.73}, {"region": "South Holland", "country": "Netherlands", "lat": 52.07, "lon": 4.3}, {"region": "Auvergne-Rhône-Alpes", "country": "France", "lat": 45.76, "lon": 4.84}];

const DEFAULT_CONFIG = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  STORAGE_BUCKET: 'participant-photos',
  DEMO_MODE: false,
  POLL_MS: 2000,
  CLOUD_REFRESH_MS: 30000
};

const APP_CONFIG = {
  ...DEFAULT_CONFIG,
  ...(window.APP_CONFIG || {})
};

const colours = ['#ff4fd8', '#00d8ff', '#28ff8a', '#ff7a00', '#7c3cff', '#ffed00'];

let client = null;
let wallLastSignature = '';
let wallIndex = 0;
let lastCloudAt = 0;
let lastCloudSignature = '';
let demoEntries = [...DEMO_DATA];

function $(id) {
  return document.getElementById(id);
}

function isConfigured() {
  return (
    APP_CONFIG.DEMO_MODE ||
    (
      APP_CONFIG.SUPABASE_URL &&
      APP_CONFIG.SUPABASE_ANON_KEY &&
      APP_CONFIG.SUPABASE_URL.includes('supabase.co') &&
      !APP_CONFIG.SUPABASE_ANON_KEY.includes('YOUR_')
    )
  );
}

function initClient() {
  if (APP_CONFIG.DEMO_MODE) {
    return null;
  }

  if (!isConfigured()) {
    const warning = $('configWarning');
    if (warning) warning.style.display = 'block';
    return null;
  }

  client = window.supabase.createClient(
    APP_CONFIG.SUPABASE_URL,
    APP_CONFIG.SUPABASE_ANON_KEY
  );

  return client;
}

function cssPerson() {
  return '<div class="css-person"></div>';
}

function personVisual(participant) {
  if (participant.photo_url && participant.photo_url.startsWith('http')) {
    return `<img src="${participant.photo_url}" alt="">`;
  }

  if (participant.photo_url && participant.photo_url.startsWith('data:image/')) {
    return `<img src="${participant.photo_url}" alt="">`;
  }

  return cssPerson();
}

function toast(message) {
  const toastElement = $('toast');
  if (!toastElement) return;

  toastElement.textContent = message;
  toastElement.style.display = 'block';

  setTimeout(() => {
    toastElement.style.display = 'none';
  }, 3000);
}

function normaliseParticipant(participant) {
  return {
    ...participant,
    where_label: participant.where_label || `${participant.region}, ${participant.country}`,
    photo_url: participant.photo_url || 'css-silhouette'
  };
}

function europeXY(lat, lon) {
  const minLon = -11;
  const maxLon = 31;
  const minLat = 35;
  const maxLat = 67;

  return {
    x: Math.max(4, Math.min(96, ((lon - minLon) / (maxLon - minLon)) * 100)),
    y: Math.max(5, Math.min(95, (1 - ((lat - minLat) / (maxLat - minLat))) * 100))
  };
}

async function getApproved() {
  if (APP_CONFIG.DEMO_MODE || !client) {
    return demoEntries
      .filter(item => item.approved)
      .sort((a, b) => Date.parse(b.approved_at || b.created_at || 0) - Date.parse(a.approved_at || a.created_at || 0))
      .map(normaliseParticipant);
  }

  const { data, error } = await client
    .from('participants')
    .select('*')
    .eq('approved', true)
    .order('approved_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(normaliseParticipant);
}

async function getAll() {
  if (APP_CONFIG.DEMO_MODE || !client) {
    return demoEntries.map(normaliseParticipant);
  }

  const { data, error } = await client
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    toast(error.message);
    return [];
  }

  return (data || []).map(normaliseParticipant);
}

async function insertParticipant(entry) {
  if (APP_CONFIG.DEMO_MODE || !client) {
    demoEntries.unshift({
      ...entry,
      id: `demo-user-${Date.now()}`,
      approved: false,
      created_at: new Date().toISOString()
    });
    return;
  }

  const { error } = await client
    .from('participants')
    .insert(entry);

  if (error) throw error;
}

async function updateParticipant(id, patch) {
  if (APP_CONFIG.DEMO_MODE || !client) {
    const entry = demoEntries.find(item => String(item.id) === String(id));
    if (entry) Object.assign(entry, patch);
    return;
  }

  const { error } = await client
    .from('participants')
    .update(patch)
    .eq('id', id);

  if (error) throw error;
}

async function deleteParticipant(id) {
  if (APP_CONFIG.DEMO_MODE || !client) {
    demoEntries = demoEntries.filter(item => String(item.id) !== String(id));
    return;
  }

  const { error } = await client
    .from('participants')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(',');
  const mime = (meta.match(/data:(.*);base64/) || [])[1] || 'image/jpeg';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}

async function uploadPhoto(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return null;
  }

  if (APP_CONFIG.DEMO_MODE || !client) {
    return dataUrl;
  }

  const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const blob = dataUrlToBlob(dataUrl);

  const { error } = await client.storage
    .from(APP_CONFIG.STORAGE_BUCKET)
    .upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: false
    });

  if (error) throw error;

  const { data } = client.storage
    .from(APP_CONFIG.STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

function buildCloud(list = []) {
  const cloud = $('cloud');
  if (!cloud) return;

  cloud.innerHTML = '';

  const source = list.length ? list : DEMO_DATA;

  for (let i = 0; i < 24; i++) {
    const participant = source[i % source.length];
    const card = document.createElement('div');

    card.className = 'cloud-card';
    card.style.left = `${Math.random() * 92}vw`;
    card.style.top = `${Math.random() * 84}vh`;
    card.style.transform = `scale(${0.75 + Math.random() * 0.9})`;
    card.innerHTML = personVisual(participant);

    cloud.appendChild(card);
  }

  lastCloudAt = Date.now();
  lastCloudSignature = source
    .map(participant => `${participant.id}:${participant.photo_url}`)
    .join('|');
}

function maybeBuildCloud(list) {
  const signature = list
    .map(participant => `${participant.id}:${participant.photo_url}`)
    .join('|');

  const elapsed = Date.now() - lastCloudAt;
  const hasNewPeople = signature !== lastCloudSignature;

  if (hasNewPeople || elapsed >= (APP_CONFIG.CLOUD_REFRESH_MS || 30000)) {
    buildCloud(list);
  }
}

function setWallPerson(participant, instant = false) {
  const animatedElements = [
    $('portraitWrap'),
    $('namePlate'),
    $('quotePanel')
  ].filter(Boolean);

  if (!instant) {
    animatedElements.forEach(element => element.classList.add('fade-out'));
  }

  setTimeout(() => {
    const accent = colours[(participant.full_name.length + String(participant.id).length) % colours.length];

    $('portraitWrap').innerHTML = personVisual(participant);
    $('name').textContent = participant.full_name;
    $('region').textContent = participant.where_label;
    $('quote').textContent = participant.quote;
    $('mapRegion').textContent = participant.where_label;

    $('blob').style.setProperty('--accent', accent);
    $('quotePanel').style.setProperty('--accent', accent);
    $('miniPin').style.background = accent;

    const position = europeXY(Number(participant.lat), Number(participant.lon));

    $('miniPin').style.left = `${position.x}%`;
    $('miniPin').style.top = `${position.y}%`;

    animatedElements.forEach(element => element.classList.remove('fade-out'));
  }, instant ? 0 : 520);
}

async function tickWall(force = false) {
  const list = await getApproved();

  if (!list.length) return;

  const signature = list
    .map(item => `${item.id}:${item.approved}:${item.approved_at || ''}`)
    .join('|');

  if (force || signature !== wallLastSignature) {
    wallLastSignature = signature;
    wallIndex = 0;
    setWallPerson(list[0], true);
    maybeBuildCloud(list);
    return;
  }

  wallIndex = (wallIndex + 1) % list.length;
  setWallPerson(list[wallIndex]);
  maybeBuildCloud(list);
}

async function pollWallChangesOnly() {
  const list = await getApproved();

  if (!list.length) return;

  const signature = list
    .map(item => `${item.id}:${item.approved}:${item.approved_at || ''}`)
    .join('|');

  if (signature !== wallLastSignature) {
    await tickWall(true);
  }
}

async function initWall() {
  initClient();

  await tickWall(true);

  setInterval(() => {
    tickWall(false);
  }, 15000);

  setInterval(() => {
    pollWallChangesOnly();
  }, APP_CONFIG.POLL_MS || 2000);

  if (client) {
    client
      .channel('participants-wall')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => tickWall(true)
      )
      .subscribe();
  }
}

function populateRegions() {
  const select = $('regionSelect');
  if (!select) return;

  REGION_OPTIONS.forEach(region => {
    const option = document.createElement('option');
    option.value = JSON.stringify(region);
    option.textContent = `${region.region}, ${region.country}`;
    select.appendChild(option);
  });
}

async function initKiosk() {
  initClient();
  populateRegions();

  let photoData = '';

  $('previewBox').innerHTML = cssPerson();

  const video = $('video');

  $('startCamera')?.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });

      video.srcObject = stream;
      video.play();

      toast('Camera started');
    } catch {
      toast('Camera unavailable');
    }
  });

  $('takePhoto')?.addEventListener('click', () => {
    if (!video.videoWidth) {
      toast('Start camera first');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 900;

    const context = canvas.getContext('2d');
    const size = Math.min(video.videoWidth, video.videoHeight);

    context.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      900,
      900
    );

    photoData = canvas.toDataURL('image/jpeg', 0.82);
    $('previewBox').innerHTML = `<img src="${photoData}" alt="">`;
  });

  $('kioskForm')?.addEventListener('submit', async event => {
    event.preventDefault();

    const form = event.currentTarget;
    const region = JSON.parse(form.region.value);

    try {
      const photoUrl = await uploadPhoto(photoData);

      await insertParticipant({
        first_name: form.firstName.value.trim(),
        last_name: form.lastName.value.trim(),
        full_name: `${form.firstName.value.trim()} ${form.lastName.value.trim()}`.trim(),
        region: region.region,
        country: region.country,
        where_label: `${region.region}, ${region.country}`,
        lat: region.lat,
        lon: region.lon,
        quote: form.quote.value.trim(),
        photo_url: photoUrl || 'css-silhouette',
        approved: false
      });

      form.reset();
      photoData = '';
      $('previewBox').innerHTML = cssPerson();

      toast('Submitted for approval');
    } catch (error) {
      console.error(error);
      toast(error.message || 'Submit failed');
    }
  });
}

async function initAdmin() {
  initClient();

  async function refreshAdminSessionUI() {
    if (!client) {
      toast('Configure Supabase first');
      return;
    }

    const { data } = await client.auth.getSession();
    const session = data && data.session ? data.session : null;

    const loginBox = document.querySelector('.admin-login');
    const adminList = $('adminList');

    if (session) {
      if (loginBox) loginBox.style.display = 'none';
      if (adminList) adminList.style.display = 'grid';
      await renderAdmin();
    } else {
      if (loginBox) loginBox.style.display = 'grid';
      if (adminList) adminList.style.display = 'none';
    }
  }

  $('loginBtn')?.addEventListener('click', async () => {
    if (!client) {
      toast('Configure Supabase first');
      return;
    }

    const email = $('adminEmail').value.trim();
    const password = $('adminPassword').value;

    const { error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast(error.message);
      return;
    }

    toast('Logged in');
    await refreshAdminSessionUI();
  });

  $('logoutBtn')?.addEventListener('click', async () => {
    await client?.auth.signOut();
    toast('Logged out');
    await refreshAdminSessionUI();
  });

  $('exportJson')?.addEventListener('click', async () => {
    const blob = new Blob(
      [JSON.stringify(await getAll(), null, 2)],
      { type: 'application/json' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'participants.json';
    link.click();
  });

  await refreshAdminSessionUI();

  if (client) {
    client
      .channel('participants-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => renderAdmin()
      )
      .subscribe();
  }
}

async function renderAdmin() {
  const listElement = $('adminList');

  if (!listElement) return;

  const entries = await getAll();

  listElement.innerHTML = '';

  entries.forEach(entry => {
    const row = document.createElement('div');
    row.className = 'admin-item';

    row.innerHTML = `
      <div class="admin-thumb">
        ${personVisual(entry)}
      </div>

      <div class="admin-text">
        <strong>${entry.full_name}</strong>
        <span>${entry.where_label}</span>
        <p>${entry.quote}</p>
        <span class="${entry.approved ? 'status-approved' : 'status-pending'}">
          ${entry.approved ? 'Approved' : 'Pending'}
        </span>
      </div>

      <div class="admin-actions">
        <button type="button" class="btn admin-action-btn" data-action="toggle" data-id="${entry.id}">
          ${entry.approved ? 'Hide' : 'Approve'}
        </button>

        <button type="button" class="btn danger admin-action-btn" data-action="delete" data-id="${entry.id}">
          Delete
        </button>
      </div>
    `;

    listElement.appendChild(row);
  });

  listElement.querySelectorAll('.admin-action-btn').forEach(button => {
    button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();

      try {
        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === 'toggle') {
          const entry = entries.find(item => String(item.id) === String(id));

          await updateParticipant(entry.id, {
            approved: !entry.approved,
            approved_at: !entry.approved ? new Date().toISOString() : null
          });
        }

        if (action === 'delete') {
          await deleteParticipant(id);
        }

        await renderAdmin();
      } catch (error) {
        console.error(error);
        toast(error.message || 'Action failed');
      }
    });
  });
}

async function initMap() {
  initClient();

  const map = $('bigMap');

  async function renderMap() {
    const oldPins = map.querySelectorAll('.big-pin');
    oldPins.forEach(pin => pin.remove());

    const list = await getApproved();

    $('mapCount').textContent = list.length;

    list.forEach((participant, index) => {
      const pin = document.createElement('div');
      const position = europeXY(Number(participant.lat), Number(participant.lon));

      pin.className = 'big-pin';
      pin.style.left = `${position.x}%`;
      pin.style.top = `${position.y}%`;
      pin.style.background = colours[index % colours.length];
      pin.innerHTML = `<span>${participant.full_name} · ${participant.where_label}</span>`;

      map.appendChild(pin);
    });
  }

  await renderMap();

  setInterval(renderMap, APP_CONFIG.POLL_MS || 2000);

  if (client) {
    client
      .channel('participants-map')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        renderMap
      )
      .subscribe();
  }
}
