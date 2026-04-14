CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('manager', 'front_desk');
    CREATE TYPE social_source AS ENUM ('facebook', 'instagram', 'viber', 'walk_in');
    CREATE TYPE sport_type AS ENUM ('basketball', 'volleyball', 'pickleball', 'badminton');
    CREATE TYPE court_type AS ENUM ('full', 'divided', 'child');
    CREATE TYPE court_status AS ENUM ('available', 'reserved', 'in_use', 'no_show', 'grace_period', 'cleaning', 'maintenance');
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show');
    CREATE TYPE check_in_status AS ENUM ('not_arrived', 'checked_in', 'late_arrival');
    CREATE TYPE no_show_status AS ENUM ('clear', 'warning', 'released');
    CREATE TYPE payment_status AS ENUM ('pending', 'proof_uploaded', 'verified', 'rejected', 'refunded');
    CREATE TYPE equipment_state AS ENUM ('available', 'reserved', 'in_use', 'returned', 'damaged', 'maintenance');
    CREATE TYPE verification_status AS ENUM ('pending', 'ocr_verified', 'manual_verified', 'rejected');
    CREATE TYPE transition_checkpoint AS ENUM ('t_minus_15', 't_minus_5', 't_plus_10');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  social_media_source social_source,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  no_show_count INTEGER NOT NULL DEFAULT 0,
  is_high_risk BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sport sport_type NOT NULL,
  type court_type NOT NULL,
  parent_court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
  status court_status NOT NULL DEFAULT 'available',
  capacity INTEGER NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE RESTRICT,
  staff_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),
  status booking_status NOT NULL DEFAULT 'pending',
  check_in_status check_in_status NOT NULL DEFAULT 'not_arrived',
  no_show_status no_show_status NOT NULL DEFAULT 'clear',
  pricing_snapshot JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_status payment_status NOT NULL DEFAULT 'pending',
  booking_window TSTZRANGE GENERATED ALWAYS AS (tstzrange(start_time, end_time, '[)')) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_no_overlap;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    court_id WITH =,
    booking_window WITH &&
  )
  WHERE (status NOT IN ('cancelled', 'completed', 'no_show'));

CREATE TABLE IF NOT EXISTS equipment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sport sport_type NOT NULL,
  bundle_price NUMERIC(10, 2) NOT NULL CHECK (bundle_price >= 0)
);

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES equipment_categories(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  state equipment_state NOT NULL DEFAULT 'available',
  last_maintenance_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS equipment_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  state equipment_state NOT NULL DEFAULT 'reserved'
);

CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport sport_type NOT NULL UNIQUE,
  base_rate NUMERIC(10, 2) NOT NULL CHECK (base_rate >= 0),
  peak_multiplier NUMERIC(6, 3) NOT NULL DEFAULT 1,
  weekend_multiplier NUMERIC(6, 3) NOT NULL DEFAULT 1,
  minimum_price NUMERIC(10, 2) NOT NULL CHECK (minimum_price >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricing_change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_rule_id UUID NOT NULL REFERENCES pricing_rules(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  old_value JSONB NOT NULL,
  new_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS special_day_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport sport_type,
  price_date DATE NOT NULL,
  label TEXT NOT NULL,
  multiplier NUMERIC(6, 3) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sport, price_date, label)
);

CREATE TABLE IF NOT EXISTS transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  checkpoint transition_checkpoint NOT NULL,
  alert_at TIMESTAMPTZ NOT NULL,
  acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reference TEXT NOT NULL UNIQUE,
  qr_code TEXT NOT NULL,
  proof_image TEXT,
  ocr_data JSONB,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff_id ON bookings(staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_courts_parent_court_id ON courts(parent_court_id);
CREATE INDEX IF NOT EXISTS idx_equipment_state ON equipment(state);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
