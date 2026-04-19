# 🚀 Deployment Guide: MERN Appointment System

This guide outlines how to deploy your application to **Render.com** (Recommended for full-stack MERN).

## 1. Prepare your Repository
Ensure your code is pushed to a GitHub repository. The project is already structured with a unified `build` script in the root `package.json`.

## 2. Render.com Deployment (Web Service)

### Step A: Create New Web Service
1. Log in to [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.

### Step B: Configure Build & Start
- **Runtime**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Step C: Environment Variables (CRITICAL)
Go to the **Environment** tab and add:
- `NODE_ENV`: `production`
- `MONGO_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A long random string (e.g., `super_secret_clinical_key_2024`).
- `PORT`: `5000` (Render handles this, but setting it explicitly is safe).

## 3. MongoDB Atlas Configuration
1. Go to **Network Access** in MongoDB Atlas.
2. Click **Add IP Address**.
3. Select **Allow Access From Anywhere** (0.0.0.0/0) so Render can connect.

## 4. Frontend Notes
The backend is now configured to serve the frontend! 
- Your API and Frontend will load from the **same URL** provided by Render.
- If you see a "White Screen", ensure the `appointment-frontend/dist` folder was created during build.

---
### Local Verification
To test the "Production" mode on your machine:
1. Run `npm run build` from the root.
2. Run `$env:NODE_ENV="production"; npm start` (Windows PowerShell) or `NODE_ENV=production npm start` (Mac/Linux).
3. Visit `http://localhost:5000`.
