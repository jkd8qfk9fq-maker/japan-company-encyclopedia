-- Billing: which product a subscription belongs to (JCE-133). Until now the entitlement record held no
-- product, so /api/plan counted any live subscription as paid for every paid layer — a ¥390 企業タイプ診断
-- code also opened the ¥1,100 学習β analysis layer. The webhook now records the subscription's product and
-- price (from its first item), invoice.paid fills them in when its lines carry a price, and /api/plan
-- answers which plan a code is. Both columns stay nullable: rows written before this migration have no
-- product, and those are read as the ¥390 premium plan (the analysis layer opens only for a subscription
-- the record confirms is the 学習β product).
ALTER TABLE entitlements ADD COLUMN product_id TEXT;  -- Stripe product id (prod_…), when the event carried one
ALTER TABLE entitlements ADD COLUMN price_id TEXT;    -- Stripe price id (price_…), when the event carried one
