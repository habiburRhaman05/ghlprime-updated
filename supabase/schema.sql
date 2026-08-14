create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  subtitle text,
  challenge text,
  solution text,
  outcome text,
  excerpt text,
  image text,
  accent text default 'emerald',
  body jsonb default '[]'::jsonb,
  featured boolean default false,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists case_studies_slug_idx on public.case_studies(slug);
create index if not exists case_studies_category_idx on public.case_studies(category);

alter table public.case_studies enable row level security;

create policy "public can read published case studies"
on public.case_studies
for select
using (published = true);

create policy "authenticated users can insert case studies"
on public.case_studies
for insert
to authenticated
with check (true);

create policy "authenticated users can update case studies"
on public.case_studies
for update
to authenticated
using (true)
with check (true);

create table if not exists public.partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  website_url text,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists partner_logos_sort_order_idx on public.partner_logos(sort_order);

alter table public.partner_logos enable row level security;

create policy "public can read published partner logos"
on public.partner_logos
for select
using (published = true);

create policy "authenticated users can insert partner logos"
on public.partner_logos
for insert
to authenticated
with check (true);

create policy "authenticated users can update partner logos"
on public.partner_logos
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete partner logos"
on public.partner_logos
for delete
to authenticated
using (true);

create table if not exists public.meeting_gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists meeting_gallery_sort_order_idx on public.meeting_gallery(sort_order);

alter table public.meeting_gallery enable row level security;

create policy "public can read published meeting gallery"
on public.meeting_gallery
for select
using (published = true);

create policy "authenticated users can insert meeting gallery"
on public.meeting_gallery
for insert
to authenticated
with check (true);

create policy "authenticated users can update meeting gallery"
on public.meeting_gallery
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete meeting gallery"
on public.meeting_gallery
for delete
to authenticated
using (true);

create table if not exists public.technology_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists technology_logos_sort_order_idx on public.technology_logos(sort_order);

alter table public.technology_logos enable row level security;

create policy "public can read published technology logos"
on public.technology_logos
for select
using (published = true);

create policy "authenticated users can insert technology logos"
on public.technology_logos
for insert
to authenticated
with check (true);

create policy "authenticated users can update technology logos"
on public.technology_logos
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete technology logos"
on public.technology_logos
for delete
to authenticated
using (true);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  company text,
  message text,
  source text,
  submitted_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists contact_leads_email_idx on public.contact_leads(email);
create index if not exists contact_leads_submitted_at_idx on public.contact_leads(submitted_at desc);

alter table public.contact_leads enable row level security;

create policy "authenticated users can read contact leads"
on public.contact_leads
for select
to authenticated
using (true);

create policy "authenticated users can insert contact leads"
on public.contact_leads
for insert
to authenticated
with check (true);
