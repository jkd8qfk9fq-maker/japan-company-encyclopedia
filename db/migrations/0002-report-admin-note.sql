-- Correction notes on a report (Git-Based Correction System spec §11): what the
-- editor found when checking the report against its sources, and what was done.
-- A note is not a revision: the revision records the content change itself.

alter table content_reports
  add column if not exists admin_note text check (char_length(admin_note) <= 4000);
