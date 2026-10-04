-- =====================================================================
--  SPACE 404  |  Full Schema + Seed (run ONCE via Supabase SQL Editor)
--  Copy/paste this entire file into Supabase → SQL Editor → RUN
--  Supabase has pgcrypto + uuid-ossp already enabled on public schema.
-- =====================================================================

BEGIN;

-- 1. Tables ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS "User" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email"     TEXT NOT NULL UNIQUE,
  "password"  TEXT NOT NULL,
  "name"      TEXT,
  "isAdmin"   BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Collection" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"        TEXT NOT NULL,
  "slug"        TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"        TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price"       DOUBLE PRECISION NOT NULL,
  "imageUrl"    TEXT NOT NULL,
  "category"    TEXT NOT NULL,
  "sizes"       TEXT[] NOT NULL DEFAULT '{}',
  "inStock"     BOOLEAN NOT NULL DEFAULT true,
  "features"    TEXT[] NOT NULL DEFAULT '{}',
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "ProductCollection" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId"    TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "collectionId" TEXT NOT NULL REFERENCES "Collection"("id") ON DELETE CASCADE,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("productId", "collectionId")
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id"               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"           TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "total"            DOUBLE PRECISION NOT NULL,
  "paymentProvider"  TEXT DEFAULT 'paystack',
  "paystackRef"      TEXT,
  "payfastToken"     TEXT,
  "payfastMp"        TEXT,
  "paid"             BOOLEAN NOT NULL DEFAULT false,
  "paidAt"           TIMESTAMPTZ,
  "paystackResponse" JSONB,
  "payfastResponse"  JSONB,
  "customerEmail"    TEXT,
  "status"           TEXT NOT NULL DEFAULT 'pending',
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId"   TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE RESTRICT,
  "size"      TEXT NOT NULL,
  "quantity"  INTEGER NOT NULL,
  "price"     DOUBLE PRECISION NOT NULL
);

-- 2. Indexes ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS "idx_Order_userId"        ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "idx_Order_customerEmail" ON "Order"("customerEmail");
CREATE INDEX IF NOT EXISTS "idx_Order_paystackRef"   ON "Order"("paystackRef");
CREATE INDEX IF NOT EXISTS "idx_Order_payfastMp"     ON "Order"("payfastMp");
CREATE INDEX IF NOT EXISTS "idx_Order_paid"          ON "Order"("paid");
CREATE INDEX IF NOT EXISTS "idx_OrderItem_orderId"   ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "idx_OrderItem_productId" ON "OrderItem"("productId");
CREATE INDEX IF NOT EXISTS "idx_Product_category"    ON "Product"("category");
CREATE INDEX IF NOT EXISTS "idx_Product_inStock"     ON "Product"("inStock");
CREATE INDEX IF NOT EXISTS "idx_ProductCollection_product"    ON "ProductCollection"("productId");
CREATE INDEX IF NOT EXISTS "idx_ProductCollection_collection" ON "ProductCollection"("collectionId");

-- 3. updatedAt trigger for Product ----------------------------------

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW."updatedAt" := now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_updatedAt ON "Product";
CREATE TRIGGER trg_product_updatedAt
BEFORE UPDATE ON "Product"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Seed: Admin User (upsert) --------------------------------------
-- Password: Superman0501!  |  bcrypt 10 rounds
INSERT INTO "User" ("id", "email", "password", "name", "isAdmin")
VALUES (
  'usr-admin-0000000000000000000001',
  'ntshuxychabalala5@gmail.com',
  '$2b$10$3hmv4EGkpf9deAX3aNHvxuPj8TCN7Naps79iEUSIzQcSG3hr5Vqam',
  'Ntshuxeko',
  true
)
ON CONFLICT ("email") DO UPDATE SET
  "password" = EXCLUDED."password",
  "name"     = EXCLUDED."name",
  "isAdmin"  = true;

-- 5. Seed: Collections ----------------------------------------------

