
# Proud of My Region — V9 GitHub Pages + Supabase

This version replaces `localStorage` with Supabase.

## Pages

- `/index.html` — public wall
- `/kiosk.html` — form + webcam
- `/admin.html` — moderation
- `/map.html` — regional map

No navigation buttons are visible. Pages are accessed directly by URL.

## 1. Create Supabase project

1. Create a Supabase project.
2. Go to **SQL Editor**.
3. Run `supabase-schema.sql`.
4. Create one admin user in **Authentication → Users**.
5. Replace `YOUR.ADMIN.EMAIL@EXAMPLE.COM` in the SQL and run the insert again, or manually insert your admin email into `public.admin_users`.

## 2. Configure frontend

Edit:

```js
assets/config.js
```

Set:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
  STORAGE_BUCKET: 'participant-photos',
  DEMO_MODE: false,
  POLL_MS: 2000
};
```

The anon key is public by design. Access control is handled by Supabase Row Level Security policies.

## 3. Deploy to GitHub Pages

Repo structure:

```text
index.html
kiosk.html
admin.html
map.html
assets/
  app.js
  config.js
  styles.css
  logo_CoR-vertical-negative-en-quadri_LR.png
supabase-schema.sql
.nojekyll
```

GitHub:

```text
Settings → Pages → Deploy from branch → main → / root
```

## 4. Test flow

1. Open `/kiosk.html`.
2. Take photo and submit.
3. Open `/admin.html`.
4. Login using the Supabase Auth admin account.
5. Approve the submission.
6. Open `/index.html`.

The newest approved profile should appear quickly. The wall polls every 2 seconds and also listens for Supabase realtime changes when available.

## 5. Notes

- Demo profiles use CSS silhouettes.
- Real camera photos are uploaded to Supabase Storage and displayed in the wall background cloud and central portrait.
- For production, review storage upload restrictions and admin RLS policies.
