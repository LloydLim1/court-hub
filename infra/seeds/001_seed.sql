INSERT INTO users (id, email, password_hash, role, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'manager@courthub.local', '$2b$10$manager.seed.hash', 'manager', TRUE),
  ('22222222-2222-2222-2222-222222222222', 'frontdesk@courthub.local', '$2b$10$frontdesk.seed.hash', 'front_desk', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (id, name, phone, email, social_media_source, total_bookings, no_show_count, is_high_risk)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Aira Santos', '09171234567', 'aira@example.com', 'facebook', 12, 2, FALSE),
  ('44444444-4444-4444-4444-444444444444', 'Marco Villanueva', '09179876543', 'marco@example.com', 'walk_in', 5, 0, FALSE),
  ('55555555-5555-5555-5555-555555555555', 'Rina Flores', '09175550000', 'rina@example.com', 'instagram', 9, 3, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO courts (id, name, sport, type, parent_court_id, status, capacity, base_price)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Basketball Full Court', 'basketball', 'full', NULL, 'available', 10, 1200),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Volleyball Full Court', 'volleyball', 'full', NULL, 'available', 12, 1200),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Pickleball Hall', 'pickleball', 'divided', NULL, 'available', 12, 1350),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Pickleball A', 'pickleball', 'child', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'reserved', 4, 450),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Pickleball B', 'pickleball', 'child', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'available', 4, 450),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Pickleball C', 'pickleball', 'child', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'available', 4, 450),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Badminton Hall', 'badminton', 'divided', NULL, 'available', 12, 1200),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'Badminton A', 'badminton', 'child', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'available', 4, 400),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'Badminton B', 'badminton', 'child', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'cleaning', 4, 400),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', 'Badminton C', 'badminton', 'child', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'available', 4, 400)
ON CONFLICT (id) DO NOTHING;

INSERT INTO equipment_categories (id, name, sport, bundle_price)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Basketball Kit', 'basketball', 250),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Volleyball Kit', 'volleyball', 240),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Pickleball Kit', 'pickleball', 180),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'Badminton Kit', 'badminton', 150)
ON CONFLICT (name) DO NOTHING;

INSERT INTO equipment (id, category_id, serial_number, name, state)
VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'BB-001', 'Basketball Match Kit', 'available'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'VB-001', 'Volleyball Match Kit', 'available'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'PB-001', 'Pickleball Bundle A', 'reserved'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'BD-001', 'Badminton Bundle A', 'maintenance')
ON CONFLICT (serial_number) DO NOTHING;

INSERT INTO pricing_rules (id, sport, base_rate, peak_multiplier, weekend_multiplier, minimum_price)
VALUES
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'basketball', 1200, 1.25, 1.15, 1200),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'volleyball', 1200, 1.20, 1.15, 1200),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'pickleball', 450, 1.20, 1.10, 450),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd4', 'badminton', 400, 1.15, 1.08, 400)
ON CONFLICT (sport) DO NOTHING;

INSERT INTO special_day_pricing (sport, price_date, label, multiplier, is_active)
VALUES
  (NULL, '2026-05-01', 'Labor Day', 1.30, TRUE),
  ('basketball', '2026-06-12', 'City Sports Fest', 1.40, TRUE)
ON CONFLICT (sport, price_date, label) DO NOTHING;
