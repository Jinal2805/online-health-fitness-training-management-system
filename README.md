# 🏋️ Online Health & Fitness Training Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that connects members, trainers, and administrators on a single platform for fitness management, workout planning, nutrition guidance, communication, and online training.

---

## 📌 Project Overview

The Online Health & Fitness Training Management System is designed to simplify fitness training management by providing separate dashboards for Members, Trainers, and Administrators.

The platform allows users to register, purchase fitness plans, track workout progress, communicate with trainers in real-time, attend video sessions, receive nutrition plans, and manage fitness activities efficiently.

---

## 🚀 Features

### 👤 Member Dashboard

- User Registration & Login
- JWT Authentication
- View Assigned Trainer
- View Fitness Plans
- Track Workout Progress
- Update Fitness Goals
- Nutrition Plan Access
- Book Training Sessions
- Real-Time Chat
- Video Call with Trainer
- Notifications
- Profile Management

### 🏋️ Trainer Dashboard

- Manage Assigned Members
- Create Workout Plans
- Create Nutrition Plans
- Monitor Member Progress
- Schedule Sessions
- Real-Time Messaging
- Video Consultation
- Manage Fitness Activities

### 👨‍💼 Admin Dashboard

- Manage Users
- Manage Trainers
- Manage Members
- Manage Fitness Plans
- Manage Sessions
- Manage Videos
- Monitor System Activities
- View Dashboard Analytics

---

## 🛠️ Technologies Used

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS
- Vite
- Socket.io Client
- WebRTC

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io
- Multer
- Razorpay Integration

### Database

- MongoDB Atlas

---

## 📂 Project Structure

```bash
online-health-fitness-training-management-system/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication

The application uses:

- JWT (JSON Web Token)
- Protected Routes
- Role-Based Access Control

Roles:

1. Admin
2. Trainer
3. Member

---

## 💬 Real-Time Communication

### Socket.io

Used for:

- Real-Time Messaging
- Instant Notifications
- Live Communication

### WebRTC

Used for:

- Video Calling
- Peer-to-Peer Communication
- Online Fitness Consultation

---

## 💳 Payment Integration

### Razorpay

Features:

- Secure Online Payments
- Fitness Plan Purchases
- Subscription Management

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Jinal2805/online-health-fitness-training-management-system.git
```

---

### Backend Setup

```bash
cd server

npm install

npm start
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---


## 📊 Modules

### Admin Module

- User Management
- Trainer Management
- Member Management
- Plan Management
- Session Management

### Trainer Module

- Member Tracking
- Workout Management
- Nutrition Planning
- Video Consultation

### Member Module

- Fitness Tracking
- Session Booking
- Real-Time Chat
- Video Calling

---

## 🎯 Future Enhancements

- AI-Based Fitness Recommendations
- Diet Recommendation System
- Fitness Analytics Dashboard
- Mobile Application
- Wearable Device Integration
- Exercise Detection using AI
- Voice Assistant Support

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Admin Dashboard
- Trainer Dashboard
- Member Dashboard
- Chat System
- Video Calling Feature

---

## 👨‍💻 Developer

**Jinal Ahir**

Bachelor of Engineering in CE.

Project: Online Health & Fitness Training Management System

---

## 📜 License

This project is developed for educational and academic purposes.
