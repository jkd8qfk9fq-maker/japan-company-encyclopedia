-- Web Push subscriptions (JCE-059). Anonymous: the browser's push address and its two keys, and the ids of the companies
-- it asked to hear about. No IP address, no user agent, no name or e-mail — nothing that says who the reader is.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,            -- SHA-256 of the endpoint, hex
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  updated_at TEXT NOT NULL        -- refreshed whenever the browser re-sends its list; idle ones are removed after 180 days
);
CREATE TABLE IF NOT EXISTS push_follows (
  subscription_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  PRIMARY KEY (subscription_id, company_id)
);
CREATE INDEX IF NOT EXISTS push_follows_company ON push_follows (company_id);
-- Which update events (/updates.json) have been announced already, so each is announced once.
CREATE TABLE IF NOT EXISTS push_seen (
  key TEXT PRIMARY KEY,
  seen_at TEXT NOT NULL
);
