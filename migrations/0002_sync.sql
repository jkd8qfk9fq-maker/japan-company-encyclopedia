-- Moving this browser's lists to another device (JCE-065). One row per link sent, for 30 minutes at most, read once.
-- No e-mail address, IP address or user agent: the row holds the lists and two hashes of random keys.
CREATE TABLE IF NOT EXISTS sync_transfers (
  id TEXT PRIMARY KEY,            -- SHA-256 of the one-time token in the mailed link, hex
  cancel_id TEXT NOT NULL UNIQUE, -- SHA-256 of the key the sending browser keeps, to withdraw or replace the link
  data TEXT NOT NULL,             -- the lists, JSON
  expires_at INTEGER NOT NULL     -- ms since epoch
);
CREATE INDEX IF NOT EXISTS sync_transfers_expires ON sync_transfers (expires_at);
