# Railway Deployment Guide

## Step 1: Initialize Git Repository

```bash
cd c:\Users\supre\Downloads\Assignment
git init
git add .
git commit -m "Initial commit - Team Task Manager"
git branch -M main
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository named `team-task-manager`
3. Copy the repository URL

## Step 3: Push to GitHub

```bash
git remote add origin <your-github-url>
git push -u origin main
```

## Step 4: Deploy Backend on Railway

### 4.1 Login to Railway
- Go to [Railway.app](https://railway.app)
- Sign in with GitHub

### 4.2 Create New Project
1. Click "New Project"
2. Select "Import from GitHub"
3. Select your `team-task-manager` repository

### 4.3 Add Backend Service
1. Right-click in Railway project
2. Add Service → GitHub Repo
3. Select the repo again (for the server directory)

### 4.4 Configure Environment Variables
In Railway project settings:

```
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_secure_random_secret_generate_with_openssl
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 4.5 Set Build Settings
- Root Directory: `server`
- Start Command: `npm start`
- Install Command: `npm install`

### 4.6 Deploy
Click "Deploy" and wait for deployment to complete.

## Step 5: Get Backend URL

After deployment completes:
1. Note the Railway domain: `https://your-project-name.railway.app`
2. This is your `BACKEND_URL`

## Step 6: Deploy Frontend on Vercel (Recommended)

### 6.1 Connect Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "Import Project"
3. Paste your GitHub repository URL
4. Click "Continue"

### 6.2 Configure Project
- Framework: Vite
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

### 6.3 Environment Variables
```
VITE_API_URL=https://your-railway-backend-url
```

### 6.4 Deploy
Click "Deploy" and wait for completion.

## Step 7: Update Frontend API Configuration

Edit `client/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://your-railway-backend-url'  // Production URL
    }
  }
})
```

Or update API calls in components to use environment variable:
```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:5001';
axios.defaults.baseURL = API_URL;
```

## Step 8: Test Live Application

1. Go to your Vercel deployment URL
2. Create an account
3. Test all features:
   - Signup and login
   - Create project (as admin)
   - Create task (as admin)
   - Update task status (as member)

## Troubleshooting

### Backend Deployment Issues

**Logs not showing:**
- Go to Railway dashboard → Deployments
- Click failed deployment
- Check logs for errors

**MongoDB connection failed:**
- Verify `MONGO_URI` in Railway environment
- Check MongoDB Atlas whitelist includes Railway IP
- Go to MongoDB Atlas → Network Access → Add IP Address → Allow All

**Port issues:**
- Railway automatically sets PORT environment variable
- Ensure `process.env.PORT` is used in server.js

### Frontend Deployment Issues

**API calls failing:**
- Check that backend URL is correct
- Verify CORS is enabled in backend
- Check browser console (F12) for detailed errors

**Environment variables not loading:**
- Vercel vars must start with `VITE_` for client-side access
- Redeploy after changing environment variables

## Monitoring & Maintenance

### View Logs
**Backend (Railway):**
- Railway dashboard → Logs

**Frontend (Vercel):**
- Vercel dashboard → Deployments → View Build Logs

### Update Code
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both Railway and Vercel will automatically redeploy on push.

### Database Backup
Go to MongoDB Atlas:
1. Cluster → Backup
2. Create backup before major changes
3. Restore if needed

## Security Checklist

- [x] Environment variables in Railway (not in git)
- [x] HTTPS enforced (automatic on Railway/Vercel)
- [x] JWT secret is strong (32+ characters)
- [x] MongoDB user has limited permissions
- [x] IP whitelist configured in MongoDB
- [x] Rate limiting enabled on auth endpoints
- [x] Input validation on all endpoints
- [x] CORS configured properly

## Performance Optimization (Optional)

### Backend
- Add database indexes (already in schema)
- Implement caching for frequently accessed data
- Use pagination for large datasets

### Frontend
- Enable code splitting in Vite
- Optimize images
- Use lazy loading for routes

---

**Deployment Complete!** Your Team Task Manager is now live.
