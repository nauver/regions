-- V9.5 migration - consent and NUTS metadata
-- Run this in Supabase SQL Editor before deploying the new kiosk.

alter table public.participants add column if not exists nuts_code text;
alter table public.participants add column if not exists consent_accepted boolean not null default false;
alter table public.participants add column if not exists consent_version text;
alter table public.participants add column if not exists consent_at timestamptz;

-- Optional: for future-proofing, ensure public kiosk insert can only insert pending items.
drop policy if exists "Public can insert pending participants" on public.participants;
create policy "Public can insert pending participants"
on public.participants
for insert
to anon, authenticated
with check (approved = false and consent_accepted = true);
