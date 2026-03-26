# 🇮🇳 Swadeshi Travel - Backend Guide
## B.Tech IT Mini Project | Spring Boot + MySQL + JWT

---

## 📁 PROJECT FOLDER STRUCTURE

```
swadeshi-travel-backend/
├── pom.xml
└── src/
    └── main/
        ├── java/com/swadeshi/travel/
        │   ├── SwadeshiTravelApplication.java     ← Entry point
        │   ├── config/
        │   │   ├── SecurityConfig.java            ← Spring Security + JWT setup
        │   │   └── CorsConfig.java                ← CORS for React frontend
        │   ├── security/
        │   │   ├── JwtUtil.java                   ← Generate & validate tokens
        │   │   ├── JwtAuthFilter.java             ← Filter each HTTP request
        │   │   └── CustomUserDetailsService.java  ← Load user from DB
        │   ├── entity/
        │   │   ├── User.java
        │   │   ├── Destination.java
        │   │   ├── Place.java
        │   │   ├── Booking.java
        │   │   └── Guide.java
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   ├── DestinationRepository.java
        │   │   ├── PlaceRepository.java
        │   │   ├── BookingRepository.java
        │   │   └── GuideRepository.java
        │   ├── dto/
        │   │   ├── RegisterRequest.java
        │   │   ├── LoginRequest.java
        │   │   ├── AuthResponse.java
        │   │   ├── BookingRequest.java
        │   │   ├── BookingSummaryResponse.java
        │   │   ├── PaymentRequest.java
        │   │   ├── PlaceDto.java
        │   │   └── UpdateProfileRequest.java
        │   ├── service/
        │   │   ├── AuthService.java
        │   │   ├── UserService.java
        │   │   ├── DestinationService.java
        │   │   ├── PlaceService.java
        │   │   ├── BookingService.java
        │   │   ├── GuideService.java
        │   │   └── PdfService.java
        │   ├── controller/
        │   │   ├── AuthController.java
        │   │   ├── UserController.java
        │   │   ├── DestinationController.java
        │   │   ├── PlaceController.java
        │   │   ├── BookingController.java
        │   │   ├── GuideController.java
        │   │   └── PdfController.java
        │   └── exception/
        │       └── GlobalExceptionHandler.java
        └── resources/
            ├── application.properties
            ├── schema.sql                         ← Run this first in MySQL
            └── data.sql                           ← Sample data seed
```

---

## ⚙️ ENVIRONMENT SETUP

### Prerequisites
- Java 17+ (Check: `java -version`)
- Maven 3.8+ (Check: `mvn -version`)
- MySQL 8.0+ (Check: `mysql --version`)
- IDE: IntelliJ IDEA or VS Code with Spring Extension

### Step 1: Set Up MySQL
```sql
-- Open MySQL terminal and run:
CREATE DATABASE swadeshi_travel_db;
```
Then run `schema.sql` and `data.sql` files in order.

### Step 2: Update application.properties
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
```

### Step 3: Run the Backend
```bash
cd swadeshi-travel-backend
mvn spring-boot:run
```
Backend runs at: http://localhost:8080

---

## 🔐 AUTHENTICATION FLOW

```
User → POST /api/auth/register → BCrypt Password → Save to DB → Return JWT Token
User → POST /api/auth/login    → Verify Password → Return JWT Token
Protected API → Send "Authorization: Bearer <token>" header → JwtAuthFilter verifies → Allow/Deny
```

---

## 📡 COMPLETE REST API REFERENCE

### 🔑 Authentication (Public - No token needed)

#### Register
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "Arjun Kumar",
  "email": "arjun@gmail.com",
  "password": "mypassword123",
  "phone": "9876543210",
  "city": "Chennai",
  "preferredLanguage": "ta"
}

Response 200 OK:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "name": "Arjun Kumar",
  "email": "arjun@gmail.com",
  "userId": 1,
  "preferredLanguage": "ta"
}

Error 400:
{ "error": "Email already registered!" }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "arjun@gmail.com",
  "password": "mypassword123"
}

Response 200 OK:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "name": "Arjun Kumar",
  "email": "arjun@gmail.com",
  "userId": 1,
  "preferredLanguage": "ta"
}
```

---

### 📍 Destinations (Public)

#### Get All Destinations
```
GET /api/destinations

Response 200 OK:
[
  {
    "id": 1,
    "name": "Ooty",
    "state": "Tamil Nadu",
    "description": "Queen of Hill Stations...",
    "imageUrl": "https://...",
    "category": "Hill Station",
    "baseCost": 3000.0
  },
  ...
]
```

#### Get Destination by ID
```
GET /api/destinations/1

Response 200 OK:
{
  "id": 1,
  "name": "Ooty",
  ...
}
```

#### Search Destinations
```
GET /api/destinations/search?name=ooty

Response: [ list of matching destinations ]
```

---

