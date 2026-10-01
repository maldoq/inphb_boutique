-- Suivi de candidature + préparation admin. À exécuter APRÈS schema.sql.
alter table public.applications
  add column if not exists status text not null default 'received'
    check (status in ('received','reviewing','shortlisted','accepted','rejected')),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists applications_status_idx on public.applications (status);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists applications_touch_updated_at on public.applications;
create trigger applications_touch_updated_at before update on public.applications
  for each row execute function public.touch_updated_at();

-- Seule porte publique : connaître le statut d'une candidature dont on possède la référence (UUID).
create or replace function public.get_application_status(p_id uuid)
returns table (status text, submitted_at timestamptz)
language sql security definer set search_path = public as $$
  select a.status, a.submitted_at from public.applications a where a.id = p_id
$$;
revoke all on function public.get_application_status(uuid) from public;
grant execute on function public.get_application_status(uuid) to anon, authenticated;