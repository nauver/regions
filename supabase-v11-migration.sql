-- Proud of My Region V11 migration
-- Run in Supabase SQL Editor after your existing V9 schema.

alter table public.participants add column if not exists nuts_code text;
alter table public.participants add column if not exists consent_accepted boolean not null default false;
alter table public.participants add column if not exists consent_version text;
alter table public.participants add column if not exists consent_at timestamptz;
alter table public.participants add column if not exists retention_until timestamptz;

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null,
  participant_id uuid,
  details text,
  app_version text,
  actor_email text default (auth.jwt() ->> 'email')
);

alter table public.audit_log enable row level security;

drop policy if exists "Admins can read audit log" on public.audit_log;
create policy "Admins can read audit log"
on public.audit_log
for select
to authenticated
using (exists (select 1 from public.admin_users au where au.email = auth.jwt() ->> 'email'));

drop policy if exists "Admins can insert audit log" on public.audit_log;
create policy "Admins can insert audit log"
on public.audit_log
for insert
to authenticated
with check (exists (select 1 from public.admin_users au where au.email = auth.jwt() ->> 'email'));

-- Public kiosk insert: pending only and consent required.
drop policy if exists "Public can insert pending participants" on public.participants;
create policy "Public can insert pending participants"
on public.participants
for insert
to anon, authenticated
with check (approved = false and consent_accepted = true);
