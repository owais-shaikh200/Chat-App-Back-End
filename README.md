# 💬 Chat App Backend (Node.js + Express + MongoDB + Socket.IO)

This is a real-time chat application backend built using **Node.js**, **Express.js**, **MongoDB**, and **Socket.IO** with **JWT-based authentication**.

---

## 🚀 Features Implemented

### ✅ User Authentication
- Register new users
- Login with JWT
- Protected routes with `authMiddleware`

### ✅ Chat Functionality
- Create private chat (one-to-one)
- Create group chat with multiple users and group admin
- Get all chats for the logged-in user

### ✅ Messaging System
- Send messages in real-time via Socket.IO
- Store messages in MongoDB
- Retrieve all messages from a specific chat
- Messages populated with sender and chat info

### ✅ Real-Time Communication
- WebSocket authentication using JWT
- Join chat rooms dynamically
- Emit and receive messages in real-time

### ✅ Code Architecture
- Modular folder structure (routes, controllers, models, middlewares, utils, sockets)
- Clean error handling (`asyncWrapper`, `CustomAPIError`)
- Centralized environment config (`envConfig.js`)
- Global error and 404 middleware

---

## 📁 Project Structure

```
root/
│
├── config/           # Environment configuration
├── controllers/      # Route handler logic
├── db/               # MongoDB connection
├── middlewares/      # Auth, error, async wrapper
├── models/           # Mongoose schemas
├── routes/           # Express routes
├── socket/           # Socket.IO setup and handlers
├── utils/            # Utility classes (e.g., CustomError)
├── .env              # Environment variables
└── index.js          # Main server entry point
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## 🧪 Testing the API (Postman)

All endpoints are ready to test via Postman:
- `/api/users/register` – register new users
- `/api/users/login` – login and get JWT
- `/api/chats/private` – create/access private chat
- `/api/chats/group` – create group chat
- `/api/chats` – get all chats
- `/api/messages` – send message
- `/api/messages/:chatId` – get all messages in a chat

Use `Authorization: Bearer <token>` in headers for protected routes.

---

## ▶️ Running the App

```bash
npm install
npm run dev
```

Make sure MongoDB is running and `.env` is configured.

---

## ✨ Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JSON Web Tokens (JWT)
- dotenv
