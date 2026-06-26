
-- Proud of My Region V9 - Supabase schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  full_name text not null,
  region text not null,
  country text not null,
  where_label text not null,
  lat numeric not null,
  lon numeric not null,
  quote text not null check (char_length(quote) <= 160),
  photo_url text,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.admin_users (
  email text primary key
);

-- Replace with your admin email created in Supabase Auth.
insert into public.admin_users(email)
values ('YOUR.ADMIN.EMAIL@EXAMPLE.COM')
on conflict (email) do nothing;

alter table public.participants enable row level security;
alter table public.admin_users enable row level security;

-- Public wall/map: approved rows only.
drop policy if exists "Public can read approved participants" on public.participants;
create policy "Public can read approved participants"
on public.participants
for select
to anon, authenticated
using (
  approved = true
  or exists (
    select 1 from public.admin_users au
    where au.email = auth.jwt() ->> 'email'
  )
);

-- Public kiosk insert: force pending submissions.
drop policy if exists "Public can insert pending participants" on public.participants;
create policy "Public can insert pending participants"
on public.participants
for insert
to anon, authenticated
with check (approved = false);

-- Admin update/delete.
drop policy if exists "Admins can update participants" on public.participants;
create policy "Admins can update participants"
on public.participants
for update
to authenticated
using (
  exists (select 1 from public.admin_users au where au.email = auth.jwt() ->> 'email')
)
with check (
  exists (select 1 from public.admin_users au where au.email = auth.jwt() ->> 'email')
);

drop policy if exists "Admins can delete participants" on public.participants;
create policy "Admins can delete participants"
on public.participants
for delete
to authenticated
using (
  exists (select 1 from public.admin_users au where au.email = auth.jwt() ->> 'email')
);

-- Admin table readable only by admins.
drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (email = auth.jwt() ->> 'email');

-- Storage bucket.
insert into storage.buckets (id, name, public)
values ('participant-photos', 'participant-photos', true)
on conflict (id) do update set public = true;

-- Public uploads from kiosk.
drop policy if exists "Public can upload participant photos" on storage.objects;
create policy "Public can upload participant photos"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'participant-photos');

-- Public photo display.
drop policy if exists "Public can read participant photos" on storage.objects;
create policy "Public can read participant photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'participant-photos');

-- Optional: admins can delete uploaded photos.
drop policy if exists "Admins can delete participant photos" on storage.objects;
create policy "Admins can delete participant photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'participant-photos'
  and exists (select 1 from public.admin_users au where au.email = auth.jwt() ->> 'email')
);

-- Optional demo seed. Leave commented if you want an empty database.
/*
insert into public.participants(first_name,last_name,full_name,region,country,where_label,lat,lon,quote,photo_url,approved,approved_at)
values
('Ana','Laurent','Ana Laurent','Occitanie','France','Occitanie, France',43.61,1.44,'Mountains, sea and cities meet in one living culture.','css-silhouette',true,now()),
('Milan','Horvat','Milan Horvat','Istria','Croatia','Istria, Croatia',45.24,13.94,'Coastal traditions and multilingual heritage make the region recognisable.','css-silhouette',true,now()),
('Sofia','Mendes','Sofia Mendes','Lisbon Metropolitan Area','Portugal','Lisbon Metropolitan Area, Portugal',38.72,-9.14,'Atlantic light, creativity and openness give the region its energy.','css-silhouette',true,now());
*/
