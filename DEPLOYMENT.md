# Deployment Guide for WeatherWave

## Deploy to Vercel

### Step 1: Push your code to GitHub
Your code is already on GitHub at: https://github.com/Karthikkarthiii08/WeatherWave.git ✅

### Step 2: Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your `WeatherWave` repository

### Step 3: Configure Environment Variables (IMPORTANT!)

Before deploying, you MUST add your API key:

1. In the Vercel project setup, find the "Environment Variables" section
2. Add the following:
   - **Name**: `VITE_WEATHERSTACK_API_KEY`
   - **Value**: `25bded74bcd4f0dcf36d2574873cdd90`
   - **Environment**: Select all (Production, Preview, Development)

3. Click "Add" to save the environment variable

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at a URL like: `https://weather-wave.vercel.app`

### Step 5: Test

Visit your deployed URL and test the weather search functionality.

---

## Deploy to Netlify (Alternative)

### Step 1: Connect to Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign in with your GitHub account
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your `WeatherWave` repository

### Step 2: Configure Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 3: Add Environment Variables

1. Go to "Site settings" → "Environment variables"
2. Click "Add a variable"
3. Add:
   - **Key**: `VITE_WEATHERSTACK_API_KEY`
   - **Value**: `25bded74bcd4f0dcf36d2574873cdd90`

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your app will be live!

---

## Important Notes

⚠️ **Security**: Never commit your `.env` file to GitHub. Always use the platform's environment variable settings.

⚠️ **API Limits**: The free Weatherstack plan has very limited requests. Consider upgrading if you expect high traffic.

⚠️ **Build Errors**: If deployment fails, check the build logs for errors. Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

---

## Troubleshooting

### "Invalid API key" error on deployed site

**Solution**: Make sure you added the environment variable in your deployment platform (Vercel/Netlify) with the exact name: `VITE_WEATHERSTACK_API_KEY`

### App works locally but not on deployed site

**Solution**: 
1. Check that environment variables are set correctly
2. Rebuild and redeploy the site
3. Clear your browser cache

### Rate limit errors

**Solution**: Your API key has hit its monthly limit. Wait for it to reset or upgrade your Weatherstack plan.