INSERT INTO "Collection" ("id", "name", "slug", "description") VALUES
  ('col-0001', 'Limited Edition',  'limited-edition',  'Exclusive drops that define rarity'),
  ('col-0002', 'Statement Pieces', 'statement-pieces', 'Bold designs for the fearless'),
  ('col-0003', 'Essential Luxury', 'essential-luxury', 'Elevated everyday wear')
ON CONFLICT ("slug") DO NOTHING;

-- 6. Seed: Products -------------------------------------------------

INSERT INTO "Product"
  ("id", "name", "description", "price", "imageUrl", "category", "sizes", "inStock", "features")
VALUES
  ('prod-astral-tee',
   'Astral Tee',
   'Premium streetwear tee with embroidered star motif on 230 GSM heavyweight 100% combed cotton. Pre-shrunk, enzyme-washed for a lived-in drape that holds shape drop after drop.',
   49.99,
   '/images/astral-tee.jpg',
   'tees',
   ARRAY['S','M','L','XL']::TEXT[],
   true,
   ARRAY['Embroidered','100% Cotton','230 GSM','Pre-shrunk']::TEXT[]),

  ('prod-nebula-hoodie',
   'Nebula Hoodie',
   '450 GSM heavy-loopback fleece hoodie with embossed SPACE 404 wordmark. Lined hood, flat drawcords, and double-stitched seams for a luxury silhouette.',
   89.99,
   '/images/nebula-hoodie.jpg',
   'hoodies',
   ARRAY['S','M','L','XL']::TEXT[],
   true,
   ARRAY['Fleece 450 GSM','Embossed logo','Lined hood','Tonal stitching']::TEXT[]),

  ('prod-vortex-bomber',
   'Vortex Bomber Jacket',
   'Italian satin-finish nylon bomber with diamond-quilted lining, ribbed collar and two-piece raglan sleeves. YKK zippers throughout with engraved 404 pull.',
   189.00,
   '/images/vortex-bomber.jpg',
   'outerwear',
   ARRAY['S','M','L','XL','XXL']::TEXT[],
   true,
   ARRAY['Italian nylon','Diamond quilted lining','YKK hardware','Engraved pulls']::TEXT[]),

  ('prod-null-cap',
   'Null 6-Panel Cap',
   'Low-profile 6-panel unstructured cap in brushed twill. Centred embroidered "404" mark on crown, adjustable strap with custom buckle.',
   39.00,
   '/images/null-cap.jpg',
   'accessories',
   ARRAY['One Size']::TEXT[],
   true,
   ARRAY['Brushed twill','Embroidered','Custom buckle','Unstructured']::TEXT[])
ON CONFLICT ("id") DO NOTHING;

-- 7. Seed: Product → Collection links -------------------------------

INSERT INTO "ProductCollection" ("productId", "collectionId")
SELECT p.id, c.id
FROM "Product" p
JOIN "Collection" c
  ON (
      (p.id = 'prod-astral-tee'     AND c.slug IN ('essential-luxury','limited-edition')) OR
      (p.id = 'prod-nebula-hoodie'  AND c.slug IN ('essential-luxury','statement-pieces')) OR
      (p.id = 'prod-vortex-bomber'  AND c.slug IN ('statement-pieces','limited-edition')) OR
      (p.id = 'prod-null-cap'       AND c.slug IN ('essential-luxury'))
     )
ON CONFLICT ("productId", "collectionId") DO NOTHING;

COMMIT;

-- ---------------------------------------------------------------------
-- Verify the seed -----------------------------------------------------
-- ---------------------------------------------------------------------
SELECT 'User' AS tbl, count(*) FROM "User"
UNION ALL SELECT 'Collection', count(*) FROM "Collection"
UNION ALL SELECT 'Product',    count(*) FROM "Product"
UNION ALL SELECT 'Product<>Collection', count(*) FROM "ProductCollection";
