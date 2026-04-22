# Blog API

A RESTful API for a blog platform built with Node.js, Express.js, and MongoDB.
Implements Clean Architecture with Controller → Service → Repository pattern.

## Features

- JWT Authentication (register, login, protected routes)
- Full CRUD for posts and comments
- Role-based access control (user / admin)
- Auto-generated slugs from post titles
- Pagination and filtering on posts
- Input validation with express-validator
- Global error handling
- 22 automated tests with Jest & Supertest

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Validation | express-validator |
| Testing | Jest + Supertest |
| Security | Helmet + CORS |

## Architecture
src/
├── config/         # Database connection, environment
├── modules/
│   ├── auth/       # Controller, Service, Repository, Routes, Validator
│   ├── posts/      # Controller, Service, Repository, Routes, Validator
│   └── comments/   # Controller, Service, Repository, Routes, Validator
├── models/         # Mongoose schemas
├── middlewares/    # Auth, validation, error handling
├── utils/          # ApiResponse, ApiError
├── app.js          # Express configuration
└── server.js       # Entry point

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ony8991/Blog-API.git
cd Blog-API

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

### Environment Variables
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-api
MONGO_URI_TEST=mongodb://localhost:27017/blog-api-test
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register a new user | ❌ |
| POST | /api/auth/login | Login | ❌ |
| GET | /api/auth/me | Get current user | ✅ |

### Posts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/posts | Get all posts | ❌ |
| GET | /api/posts/my | Get my posts | ✅ |
| GET | /api/posts/:slug | Get post by slug | ❌ |
| POST | /api/posts | Create a post | ✅ |
| PUT | /api/posts/:id | Update a post | ✅ |
| DELETE | /api/posts/:id | Delete a post | ✅ |

### Comments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/posts/:postId/comments | Get post comments | ❌ |
| POST | /api/posts/:postId/comments | Add a comment | ✅ |
| PUT | /api/posts/:postId/comments/:id | Update a comment | ✅ |
| DELETE | /api/posts/:postId/comments/:id | Delete a comment | ✅ |

## Running Tests

```bash
npm test
```

22 tests across 2 suites covering authentication and post management.

## Author

[Ony8991](https://github.com/Ony8991)