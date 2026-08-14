-- ============================================================================
-- "Shipped Evidence" showcase: origin -> enterprise-adaptation paired cards,
-- a flexible stat bar, and per-page placement control.
--
-- Run this once in the Supabase Dashboard SQL editor (Project -> SQL Editor).
-- Safe to re-run: uses "if not exists" and drops/re-creates policies.
-- ============================================================================

-- 1. showcase_items  (the library of origin -> adaptation pairs)
create table if not exists public.showcase_items (
  id uuid primary key default gen_random_uuid(),
  origin_name text not null,
  origin_url text,
  origin_icon text,
  origin_description text,
  origin_tagline text,
  adaptation_badge text default 'Enterprise Adaptation',
  adaptation_name text not null,
  adaptation_description text,
  adaptation_tags jsonb default '[]'::jsonb,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists showcase_items_sort_order_idx on public.showcase_items(sort_order);
alter table public.showcase_items enable row level security;
drop policy if exists "public can read published showcase items" on public.showcase_items;
create policy "public can read published showcase items" on public.showcase_items for select using (published = true);
drop policy if exists "authenticated users can insert showcase items" on public.showcase_items;
create policy "authenticated users can insert showcase items" on public.showcase_items for insert to authenticated with check (true);
drop policy if exists "authenticated users can update showcase items" on public.showcase_items;
create policy "authenticated users can update showcase items" on public.showcase_items for update to authenticated using (true) with check (true);
drop policy if exists "authenticated users can delete showcase items" on public.showcase_items;
create policy "authenticated users can delete showcase items" on public.showcase_items for delete to authenticated using (true);

-- 2. showcase_stats  (the stat-bar tiles: value + label, reorderable)
create table if not exists public.showcase_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order integer not null default 999,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists showcase_stats_sort_order_idx on public.showcase_stats(sort_order);
alter table public.showcase_stats enable row level security;
drop policy if exists "public can read published showcase stats" on public.showcase_stats;
create policy "public can read published showcase stats" on public.showcase_stats for select using (published = true);
drop policy if exists "authenticated users can insert showcase stats" on public.showcase_stats;
create policy "authenticated users can insert showcase stats" on public.showcase_stats for insert to authenticated with check (true);
drop policy if exists "authenticated users can update showcase stats" on public.showcase_stats;
create policy "authenticated users can update showcase stats" on public.showcase_stats for update to authenticated using (true) with check (true);
drop policy if exists "authenticated users can delete showcase stats" on public.showcase_stats;
create policy "authenticated users can delete showcase stats" on public.showcase_stats for delete to authenticated using (true);

-- 3. showcase_placements  (which item on which page, in what order)
create table if not exists public.showcase_placements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.showcase_items(id) on delete cascade,
  page_key text not null,
  sort_order integer not null default 999,
  enabled boolean not null default true,
  created_at timestamptz default now(),
  unique(item_id, page_key)
);
create index if not exists showcase_placements_page_key_idx on public.showcase_placements(page_key);
alter table public.showcase_placements enable row level security;
drop policy if exists "public can read showcase placements" on public.showcase_placements;
create policy "public can read showcase placements" on public.showcase_placements for select using (true);
drop policy if exists "authenticated users can insert showcase placements" on public.showcase_placements;
create policy "authenticated users can insert showcase placements" on public.showcase_placements for insert to authenticated with check (true);
drop policy if exists "authenticated users can update showcase placements" on public.showcase_placements;
create policy "authenticated users can update showcase placements" on public.showcase_placements for update to authenticated using (true) with check (true);
drop policy if exists "authenticated users can delete showcase placements" on public.showcase_placements;
create policy "authenticated users can delete showcase placements" on public.showcase_placements for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Sample data (so the section shows content immediately on localhost).
-- origin_icon is left blank here; add an emoji or image URL from the panel.
-- Manage everything at /admin/showcase afterwards.
-- ---------------------------------------------------------------------------
insert into public.showcase_stats (value, label, sort_order) values
  ('10+',   'LIVE PRODUCTS',       1),
  ('100K+', 'USERS SERVED',        2),
  ('6',     'ENTERPRISE SYSTEMS',  3),
  ('5+',    'YEARS IN PRODUCTION', 4)
on conflict do nothing;

with seeded as (
  insert into public.showcase_items
    (origin_name, origin_url, origin_icon, origin_description, origin_tagline,
     adaptation_badge, adaptation_name, adaptation_description, adaptation_tags, sort_order)
  values
    ('PhotoFox AI', 'photofoxai.com', '',
     'Lets anyone turn a photo into a branded campaign visual in seconds. Used by 50K+ creators, marketers, and small teams.',
     'Photo -> branded campaign visual',
     'Enterprise Adaptation', 'Chitron AI',
     'AI Creative Infrastructure for retail and D2C teams. Batch visual generation with brand consistency enforced at scale, connected via API to your existing commerce stack.',
     '["RETAIL","D2C","BRAND"]'::jsonb, 1),
    ('Vocalo AI', 'vocalo.ai', '',
     'Real-time AI voice coaching and speech analysis for individuals. 100K+ voice interactions processed, with live feedback on tone, clarity, and pacing.',
     'Real-time AI voice + speech analysis',
     'Enterprise Adaptation', 'Dhoni AI',
     'AI Communication Intelligence for call centers and sales teams. Live agent assist, post-call analytics, compliance flagging, and CRM integration on enterprise telephony.',
     '["BPO","CALL CENTERS","HR","SALES"]'::jsonb, 2),
    ('SketchToImage', 'sketchtoimage.com', '',
     'Transforms hand-drawn sketches into polished visuals in one click. Built for designers, architects, and product teams who think in rough drafts.',
     'Sketch -> polished visual',
     'Enterprise Adaptation', 'Rupon AI',
     'AI Design Visualization for architecture, real estate, and product studios. From concept sketch to client-ready rendering with brand templates and revision history.',
     '["ARCHITECTURE","REAL ESTATE","PRODUCT DESIGN"]'::jsonb, 3)
  returning id, sort_order
)
insert into public.showcase_placements (item_id, page_key, sort_order, enabled)
select id, 'home', sort_order, true from seeded;

-- Done. Visit /admin/showcase to manage, and / to see the section.
