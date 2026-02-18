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

# Runtime & Framework

Node.js, Express.js

# Database

Supabase (PostgreSQL), @supabase/supabase-js

# Authentication & Security

jsonwebtoken (JWT), bcryptjs (Password hashing), cors, dotenv

# AI Integration

 mock AI responses 

# Development Tools

Nodemon

# 📡 API Documentation

# Base URLs

# Development

http://localhost:5000/api

# Production

https://recipe-sharing-platform-be-2-obn9.onrender.com/api/recipes

# 🔐 Authentication Endpoints

# Register User

POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Login User

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

# Create Recipe (Authenticated)

POST /recipes

# Get All Recipes

GET /recipes

# Get Recipe By ID

GET /recipes/:id

# Update Recipe (Owner or Admin)

PUT /recipes/:id

# Delete Recipe (Owner or Admin)

DELETE /recipes/:id

# 👨‍💼 Admin Endpoints (RBAC Protected)

Access Level: MODERATOR or ADMIN

# Get All Users

GET /admin/users

# Update User Role

PUT /admin/users/:id/role

# Delete Any Recipe

DELETE /admin/recipes/:id

# Get Platform Statistics

GET /admin/stats



