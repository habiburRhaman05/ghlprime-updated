# Supabase Case Studies Plan

## Goal

Make the Client Studies section dynamic from Supabase so case studies can be:

- created from backend/admin tools
- listed on `/client-studies`
- opened on a shareable public URL like `/client-studies/:slug`
- expanded later with richer media/content blocks

## Environment variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## SQL

Run the contents of `supabase/schema.sql` in the Supabase SQL editor.

## Suggested next implementation steps

1. Create a Supabase project
2. Run the schema
3. Add env vars locally and in Vercel
4. Replace static fallback data with live admin-managed content
5. Build authenticated admin CRUD for `/admin/case-studies`

## Important note

The frontend is already prepared to:

- read case studies from Supabase when env vars exist
- fall back to local mock data when they do not

## What still needs Supabase access

To actually create the database/project for you, I need either:

- your Supabase project credentials/access, or
- an existing project URL + anon key + service role (if admin work is needed)
