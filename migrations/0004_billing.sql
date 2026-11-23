-- Billing entitlements (JCE-100): the encyclopedia's own record of who has paid, fed by Stripe webhooks
-- (worker/billing) instead of asking the 企業タイプ診断 site's Worker to look every code up at Stripe.
-- One row per purchase code (the Stripe subscription id the reader holds). No name and no address is
-- stored; the e-mail is kept only when Stripe's own event carries it (invoice.paid), for support lookups.
CREATE TABLE IF NOT EXISTS entitlements (
  code TEXT PRIMARY KEY,        -- the purchase code: a Stripe subscription id (sub_…)
  customer_id TEXT,             -- Stripe customer id, when the event carried one
  email TEXT,                   -- only from Stripe events that print it; never collected on this site
  status TEXT NOT NULL,         -- the Stripe subscription status, as last reported (active, trialing, …)
  paid_until INTEGER NOT NULL,  -- when the current paid period ends, ms since the epoch (Stripe seconds × 1000)
  source TEXT NOT NULL,         -- "stripe" (webhook) or "beta-manual" (the operator recorded a 学習β grant by hand)
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- Every Stripe event id once: a redelivered webhook must not move an entitlement twice.
CREATE TABLE IF NOT EXISTS billing_events (
  id TEXT PRIMARY KEY,          -- the Stripe event id (evt_…)
  type TEXT NOT NULL,
  received_at TEXT NOT NULL
);
