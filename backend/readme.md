# CodeNova Backend

Backend server for **CodeNova**, an online coding platform similar to LeetCode.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Redis
- Cloudinary
- Judge0 API

---

## Features

- User Authentication
- Admin Panel
- Problem Management
- Code Execution
- Code Submission
- Editorial Video Upload
- AI Doubt Solver
- Submission History

---

## Authentication APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /user/signup | Register a new user |
| POST | /user/login | Login user |
| POST | /user/logout | Logout user |
| GET | /user/me | Get logged in user |

Authentication is implemented using **JWT** stored in **HTTP-only cookies**.

---

## Admin APIs

Only users with the **admin** role can access these routes.

- Create Problem
- Update Problem
- Delete Problem
- Upload Editorial Video

Authorization is handled using middleware.

---

## Problem APIs

- Get all problems
- Get problem by ID
- Get solved problems
- Fetch submission history

---

## Submission APIs

- Run Code
- Submit Code
- View Submission History

Judge0 API is used for compiling and executing user code.

---

## Editorial Videos

Editorial videos are uploaded to **Cloudinary**.

Stored metadata includes:

- secureUrl
- thumbnailUrl
- duration
- cloudinaryPublicId

---

## Validation

Input validation is performed before storing data.

Examples:

- Email validation
- Password validation
- Required fields
- Duplicate email check

The backend uses the **validator** package together with custom validation logic.

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Environment Variables

Create a `.env` file.

```env
PORT=
JWT_SECRET_KEY=

DB_CONNECT_STRING=

REDIS_HOST=
REDIS_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAPID_API_KEY=
```

---

## Installation

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

## Folder Structure

```
backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
├── package.json
└── server.js
```

---

## Security

- JWT Authentication
- HTTP-only Cookies
- Role-based Authorization
- Admin Middleware
- Duplicate Email Prevention
- Password Hashing using bcrypt
