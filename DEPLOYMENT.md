# 🚀 Smart Food Assistant - Railway Deployment Guide

This guide will help you deploy the Smart Food Assistant application to Railway (free tier available).

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Railway CLI** (optional): Install from [railway.app/cli](https://docs.railway.app/develop/cli)

## 🏗️ Application Architecture

The application consists of 4 services:
- **Frontend**: React app (static hosting)
- **Backend**: Node.js/Express API with MongoDB
- **AI Service**: Python Flask app with TensorFlow
- **Database**: MongoDB (Railway managed)

## 🚀 Deployment Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Connect your GitHub account and select the `smart-food-assistant` repository

### 2. Deploy Services

Railway will automatically detect and create services based on the `railway.json` files:

#### Backend Service (Node.js)
- Railway will detect `backend/package.json` and deploy automatically
- The service will be available at: `https://your-project-backend.up.railway.app`

#### AI Service (Python)
- Railway will detect `ai-service/requirements.txt` and deploy automatically
- The service will be available at: `https://your-project-ai-service.up.railway.app`

#### Frontend (React)
- Railway will detect `frontend/package.json` and deploy automatically
- The service will be available at: `https://your-project-frontend.up.railway.app`

#### Database (MongoDB)
- Add a MongoDB database from Railway's marketplace
- Copy the connection string for use in environment variables

### 3. Configure Environment Variables

Set these environment variables in each service:

#### Backend Service Variables:
```
MONGO_URI=mongodb://mongo:your-mongo-password@containers-us-west-1.railway.app:1234/railway
JWT_SECRET=your-secure-jwt-secret-here
PORT=3001
```

#### AI Service Variables:
```
PORT=5001
```

#### Frontend Service Variables:
```
REACT_APP_NODE_BASE_URL=https://your-project-backend.up.railway.app
REACT_APP_AI_BASE_URL=https://your-project-ai-service.up.railway.app
```

### 4. Update CORS Origins

After deployment, update the AI service CORS origins in `ai-service/app.py`:

```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://your-project-frontend.up.railway.app"
        ],
        ...
    }
})
```

### 5. Redeploy Services

After setting environment variables:
1. Go to each service in Railway dashboard
2. Click "Deploy" to redeploy with new environment variables

## 🔧 Manual Deployment (Alternative)

If automatic detection fails:

### Using Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy each service
cd backend && railway up
cd ../ai-service && railway up
cd ../frontend && railway up
```

## 🌐 Domain Configuration

1. In Railway dashboard, go to your project
2. Click on each service and customize domains if needed
3. Update frontend environment variables with the actual URLs

## ✅ Testing Deployment

1. **Frontend**: Visit the frontend URL - should load the React app
2. **Backend**: Visit `https://your-backend-url/` - should show "API is running!"
3. **AI Service**: Visit `https://your-ai-url/predict` - should return error (expected without file)
4. **Registration/Login**: Try creating an account and logging in
5. **Food Scan**: Upload an image and test the prediction feature

## 🐛 Troubleshooting

### Common Issues:

1. **Model Loading Error**: Ensure `food_model.keras` is in `ai-service/` directory
2. **CORS Errors**: Check that CORS origins include your frontend domain
3. **Database Connection**: Verify MONGO_URI is correct
4. **Environment Variables**: Ensure all required variables are set

### Logs:
- Check Railway service logs in the dashboard
- Look for specific error messages

## 💰 Cost Estimation

**Railway Free Tier:**
- 512MB RAM per service
- 1GB disk per service
- Limited hours per month
- Perfect for development/testing

**Railway Paid Plans:** Start at $5/month for hobby plan

## 🔄 Updates

To update your deployed application:
1. Push changes to GitHub
2. Railway will automatically redeploy (or click "Deploy" in dashboard)

## 📞 Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Check application logs in Railway dashboard for debugging

---

**Note**: The AI service with TensorFlow model may take several minutes to start up on first deployment due to model loading.
