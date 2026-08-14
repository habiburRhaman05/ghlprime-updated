# Team + Case Study Assignment Setup

Run `supabase/team-schema.sql` in the Supabase SQL editor.

This creates:

- `team_members`
- `case_study_team_members`

## What it enables

- manage team members from `/admin/team`
- assign teammates when creating a case study from `/admin/case-studies`
- show assigned teammates on public case study detail pages

## Notes

- images are stored as external URLs
- no Supabase storage bucket required for now
- leaders and team-page experts now support a manual `sort_order` / serial number so you can keep CEO or co-founders pinned at the top
- if you already ran the schema before, run the updated `alter table ... add column if not exists sort_order` statements from `supabase/team-schema.sql`
- if you want edit support next, add update policies and update forms
