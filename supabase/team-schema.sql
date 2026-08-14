create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  description text,
  image_url text,
  sort_order integer not null default 999,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.team_members
  add column if not exists sort_order integer not null default 999;

alter table public.team_members add column if not exists linkedin_url text;
alter table public.team_members add column if not exists facebook_url text;
alter table public.team_members add column if not exists instagram_url text;
alter table public.team_members add column if not exists twitter_url text;
alter table public.team_members add column if not exists upwork_url text;
alter table public.team_members add column if not exists website_url text;

create table if not exists public.case_study_team_members (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  team_member_id uuid not null references public.team_members(id) on delete cascade,
  created_at timestamptz default now(),
  unique(case_study_id, team_member_id)
);

alter table public.team_members enable row level security;
alter table public.case_study_team_members enable row level security;

create policy "public can read team members"
on public.team_members
for select
using (true);

create policy "public can read case study team assignments"
on public.case_study_team_members
for select
using (true);

create policy "authenticated users can insert team members"
on public.team_members
for insert
to authenticated
with check (true);

create policy "authenticated users can update team members"
on public.team_members
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete team members"
on public.team_members
for delete
to authenticated
using (true);

create policy "authenticated users can insert case study assignments"
on public.case_study_team_members
for insert
to authenticated
with check (true);
