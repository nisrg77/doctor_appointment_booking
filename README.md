# 🏥 MedX — Doctor Appointment Booking System

MedX is a premium, full-stack MERN application designed for seamless clinical appointment management. It features a modern 3-column booking interface, secure JWT authentication, and administrative controls for service management.

![MedX Preview](https://lh3.googleusercontent.com/aida-public/AB6AXuDghKCO8fj7uqGM-wZUCFGuvE-_GNPvf64AqJ7W9WmFgLAa-NUoqiJXwTeaGFr_seXWtY-oR-3WKTTZJ9dL8Jldmm_KjkEAxgDoJ8XXUo2F8UNOO77rfXCgWBPM3p6rP1S0fkQT4BVoFXrhJvrK92C2C22-P2FWC0gxPtUjfgU--EksTyZWGBGFS3y91YIgvyLuXOF0Ce9SP7XBFalca9HIuYwBiMdRTByrRNQpnYrIlUYRGYhDkZsUDBFkAnqwDCkj9zU4yUKkA0k)

## 🚀 Live Demo
- **Frontend (Vercel):** [https://doctor-appointment-booking-nisrg77.vercel.app](https://doctor-appointment-booking-nisrg77.vercel.app)
- **Backend (Render):** [https://appointment-backend-5ero.onrender.com/api/health](https://appointment-backend-5ero.onrender.com/api/health)

---

## ✨ Key Features

### 👤 Patient Portal
*   **Modern Booking UI:** Intuitive 3-column layout for choosing categories, doctors, and time slots.
*   **Secure Auth:** JWT-based login and registration with session persistence.
*   **Dashboard:** View upcoming appointments and personal history.
*   **Personalized Experience:** Sidebars and interactive elements for a premium feel.

### 🛡️ Admin Dashboard
*   **Service Management:** Complete CRUD (Add, Edit, Delete) for medical services.
*   **Appointment Control:** Overlook all bookings and update statuses (Pending, Confirmed, Cancelled).
*   **Protected Access:** Route guards ensuring only authorized staff can access management tools.

### 🛠️ Technical Excellence
*   **Responsive Design:** Styled with Tailwind CSS for mobile and desktop precision.
*   **Robust Backend:** Express.js API with Mongoose schemas and clean architecture.
*   **Secure Passwords:** Industry-standard `bcryptjs` hashing.
*   **State Management:** React Context API for global authentication state.

---

## 🏗️ Technology Stack

**Frontend:**
*   React 19 (Vite)
*   Tailwind CSS (Vanilla-style custom tokens)
*   React Router 7
*   Axios (with interceptors)

**Backend:**
*   Node.js & Express 5
*   MongoDB & Mongoose 9
*   jsonwebtoken (JWT)
*   bcryptjs

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js >= 18.x
*   MongoDB Atlas Account

### Step 1: Clone the Repository
```bash
git clone https://github.com/nisrg77/doctor_appointment_booking.git
cd doctor_appointment_booking
```

### Step 2: Install Dependencies
```bash
# Install root (concurrently)
npm install

# Install backend
cd appointment-backend
npm install

# Install frontend
cd ../appointment-frontend
npm install
```

### Step 3: Environment Variables
Create `.env` files in both subdirectories:

**`appointment-backend/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
```

**`appointment-frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run the App
```bash
# Run both frontend and backend from the root folder
npm run dev
```

---

## 🧪 Seeding Test Users
To quickly start testing, run our seed script:
```bash
cd appointment-backend
node seeds/seedUsers.js
```
*Credentials can be found in [users.txt](./users.txt).*

---

## 📜 Documentation
*   [ROADMAP.txt](./ROADMAP.txt) — Step-by-step development history.
*   [DEPLOYMENT.md](./DEPLOYMENT.md) — Detailed guide for Vercel + Render hosting.
*   [requirements.txt](./requirements.txt) — Full dependency list.

---

## 📄 License
This project is licensed under the ISC License.

Developed by **[nisrg77](https://github.com/nisrg77)**
