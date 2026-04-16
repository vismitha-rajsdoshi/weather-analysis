# Weather Data Analysis App ⛅

A full-stack application built with React (Vite), Node.js, Express, and MongoDB. This app fetches real-time weather, stores history locally using MongoDB, and analyzes predictions.

## Architecture
- **Frontend**: React, Recharts, Vite, Tailwind/Vanilla CSS (Port 80)
- **Backend**: Node.js, Express, Mongoose (Port 5000)
- **Database**: MongoDB

## How to run locally using Docker

1. Ensure Docker Desktop is installed and running.
2. Open terminal in this folder and run:
   \`\`\`bash
   docker-compose up --build
   \`\`\`
3. Access the frontend at \`http://localhost\`
4. Access the backend API at \`http://localhost:5000/api/weather/current\`

## How to deploy on Render (Cloud Deployment)

Since Render relies on Docker and we have separated our components, deployment is very straightforward.

### 1. Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free tier cluster.
2. Under "Network Access", allow access from anywhere (\`0.0.0.0/0\`).
3. Under "Database Access", create a database user and password.
4. Click "Connect" -> Drivers -> Copy the Connection String (URI). It looks like \`mongodb+srv://<username>:<password>@cluster.mongodb.net/weather_app\`.

### 2. Backend Deployment on Render
1. Create a GitHub repository and push this entire codebase to it.
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect the Dockerfiles.
5. In the settings:
   - **Name**: \`weather-app-backend\`
   - **Root Directory**: \`backend\`
   - **Environment Variables**:
     - \`MONGODB_URI\` = *Paste your MongoDB Atlas connection string here*
6. Click **Deploy**. Note down the deployment URL (e.g., \`https://weather-backend.onrender.com\`).

### 3. Frontend Deployment on Render
1. Go to Render.com and create another **New Web Service** (or Static Site).
2. Connect the exact same GitHub repository.
3. In the settings:
   - **Name**: \`weather-app-frontend\`
   - **Root Directory**: \`frontend\`
   - **Environment Variables**:
     - \`VITE_API_URL\` = *Paste your Backend URL here (e.g., \`https://weather-backend.onrender.com/api/weather\`)*
4. Click **Deploy**.

**You are live!** 🎉 The frontend will talk to your Render backend, which talks to MongoDB Atlas and Open-Meteo.
