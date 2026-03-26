# 🇮🇳 Swadeshi Travel

A full-stack travel planning web application built as a Project.  
Users can explore destinations, select tourist places, book trips, apply offers, and download PDF itineraries.  
Admins get a full dashboard with analytics, user management, and content management.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, React Router, Recharts, Axios |
| Backend   | Spring Boot 3.2, Spring Security, JPA   |
| Database  | MySQL 8                                 |
| Auth      | JWT (HS256) + BCrypt                    |
| PDF       | iTextPDF 5                              |

---

## Project Structure

```
2/
├── backend/    # Spring Boot REST API
└── frontend/   # React SPA
```

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+ & npm

---

## Backend Setup

### 1. Create the database
```sql
CREATE DATABASE swadeshi_travel_db;
```

### 2. Configure application.properties
```bash
cd ackend/src/main/resources
cp application.properties.example application.properties
```
Edit `application.properties` and fill in:
- `spring.datasource.username` — your MySQL username
- `spring.datasource.password` — your MySQL password
- `jwt.secret` — any random string of 32+ characters

### 3. Run the backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## Create Admin User

1. Register a user via the app or API:
```bash
POST http://localhost:8080/api/auth/register
```

2. Promote to admin in MySQL:
```sql
UPDATE users SET role='ADMIN', active=1 WHERE email='your@email.com';
```

3. Login at `http://localhost:3000/admin`

---

## Key Features

- Browse destinations with featured highlights and active offers
- Select tourist places with cost & duration estimates
- Auto-apply best discount offer at booking
- UPI-based demo payment flow
- Downloadable PDF itinerary with discount breakdown
- Multilingual UI (English / Hindi / Tamil)
- Admin dashboard: analytics charts, user/destination/place/guide/offer management
- Image upload for destinations, places, and guides

---

## Environment Notes

- Uploaded images are stored in `backend/uploads/` (excluded from Git)
