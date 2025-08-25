# Environment Setup for API Keys

## Important Security Note 🔒
API keys have been moved to environment variables for security. The actual keys are stored in the `.env` file which is **NOT** tracked by git.

## Setup Instructions

### 1. Copy Environment Template
```bash
cd express
cp .env.example .env
```

### 2. Update API Keys
Edit the `.env` file and replace the placeholder values with your actual API keys:

```bash
# API Keys - REPLACE WITH YOUR ACTUAL KEYS!
GEMINI_API_KEY=your_actual_gemini_api_key_here
YOUTUBE_API_KEY=your_actual_youtube_api_key_here
```

### 3. Getting API Keys

#### Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env` file

#### YouTube API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy and paste it into your `.env` file

### 4. Environment Variables Used:
- `GEMINI_API_KEY` - For AI-powered recommendations
- `YOUTUBE_API_KEY` - For fetching video resources  
- `MONGODB_URI` - Database connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Environment mode
- `SKIP_SEEDING` - Skip database seeding on startup

## Security Best Practices ✅
- ✅ API keys are in `.env` file (not tracked by git)
- ✅ `.env.example` provided as template
- ✅ Validation warnings for missing keys
- ✅ No hardcoded credentials in source code
