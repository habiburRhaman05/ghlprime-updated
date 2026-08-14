-- GHL Prime API — schema for the tables this Express API owns.
--
-- IMPORTANT: this file only defines `admin_users`, `contact_leads`, and the
-- three Auto Blog (AI blog-writing) tables (`blog_ai_settings`,
-- `blog_ai_accounts`, `blog_ai_runs`).
-- The other 13 tables (blog_posts, case_studies, case_study_team_members,
-- gallery_categories, gallery_images, meeting_gallery, partner_logos,
-- showcase_items, showcase_placements, showcase_stats, team_members,
-- team_page_members, technology_logos) already exist on the VPS — they were
-- restored from the Supabase pg_dump with matching row counts — so this file
-- does NOT redefine them. Run this file once against the `ghlprime` database:
--
--   psql "$DATABASE_URL" -f schema.sql

create extension if not exists pgcrypto;

-- Admin accounts for the JWT-based login (replaces Supabase Auth).
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_users_email_idx on admin_users (lower(email));

-- Contact form submissions. This table never existed in Supabase (see repo
-- history / api/contact-submit.js), so every prior contact-page submission
-- silently failed to persist — this migration fixes that going forward.
create table if not exists contact_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  company text,
  message text,
  source text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists contact_leads_email_idx on contact_leads (email);
create index if not exists contact_leads_submitted_at_idx on contact_leads (submitted_at desc);

-- Auto Blog: admin-configured AI blog-writing feature. Primarily uses the
-- admin's own Claude Code / Codex CLI subscription logins (not API keys) to
-- generate SEO-optimized posts into the existing `blog_posts` table; a
-- given Claude account can opt into a plain Anthropic API key instead as an
-- advanced, per-account alternative (see blog_ai_accounts.auth_type below).

-- Singleton row (id is always `true`) holding the shared generation
-- settings. Codex has no per-account rotation (see blog_ai_accounts below),
-- so its model/enabled toggle lives here instead of in its own table row.
create table if not exists blog_ai_settings (
  id boolean primary key default true check (id),
  instructions text,
  keywords text,
  advanced_instructions text,
  auto_publish boolean not null default false,
  schedule_hour integer not null default 6,
  posts_per_day integer not null default 1,
  codex_enabled boolean not null default false,
  codex_model text not null default '',
  claude_model text not null default '',
  claude_cli_command text,
  codex_cli_command text,
  updated_at timestamptz not null default now()
);

-- Additive migration for installs where blog_ai_settings already existed
-- before the columns above were introduced (the `create table if not
-- exists` above is a no-op on those installs, so the columns must be added
-- explicitly here to actually reach the live table).
alter table blog_ai_settings add column if not exists posts_per_day integer not null default 1;
alter table blog_ai_settings add column if not exists claude_model text not null default '';
alter table blog_ai_settings add column if not exists claude_cli_command text;
alter table blog_ai_settings add column if not exists codex_cli_command text;

-- Claude Code CLI accounts that the engine rotates through -- one row per
-- pasted `claude setup-token` OAuth token (auth_type = 'oauth', the
-- default) or, as an advanced opt-in, a plain Anthropic API key
-- (auth_type = 'api_key'). Codex uses a single ambient device-auth login on
-- the VPS instead (see blog_ai_settings.codex_* above) so it never gets
-- rows here.
create table if not exists blog_ai_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('claude', 'codex')),
  label text not null,
  token text,
  token_preview text,
  model text,
  auth_type text not null default 'oauth' check (auth_type in ('oauth', 'api_key')),
  enabled boolean not null default true,
  status text not null default 'idle',
  cooldown_until timestamptz,
  done_count integer not null default 0,
  failed_count integer not null default 0,
  last_used_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create index if not exists blog_ai_accounts_provider_idx on blog_ai_accounts (provider);

-- Additive migration for installs where blog_ai_accounts already existed
-- before auth_type was introduced (see the blog_ai_settings migration note
-- above — same reasoning).
alter table blog_ai_accounts add column if not exists auth_type text not null default 'oauth' check (auth_type in ('oauth', 'api_key'));

-- Audit log of every generation attempt (manual "Run Now" or hourly cron).
create table if not exists blog_ai_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'running' check (status in ('running', 'success', 'failed')),
  provider text,
  account_label text,
  blog_post_id uuid references blog_posts(id) on delete set null,
  error text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists blog_ai_runs_started_at_idx on blog_ai_runs (started_at desc);
