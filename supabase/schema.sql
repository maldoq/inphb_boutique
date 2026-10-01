create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  email text not null,
  school text not null,
  education_level text not null,
  specialty text not null,
  years_experience integer not null check (years_experience >= 0),
  design_level text not null check (design_level in ('Intermediate', 'Advanced', 'Expert')),
  experience_areas text[] not null default '{}',
  software_skills text[] not null default '{}',
  main_software text not null,
  has_physical_product_experience boolean not null default false,
  product_types text[] not null default '{}',
  has_professional_mockups boolean not null default false,
  portfolio_url text,
  portfolio_file_path text,
  commitment boolean not null check (commitment = true),
  candidate_score integer not null check (candidate_score between 0 and 100),
  submitted_at timestamptz not null default now()
);

create index if not exists applications_submitted_at_idx on public.applications (submitted_at desc);
create index if not exists applications_candidate_score_idx on public.applications (candidate_score desc);
create index if not exists applications_email_idx on public.applications (lower(email));

alter table public.applications enable row level security;
revoke all on public.applications from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applications', 'applications', false, 10485760, array['image/jpeg', 'image/png', 'application/pdf'])
on conflict (id) do update
set public = false, file_size_limit = 10485760, allowed_mime_types = excluded.allowed_mime_types;
