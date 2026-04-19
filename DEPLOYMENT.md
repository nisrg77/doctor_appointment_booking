# 🚀 Deployment Guide — Doctor Appointment Booking System

> **Strategy:** Frontend on **Vercel** (free) + Backend on **Render** (free)
> These are hosted as two separate services that talk to each other via API.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, make sure:
- [ ] Code is pushed to GitHub: `https://github.com/nisrg77/doctor_appointment_booking`
- [ ] You have a **MongoDB Atlas** cluster running (free tier is fine)
- [ ] You have accounts on [render.com](https://render.com) and [vercel.com](https://vercel.com)

---

## PART 1 — BACKEND ON RENDER

### Step 1 — Update CORS in `appointment-backend/index.js`

> ⚠️ Before deploying, update CORS to only allow your Vercel frontend URL.
> Replace the current `app.use(cors())` with this:

```js
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app-name.vercel.app',   // ← replace after Vercel deploy
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

> 💡 You can set `origin: '*'` for now during testing, then lock it down.

---

### Step 2 — Sign Up / Log In to Render

1. Go to [https://render.com](https://render.com)
2. Click **Get Started for Free**
3. Sign up with **GitHub** (easiest — gives Render access to your repos)

---

### Step 3 — Create a New Web Service

1. On the Render dashboard, click **New +** → **Web Service**
2. Select **Connect a repository** → choose `doctor_appointment_booking`
3. Click **Connect**

---

### Step 4 — Configure the Web Service

Fill in these settings:

| Setting | Value |
|---|---|
| **Name** | `appointment-backend` |
| **Region** | Singapore (closest for India) |
| **Branch** | `main` |
| **Root Directory** | `appointment-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Instance Type** | `Free` |

> ⚠️ **Root Directory is critical** — set it to `appointment-backend` so Render
> only looks at the backend folder, not the whole monorepo.

---

### Step 5 — Add Environment Variables

In the **Environment** tab, add these key-value pairs:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority` |
| `JWT_SECRET` | `some_very_long_random_secret_string_nobody_can_guess` |

> 🔐 **JWT_SECRET tip:** Generate a strong one at [https://randomkeygen.com](https://randomkeygen.com)
> Use the "Fort Knox Passwords" section.

---

### Step 6 — Deploy

1. Click **Create Web Service**
2. Render will pull your code, run `npm install`, and start the server
3. Watch the **Logs** tab — you should see:
   ```
   ✅ MongoDB Connected: cluster.mongodb.net
   🚀 Server  : http://localhost:5000
   ```
4. Your backend URL will be something like:
   ```
   https://appointment-backend-xxxx.onrender.com
   ```

### Step 7 — Test the Backend

Visit:
```
https://appointment-backend-xxxx.onrender.com/api/health
```

You should see:
```json
{
  "success": true,
  "message": "✅ Server is healthy",
  "environment": "production"
}
```

> 💡 **Save this URL** — you'll need it for the frontend `.env`

---

## PART 2 — FRONTEND ON VERCEL

### Step 1 — Update the Frontend `.env`

In `appointment-frontend/.env`, your current value is:
```
VITE_API_URL=http://localhost:5000/api
```

For production, Vercel needs to know the backend URL.
You'll set this as an **Environment Variable on Vercel** (don't change the local .env file).

---

### Step 2 — Sign Up / Log In to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

---

### Step 3 — Import Your Repository

1. On Vercel dashboard, click **Add New...** → **Project**
2. Find `doctor_appointment_booking` in the list
3. Click **Import**

---

### Step 4 — Configure the Project

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` (Vercel auto-detects this) |
| **Root Directory** | `appointment-frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

> ⚠️ **Root Directory is critical** — click **Edit** and set it to
> `appointment-frontend` so Vercel only builds the frontend.

---

### Step 5 — Add Environment Variables

Still on the same page, scroll to **Environment Variables** and add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://appointment-backend-xxxx.onrender.com/api` |

> Replace `appointment-backend-xxxx` with your actual Render URL from Part 1.

---

### Step 6 — Deploy

1. Click **Deploy**
2. Vercel will install dependencies, run `vite build`, and publish the `dist/` folder
3. Your frontend URL will be:
   ```
   https://doctor-appointment-booking-xxxx.vercel.app
   ```

---

### Step 7 — Fix CORS on the Backend (Final Step)

Now that you have your Vercel URL, go back to Render:

1. Open your `appointment-backend` service
2. Go to **Environment** tab
3. Add a new variable:

| Key | Value |
|---|---|
| `FRONTEND_URL` | `https://doctor-appointment-booking-xxxx.vercel.app` |

4. Update `appointment-backend/index.js` CORS to use it:
```js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

5. Push the change to GitHub → Render auto-redeploys.

---

## PART 3 — MONGODB ATLAS NETWORK ACCESS

If you haven't done this:

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Select your project → **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access From Anywhere** → `0.0.0.0/0`
5. Click **Confirm**

> This lets Render's servers connect to your MongoDB cluster.
> Render uses dynamic IPs so you can't whitelist a specific one.

---

## PART 4 — AFTER DEPLOYMENT

### How Redeploys Work

| Action | Result |
|---|---|
| Push to `main` branch | Render & Vercel **auto-redeploy** |
| Change env variables on Render | Click **Manual Deploy** to apply |
| Change env variables on Vercel | Click **Redeploy** |

### Render Free Tier Note

> ⚠️ On Render's free plan, your backend **spins down after 15 minutes of inactivity**.
> The first request after idle takes ~30 seconds to "wake up."
> This is normal for the free tier — upgrade to a paid plan to avoid this.

---

## ARCHITECTURE DIAGRAM

```
User's Browser
     │
     ├──► Vercel CDN  (appointment-frontend)
     │         React app served as static files
     │         VITE_API_URL points to Render
     │
     └──► Render Web Service  (appointment-backend)
               Express + Node.js
               Connects to MongoDB Atlas
               Returns JSON to React
```

---

## QUICK REFERENCE URLS

| Service | URL |
|---|---|
| Backend Health Check | `https://<render-url>/api/health` |
| Backend API Base | `https://<render-url>/api` |
| Frontend App | `https://<vercel-url>.vercel.app` |
| MongoDB Atlas | `https://cloud.mongodb.com` |
| Render Dashboard | `https://dashboard.render.com` |
| Vercel Dashboard | `https://vercel.com/dashboard` |

---

## COMMON ERRORS & FIXES

| Error | Cause | Fix |
|---|---|---|
| `CORS error` in browser | Backend CORS not set to Vercel URL | Update `FRONTEND_URL` env var on Render |
| `Cannot connect to MongoDB` | Atlas IP not whitelisted | Allow `0.0.0.0/0` in Atlas Network Access |
| `401 Unauthorized` on all requests | `JWT_SECRET` missing on Render | Add `JWT_SECRET` env var in Render |
| `404 on page refresh` on Vercel | React Router needs config | Add `vercel.json` (see below) |
| Backend wakes up slowly | Render free tier spin-down | Wait 30s or upgrade plan |

### Fix: 404 on Page Refresh (React Router + Vercel)

Create `appointment-frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Then push to GitHub — Vercel auto-redeploys.

---

*Last updated: April 2026*
