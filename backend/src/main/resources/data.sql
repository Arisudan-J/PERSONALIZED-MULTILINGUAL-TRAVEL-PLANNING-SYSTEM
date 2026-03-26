-- ============================================================
-- SEED DATA - Run after schema.sql
-- ============================================================

USE swadeshi_travel_db;

-- ============================================================
-- DESTINATIONS
-- ============================================================
INSERT INTO destinations (name, state, description, image_url, category, base_cost) VALUES
('Ooty', 'Tamil Nadu', 'Queen of Hill Stations, famous for tea gardens and Nilgiri hills.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ooty_Lake.jpg/1280px-Ooty_Lake.jpg',
 'Hill Station', 3000),

('Jaipur', 'Rajasthan', 'The Pink City, known for its magnificent forts and palaces.',
 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hawa_Mahal.jpg',
 'Heritage', 4000),

('Goa', 'Goa', 'Famous for its beaches, nightlife, and Portuguese heritage.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Calangute-Beach.jpg/1280px-Calangute-Beach.jpg',
 'Beach', 5000),

('Varanasi', 'Uttar Pradesh', 'Oldest living city in the world, sacred for Hindus.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Varanasi_ghats.jpg/1280px-Varanasi_ghats.jpg',
 'Pilgrimage', 2500),

('Munnar', 'Kerala', 'Breathtaking hill station covered with tea plantations.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Munnar_view.jpg/1280px-Munnar_view.jpg',
 'Hill Station', 3500);

-- ============================================================
-- PLACES (Ooty - id=1)
-- ============================================================
INSERT INTO places (name, description, image_url, estimated_cost, visit_duration_hours, category, destination_id) VALUES
('Ooty Botanical Garden', 'A 55-acre garden with rare plants and flowers, established in 1848.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Government_Botanical_Gardens%2C_Ooty.jpg/1280px-Government_Botanical_Gardens%2C_Ooty.jpg',
 50, 2.0, 'Nature', 1),

('Ooty Lake', 'A beautiful man-made lake perfect for boating and picnics.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ooty_Lake.jpg/1280px-Ooty_Lake.jpg',
 150, 1.5, 'Nature', 1),

('Doddabetta Peak', 'Highest point in the Nilgiris at 2637 metres offering panoramic views.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Doddabetta_Peak.jpg/1280px-Doddabetta_Peak.jpg',
 30, 2.5, 'Adventure', 1),

('Nilgiri Mountain Railway', 'UNESCO World Heritage toy train ride through scenic landscapes.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Nilgiri_Mountain_Railway.jpg/1280px-Nilgiri_Mountain_Railway.jpg',
 45, 3.0, 'Heritage', 1),

('Rose Garden Ooty', 'Largest rose garden in India with over 20,000 varieties of roses.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Rose_Garden_Ooty.jpg/1280px-Rose_Garden_Ooty.jpg',
 30, 1.0, 'Nature', 1);

-- ============================================================
-- PLACES (Jaipur - id=2)
-- ============================================================
INSERT INTO places (name, description, image_url, estimated_cost, visit_duration_hours, category, destination_id) VALUES
('Amber Fort', 'Magnificent 16th century fort with stunning architecture and art.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Amer_Fort_Jaipur.jpg/1280px-Amer_Fort_Jaipur.jpg',
 200, 3.0, 'Heritage', 2),

('Hawa Mahal', 'Palace of Winds - iconic 5-storey palace with 953 small windows.',
 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hawa_Mahal.jpg',
 50, 1.5, 'Heritage', 2),

('Jantar Mantar', 'UNESCO World Heritage astronomical observatory built in 18th century.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jantar_Mantar_Jaipur.jpg/1280px-Jantar_Mantar_Jaipur.jpg',
 50, 2.0, 'Heritage', 2),

('City Palace', 'A complex of palaces, courtyards, and gardens in the heart of Jaipur.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/City_Palace_Jaipur.jpg/1280px-City_Palace_Jaipur.jpg',
 200, 2.5, 'Heritage', 2),

('Nahargarh Fort', 'Fort offering panoramic views of Jaipur city, especially at sunset.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Nahargarh_Fort.jpg/1280px-Nahargarh_Fort.jpg',
 50, 2.0, 'Adventure', 2);

-- ============================================================
-- PLACES (Goa - id=3)
-- ============================================================
INSERT INTO places (name, description, image_url, estimated_cost, visit_duration_hours, category, destination_id) VALUES
('Calangute Beach', 'Queen of Beaches in Goa - most popular beach with water sports.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Calangute-Beach.jpg/1280px-Calangute-Beach.jpg',
 500, 4.0, 'Beach', 3),

('Basilica of Bom Jesus', 'UNESCO World Heritage 16th century church housing St. Francis Xavier.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Basilica_of_Bom_Jesus_Goa.jpg/1280px-Basilica_of_Bom_Jesus_Goa.jpg',
 0, 1.5, 'Heritage', 3),

('Dudhsagar Falls', 'Four-tiered waterfall on the Mandovi River in the Bhagwan Mahavir sanctuary.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Dudhsagar_Falls.jpg/1280px-Dudhsagar_Falls.jpg',
 400, 5.0, 'Nature', 3),

('Fort Aguada', 'Well-preserved 17th century Portuguese fort at the confluence of river and sea.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Fort_Aguada.jpg/1280px-Fort_Aguada.jpg',
 50, 2.0, 'Heritage', 3);

-- ============================================================
-- LOCAL GUIDES (Ooty)
-- ============================================================
INSERT INTO guides (name, languages, contact, experience, per_day_charge, destination_id) VALUES
('Rajan Kumar', 'Tamil, English', '+91-98765-43210', '8 years', 800, 1),
('Meena Selvam', 'Tamil, English, Kannada', '+91-98765-11122', '5 years', 700, 1),
('Suresh Nair', 'Malayalam, Tamil, English', '+91-98765-33344', '10 years', 1000, 1);

-- GUIDES (Jaipur)
INSERT INTO guides (name, languages, contact, experience, per_day_charge, destination_id) VALUES
('Arjun Sharma', 'Hindi, English', '+91-99887-66554', '12 years', 1200, 2),
('Priya Rajput', 'Hindi, English, French', '+91-99887-77665', '7 years', 1000, 2);

-- GUIDES (Goa)
INSERT INTO guides (name, languages, contact, experience, per_day_charge, destination_id) VALUES
('Antony Fernandes', 'Konkani, English, Hindi', '+91-77665-44332', '9 years', 1500, 3),
('Sonia D\'souza', 'Konkani, English, Portuguese', '+91-77665-55443', '6 years', 1300, 3);

-- ============================================================
-- ADMIN USER (password: Admin@1234)
-- BCrypt hash of 'Admin@1234'
-- ============================================================
INSERT IGNORE INTO users (name, email, password, phone, city, preferred_language, role, active, created_at) VALUES
('Admin', 'admin@swadeshi.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '+91-00000-00000', 'Admin City', 'en', 'ADMIN', true, NOW());
