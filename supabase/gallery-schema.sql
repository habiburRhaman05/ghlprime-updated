-- ============================================================================
-- Gallery: admin-managed image gallery with reorderable categories (tabs)
-- and images assigned to a category.
--
-- Run this once in the Supabase Dashboard SQL editor (Project -> SQL Editor).
-- Safe to re-run: uses "if not exists" and drops/re-creates policies.
-- ============================================================================

-- 1. gallery_categories  (the filter tabs on /gallery)
create table if not exists public.gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists gallery_categories_sort_order_idx on public.gallery_categories(sort_order);
alter table public.gallery_categories enable row level security;
drop policy if exists "public can read published gallery categories" on public.gallery_categories;
create policy "public can read published gallery categories" on public.gallery_categories for select using (published = true);
drop policy if exists "authenticated users can insert gallery categories" on public.gallery_categories;
create policy "authenticated users can insert gallery categories" on public.gallery_categories for insert to authenticated with check (true);
drop policy if exists "authenticated users can update gallery categories" on public.gallery_categories;
create policy "authenticated users can update gallery categories" on public.gallery_categories for update to authenticated using (true) with check (true);
drop policy if exists "authenticated users can delete gallery categories" on public.gallery_categories;
create policy "authenticated users can delete gallery categories" on public.gallery_categories for delete to authenticated using (true);

-- 2. gallery_images  (each image belongs to at most one category)
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category_id uuid references public.gallery_categories(id) on delete set null,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists gallery_images_sort_order_idx on public.gallery_images(sort_order);
create index if not exists gallery_images_category_id_idx on public.gallery_images(category_id);
alter table public.gallery_images enable row level security;
drop policy if exists "public can read published gallery images" on public.gallery_images;
create policy "public can read published gallery images" on public.gallery_images for select using (published = true);
drop policy if exists "authenticated users can insert gallery images" on public.gallery_images;
create policy "authenticated users can insert gallery images" on public.gallery_images for insert to authenticated with check (true);
drop policy if exists "authenticated users can update gallery images" on public.gallery_images;
create policy "authenticated users can update gallery images" on public.gallery_images for update to authenticated using (true) with check (true);
drop policy if exists "authenticated users can delete gallery images" on public.gallery_images;
create policy "authenticated users can delete gallery images" on public.gallery_images for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Sample data (so /gallery shows content immediately on localhost).
-- Replace image_url values with your own from /admin/gallery afterwards.
-- ---------------------------------------------------------------------------
insert into public.gallery_categories (name, slug, sort_order) values
  ('Events',          'events',   1),
  ('Office',          'office',   2),
  ('Team Activities', 'team',     3)
on conflict (slug) do nothing;

insert into public.gallery_images (title, image_url, category_id, sort_order)
select 'Team workshop', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60',
       (select id from public.gallery_categories where slug = 'events'), 1
where not exists (select 1 from public.gallery_images);

insert into public.gallery_images (title, image_url, category_id, sort_order)
select 'At the office', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=60',
       (select id from public.gallery_categories where slug = 'office'), 2
where (select count(*) from public.gallery_images) < 2;

insert into public.gallery_images (title, image_url, category_id, sort_order)
select 'Team lunch', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=60',
       (select id from public.gallery_categories where slug = 'team'), 3
where (select count(*) from public.gallery_images) < 3;

-- Done. Visit /admin/gallery to manage, and /gallery to see the page.
