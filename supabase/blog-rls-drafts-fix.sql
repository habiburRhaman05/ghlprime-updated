-- Fix: let the admin panel see and manage DRAFT blog posts.
--
-- Run this in the Supabase SQL editor (SQL Editor > New query > paste > Run).
--
-- WHY: The live RLS SELECT policy on public.blog_posts only exposes rows where
-- published = true ("public can read published blog posts"). That policy is
-- correct for the public website, but it also hides drafts (published = false)
-- from AUTHENTICATED users, so unpublished posts never show up in /admin/blog.
-- It also makes upserts of drafts fail with a misleading 42501, because
-- PostgREST's conflict-resolution path cannot read the rows the SELECT policy
-- hides.
--
-- This adds a second, additive SELECT policy scoped to the `authenticated`
-- role that returns ALL rows. PostgREST/Postgres combine SELECT policies with
-- OR, so:
--   - anonymous visitors  -> still see ONLY published = true (unchanged)
--   - authenticated admins -> see ALL posts, including drafts
--
-- Idempotent: drop-then-create so this is safe to re-run.

drop policy if exists "authenticated can read all blog posts" on public.blog_posts;
create policy "authenticated can read all blog posts"
on public.blog_posts for select to authenticated using (true);
