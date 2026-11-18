-- Notifications by e-mail for followed companies (JCE-069), for readers whose browser cannot or will not show web
-- notifications. Unlike push (0001), this stores an e-mail address — only after the reader confirmed it from the
-- mailed link, deleted on 「メールの配信を止める」 or the stop link in any mail; an unconfirmed address is gone after 24 hours.
CREATE TABLE IF NOT EXISTS mail_subscriptions (
  id TEXT PRIMARY KEY,           -- SHA-256 of the key the registering browser keeps, hex
  stop_key TEXT NOT NULL UNIQUE, -- random; put in every mail as the stop link (it can only stop this subscription)
  confirm_id TEXT UNIQUE,        -- SHA-256 of the token in the confirmation mail; NULL once confirmed
  email TEXT NOT NULL,
  kinds TEXT NOT NULL,           -- what the reader chose: "results", "corrections" or both, comma-separated
  confirmed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS mail_follows (
  subscription_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  PRIMARY KEY (subscription_id, company_id)
);
CREATE INDEX IF NOT EXISTS mail_follows_company ON mail_follows (company_id);
-- Each /updates.json event once, separately from push_seen so the two channels never hold each other back.
CREATE TABLE IF NOT EXISTS mail_seen (
  key TEXT PRIMARY KEY,
  seen_at TEXT NOT NULL
);
-- Who already got which event, while a run's sending budget leaves others for the next run.
CREATE TABLE IF NOT EXISTS mail_delivered (
  subscription_id TEXT NOT NULL,
  key TEXT NOT NULL,
  PRIMARY KEY (subscription_id, key)
);
