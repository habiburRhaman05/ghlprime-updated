-- Blog posts schema for GHL Prime.
-- Run this in the Supabase SQL editor (SQL Editor > New query > paste > Run).
-- This is additive and safe to re-run: it uses "create table if not exists"
-- and guarded indexes/policies.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  tags text[] default '{}',
  author text default 'GHL Prime Team',
  excerpt text,
  cover_image text,
  reading_time integer,
  content text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  featured boolean default false,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts(slug);
create index if not exists blog_posts_category_idx on public.blog_posts(category);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc);

alter table public.blog_posts enable row level security;

create policy "public can read published blog posts"
on public.blog_posts
for select
using (published = true);

-- Authenticated users (the admin panel) must be able to read ALL posts,
-- including drafts (published = false). The public-read policy above only
-- exposes published = true, so without this policy drafts never appear in
-- /admin/blog. Idempotent: drop-then-create so re-running is safe.
drop policy if exists "authenticated can read all blog posts" on public.blog_posts;
create policy "authenticated can read all blog posts"
on public.blog_posts for select to authenticated using (true);

create policy "authenticated users can insert blog posts"
on public.blog_posts
for insert
to authenticated
with check (true);

create policy "authenticated users can update blog posts"
on public.blog_posts
for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete blog posts"
on public.blog_posts
for delete
to authenticated
using (true);
