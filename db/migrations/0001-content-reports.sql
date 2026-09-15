-- Content reports submitted by readers (docs/decisions.md, JCE-008).
--
-- SQL identifiers are snake_case: hyphens would need quoting in every query.
-- The kebab-case rule covers files, routes and storage keys, not columns.
--
-- The CHECK constraints repeat the application's validation on purpose: the
-- database is the last line if a future code path forgets to validate.

create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  company_id text check (company_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  industry_id text check (industry_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  feature_id text check (feature_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (category in (
    'company-information', 'business-information', 'financial-information',
    'history', 'industry-classification', 'other'
  )),
  message text not null check (char_length(message) between 1 and 2000),
  page_path text check (page_path ~ '^/[a-z0-9/-]*$' and page_path !~ '^//'),
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'rejected')),
  -- HMAC of the sender's IP with a server secret: counts reports per sender for
  -- rate limiting without storing the address itself.
  submitter_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_reports_status_created_idx on content_reports (status, created_at desc);
create index if not exists content_reports_submitter_created_idx on content_reports (submitter_hash, created_at desc);
