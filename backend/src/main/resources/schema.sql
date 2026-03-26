-- ============================================================
-- SWADESHI TRAVEL DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS swadeshi_travel_db;
USE swadeshi_travel_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    city VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    role VARCHAR(20) DEFAULT 'USER',
    active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50),
    base_cost DOUBLE,
    featured TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS places (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    estimated_cost DOUBLE,
    visit_duration_hours DOUBLE,
    category VARCHAR(50),
    destination_id BIGINT NOT NULL,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    languages VARCHAR(200),
    contact VARCHAR(50),
    experience VARCHAR(100),
    per_day_charge DOUBLE,
    destination_id BIGINT,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    discount_percent DOUBLE NOT NULL,
    destination_id BIGINT,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    destination_id BIGINT NOT NULL,
    travel_type VARCHAR(50),
    total_cost DOUBLE,
    original_cost DOUBLE,
    discount_amount DOUBLE DEFAULT 0,
    discount_percent DOUBLE DEFAULT 0,
    total_duration_hours DOUBLE,
    selected_place_ids TEXT,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    upi_id VARCHAR(100),
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    pdf_generated TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

CREATE TABLE IF NOT EXISTS booking_places (
    booking_id BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    PRIMARY KEY (booking_id, place_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);