### 🏛️ Places (Public)

#### Get Places by Destination
```
GET /api/places/destination/1

Response 200 OK:
[
  {
    "id": 1,
    "name": "Ooty Botanical Garden",
    "description": "A 55-acre garden...",
    "imageUrl": "https://...",
    "estimatedCost": 50.0,
    "visitDurationHours": 2.0,
    "category": "Nature"
  },
  ...
]
```

---

### 👤 User Profile (🔒 Requires JWT Token)

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "name": "Arjun Kumar",
  "email": "arjun@gmail.com",
  "phone": "9876543210",
  "city": "Chennai",
  "preferredLanguage": "ta"
}
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Arjun K",
  "phone": "9876543210",
  "city": "Coimbatore",
  "preferredLanguage": "en"
}

Response: { "message": "Profile updated", "name": "Arjun K" }
```

---

### 🗓️ Bookings (🔒 Requires JWT Token)

#### Create Booking
```
POST /api/bookings/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "destinationId": 1,
  "travelType": "Family",
  "selectedPlaceIds": [1, 2, 3]
}

Response 200 OK:
{
  "bookingId": 1,
  "destinationName": "Ooty",
  "travelType": "Family",
  "selectedPlaces": [
    { "id": 1, "name": "Botanical Garden", "estimatedCost": 50.0, ... },
    { "id": 2, "name": "Ooty Lake", "estimatedCost": 150.0, ... },
    { "id": 3, "name": "Doddabetta Peak", "estimatedCost": 30.0, ... }
  ],
  "totalCost": 230.0,
  "totalDurationHours": 6.0,
  "paymentStatus": "PENDING",
  "bookingDate": "25-12-2024 10:30"
}
```

#### Get My Bookings
```
GET /api/bookings/my
Authorization: Bearer <token>

Response: [ list of BookingSummaryResponse ]
```

#### Get Single Booking
```
GET /api/bookings/1
Authorization: Bearer <token>
```

---

### 💳 Payment (Demo UPI)

```
POST /api/bookings/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": 1,
  "upiId": "arjun@upi"
}

Response (Success - UPI ID contains @):
{
  "bookingId": 1,
  "paymentStatus": "SUCCESS",
  ...
}

Response (Failure - Invalid UPI):
{
  "bookingId": 1,
  "paymentStatus": "FAILED",
  ...
}
```

---

### 📄 PDF Download (🔒 Requires JWT Token)

```
GET /api/pdf/download/1
Authorization: Bearer <token>

Response: Binary PDF file download
Content-Type: application/pdf
Content-Disposition: attachment; filename="itinerary_1.pdf"
```

PDF contains:
- User name and email
- Booking details
- Selected places table
- Total cost and duration
- Booking date

---

### 🧭 Guides

```
GET /api/guides                       → All guides
GET /api/guides/destination/1        → Guides for Ooty

Response:
[
  {
    "id": 1,
    "name": "Rajan Kumar",
    "languages": "Tamil, English",
    "contact": "+91-98765-43210",
    "experience": "8 years",
    "perDayCharge": 800.0
  }
]
```

---

## 🧪 POSTMAN TESTING STEPS

1. Import a new collection in Postman called "Swadeshi Travel API"
2. Set base URL: `http://localhost:8080`

### Test Flow:
```
Step 1: POST /api/auth/register  → Copy the token from response
Step 2: POST /api/auth/login     → Verify login works
Step 3: GET  /api/destinations   → See all destinations
Step 4: GET  /api/places/destination/1  → See Ooty places
Step 5: POST /api/bookings/create (with token) → Create booking, note bookingId
Step 6: POST /api/bookings/payment (with token, bookingId + upiId like "test@upi")
Step 7: GET  /api/pdf/download/{bookingId} (with token) → Download PDF
```

### Setting JWT in Postman:
- Go to request → Headers tab
- Add: `Authorization` = `Bearer eyJhbGciOiJIUzI1NiJ9...`

---

## ❌ COMMON ERRORS & FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `Communications link failure` | MySQL not running | Start MySQL service |
| `Access denied for user 'root'` | Wrong DB password | Update application.properties |
| `401 Unauthorized` | No/invalid JWT token | Login and use fresh token |
| `403 Forbidden` | CORS issue | Check CorsConfig.java - frontend URL |
| `Table doesn't exist` | schema.sql not run | Run schema.sql in MySQL first |
| `Port 8080 in use` | Another app using port | Change server.port in application.properties |

---

## 📝 NOTES FOR PROJECT REPORT

- **Architecture**: 3-tier (Controller → Service → Repository)
- **Security**: Stateless JWT authentication (no sessions)
- **Password Storage**: BCrypt hashing (never plain text)
- **PDF Library**: iText 5 (industry-standard)
- **ORM**: Hibernate via Spring Data JPA
- **Demo Payment**: UPI simulation (no real gateway needed)
