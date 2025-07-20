# Voting-Backend-Only

A Node.js backend API for a secure voting system supporting user authentication (voter/admin), candidate management, and voting operations. Built with Express, MongoDB, and JWT authentication.

## Features

- **User Registration & Login:**  
  Users can sign up and log in using their Aadhaar card number and password. Passwords are securely hashed.
- **Role-Based Access:**  
  Supports 'voter' and 'admin' roles. Only admins can add/update/delete candidates.
- **Voting:**  
  Authenticated voters can vote for a candidate (one vote per user). Voting status is tracked.
- **Candidate Management:**  
  Admins can create, update, and delete candidates.
- **Vote Counting:**  
  Retrieve vote counts for all candidates.
- **Profile Management:**  
  Users can view their profile and update their password.
- **JWT Authentication:**  
  All protected routes use JWT for secure access.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcrypt for password hashing
- dotenv for environment management

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maitreya-16/Voting-Backend-Only.git
   cd Voting-Backend-Only
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env` file in the root directory with content like:
   ```
   PORT=3000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

## API Endpoints

### User

- `POST /user/signup` - Register a new user
- `POST /user/login` - Login and receive JWT
- `GET /user/profile` - Get user profile (auth required)
- `PUT /user/profile/password` - Update user password (auth required)

### Candidate

- `POST /candidate/` - Add candidate (admin only)
- `PUT /candidate/:candidateID` - Update candidate (admin only)
- `DELETE /candidate/:candidateID` - Delete candidate (admin only)
- `GET /candidate/` - List all candidates
- `POST /candidate/vote/:candidateID` - Vote for a candidate (voter only)
- `GET /candidate/vote/count` - Get vote counts for all candidates

## Project Structure

```
.
├── models/           # Mongoose schemas for User & Candidate
├── routes/           # Express routes for users & candidates
├── db.js             # MongoDB connection logic
├── jwt.js            # JWT middleware and helpers
├── server.js         # Main application entry point
└── .env              # Environment variables (not committed)
```


