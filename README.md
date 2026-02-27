# 🍳 Recipe Sharing Platform
A robust and scalable backend API for the Recipe Sharing Platform built with Node.js, Express, and Supabase (PostgreSQL).
It provides secure authentication, role-based access control (RBAC), recipe management, admin moderation tools, and an AI-powered cooking assistant.

# 🚀 Project Overview
The Recipe Sharing Platform backend enables users to:

➡️ Create, update, and delete their own recipes

➡️ Browse and search recipes shared by other users

➡️ Filter recipes by ingredients, category, or featured status

➡️ Receive AI-powered cooking suggestions

➡️ Access admin moderation and user management tools (based on role)

The system is designed with scalability, security, and clean architecture principles in mind.

# 🏗️ Architecture & Design

The backend follows a modular layered architecture:

➡️ Routes Layer – Defines API endpoints

➡️ Controllers Layer – Handles request/response logic

➡️ Middleware Layer – Authentication & RBAC authorization

➡️ Services Layer – AI and external integrations

➡️ Database Layer – PostgreSQL via Supabase

➡️ Configuration Layer – Environment management

# Key Design Principles

➡️ Separation of concerns

➡️ Stateless JWT authentication

➡️ Role-based authorization

➡️ Environment-based configuration

# 🛠️ Tech Stack

### Runtime & Framework

Node.js, Express.js

### Database

Supabase (PostgreSQL), @supabase/supabase-js

### Authentication & Security

jsonwebtoken (JWT), bcryptjs (Password hashing), cors, dotenv

### AI Integration

 mock AI responses 

### Development Tools

Nodemon

# 📡 API Documentation

## Base URLs

### Development

http://localhost:5000/api

### Production

https://recipe-sharing-platform-be-6.onrender.com/api

# 🔐 Authentication Endpoints

### Register User

POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

### Login User

POST /auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
Response:
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "role": "USER"
  }
}

# 🍲 Recipe Endpoints

### Create Recipe (Authenticated)

POST /recipes

### Get All Recipes

GET /recipes

### Get Recipe By ID

GET /recipes/:id

### Update Recipe (Owner or Admin)

PUT /recipes/:id

### Delete Recipe (Owner or Admin)

DELETE /recipes/:id

# 👨‍💼 Admin Endpoints (RBAC Protected)

Access Level: MODERATOR or ADMIN

### Get All Users

GET /admin/users

### Update User Role

PUT /admin/users/:id/role

### Delete Any Recipe

DELETE /admin/recipes/:id

### Get Platform Statistics

GET /admin/stats

# 🤖 AI Cooking Assistant

### Generate Recipe Suggestions

POST /ai/suggest

Request:
{
  "ingredients": ["tomato", "cheese", "pasta"]
}
Response:
{
  "suggestions": "You can prepare creamy tomato pasta with garlic..."
}

# 🗄️ Database Schema

### Users Table

| Column     | Type          | Description              |
| ---------- | ------------- | ------------------------ |
| id         | UUID (PK)     | Unique user ID           |
| name       | TEXT          | User full name           |
| email      | TEXT (UNIQUE) | Email address            |
| password   | TEXT          | Hashed password          |
| role       | ENUM          | USER / MODERATOR / ADMIN |
| created_at | TIMESTAMP     | Account creation date    |

### Recipes Table

| Column       | Type      | Description          |
| ------------ | --------- | -------------------- |
| id           | UUID (PK) | Unique recipe ID     |
| title        | TEXT      | Recipe title         |
| description  | TEXT      | Recipe summary       |
| ingredients  | TEXT[]    | List of ingredients  |
| instructions | TEXT      | Cooking steps        |
| category     | TEXT      | Recipe category      |
| image_url    | TEXT      | Optional image URL   |
| featured     | BOOLEAN   | Featured recipe flag |
| user_id      | UUID (FK) | References users.id  |
| created_at   | TIMESTAMP | Creation timestamp   |

# 🔐 Security Model

### Authentication

➡️ Stateless JWT-based authentication

➡️ Protected route middleware

➡️ Token validation on each secured request

### Authorization (RBAC)

Roles:

➡️ USER

➡️ MODERATOR

➡️ ADMIN

Access rules enforced via middleware.

### Database-Level Security

➡️ Users can modify only their own recipes

➡️ Admins can manage all records

# ⚙️ Installation & Setup

### 1. Clone Repository
 
 git clone https://github.com/HimajahnaviKanagala/Recipe-Sharing-Platform-BE-

 cd Recipe-Sharing-Platform-BE-

 ### 2. Install Dependencies
 
  npm install
 
### 3. Create Environment Variables

 PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

JWT_SECRET=your_jwt_secret

### 4. Run Development Server

npm run dev

### 5. Run Production Server

npm start

# 🚀 Deployment

Backend deployed at:https://recipe-sharing-platform-be-2-obn9.onrender.com/api/recipes

Recommended platforms:

Render, Railway

# 📁 Project Structure

backend/
│
├── controllers/
├── routes/
├── middleware/
├── services/
├── config/
├── utils/
├── server.js
├── package.json
└── README.md


# 📊 Production Readiness

The backend is designed with:

➡️ Modular architecture

➡️ JWT-based stateless authentication

➡️ Role-based access control

➡️ Database-level row security

➡️ Environment-based configuration

Future production enhancements may include:

➡️ Rate limiting

➡️ Request logging (Winston/Morgan)

➡️ API documentation (Swagger/OpenAPI)

➡️ Automated testing (Jest, Supertest)

➡️ Docker containerization

➡️ CI/CD integration

# 👨‍💻 Author

Developed as part of a full-stack Recipe Sharing Platform demonstrating backend architecture, authentication systems, RBAC implementation, database design, and Mock AI integration.









  

 
