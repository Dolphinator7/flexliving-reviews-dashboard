# Setup Guide

Complete step-by-step guide to set up the Flex Living Reviews Dashboard locally.

## Prerequisites

### Required Software

- **Node.js** 18.0 or higher
- **Python** 3.11 or higher
- **npm** or **yarn** package manager
- **pip** Python package manager
- **Git** for version control

### Verify Installation

\`\`\`bash
node --version  # Should be v18.0.0 or higher
python --version  # Should be 3.11.0 or higher
npm --version
pip --version
\`\`\`

## Installation Steps

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd flexliving-reviews-dashboard
\`\`\`

### 2. Backend Setup

#### Install Python Dependencies

\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

For development dependencies:

\`\`\`bash
pip install -r requirements-dev.txt
\`\`\`

#### Configure Environment Variables

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file:

\`\`\`env
# API Configuration
API_V1_PREFIX=/api/v1
PROJECT_NAME=Flex Living Reviews API
VERSION=1.0.0

# CORS Origins (comma-separated)
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Hostaway API (use mock values for development)
HOSTAWAY_API_KEY=mock_api_key
HOSTAWAY_API_URL=https://api.hostaway.com/v1

# Google Places API (optional)
GOOGLE_PLACES_API_KEY=
\`\`\`

#### Start the Backend Server

\`\`\`bash
uvicorn app.main:app --reload --port 8000
\`\`\`

The API will be available at:
- API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/api/v1/docs`
- ReDoc: `http://localhost:8000/api/v1/redoc`

### 3. Frontend Setup

Open a new terminal window:

#### Install Node Dependencies

\`\`\`bash
cd ..  # Back to root directory
npm install
\`\`\`

#### Configure Environment Variables

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` file:

\`\`\`env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
\`\`\`

#### Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at:
- Dashboard: `http://localhost:3000`
- Property Page: `http://localhost:3000/property/prop_001`

## Verify Installation

### 1. Check Backend Health

\`\`\`bash
curl http://localhost:8000/health
\`\`\`

Expected response:
\`\`\`json
{"status": "healthy"}
\`\`\`

### 2. Check API Endpoints

\`\`\`bash
curl http://localhost:8000/api/v1/reviews
\`\`\`

Should return a list of mock reviews.

### 3. Check Frontend

Open `http://localhost:3000` in your browser. You should see:
- Stats cards with review metrics
- Filters panel
- Reviews table with mock data

## Development Workflow

### Running Both Servers

Use two terminal windows:

**Terminal 1 (Backend):**
\`\`\`bash
cd backend
uvicorn app.main:app --reload --port 8000
\`\`\`

**Terminal 2 (Frontend):**
\`\`\`bash
npm run dev
\`\`\`

### Hot Reload

Both servers support hot reload:
- **Backend**: Changes to Python files automatically reload the server
- **Frontend**: Changes to React/TypeScript files automatically refresh the browser

## Testing

### Backend Tests

\`\`\`bash
cd backend
pytest
\`\`\`

With coverage:
\`\`\`bash
pytest --cov=app tests/
\`\`\`

### Frontend Tests

\`\`\`bash
npm test
\`\`\`

### Type Checking

\`\`\`bash
npm run type-check
\`\`\`

## Code Quality

### Backend Formatting

\`\`\`bash
cd backend
black app/
\`\`\`

### Backend Linting

\`\`\`bash
ruff check app/
\`\`\`

### Frontend Linting

\`\`\`bash
npm run lint
\`\`\`

## Common Issues

### Issue: Port Already in Use

**Error:** `Address already in use`

**Solution:**
\`\`\`bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
\`\`\`

### Issue: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

### Issue: CORS Error

**Error:** `Access to fetch at 'http://localhost:8000' has been blocked by CORS policy`

**Solution:**
1. Check `BACKEND_CORS_ORIGINS` in `backend/.env`
2. Ensure it includes `http://localhost:3000`
3. Restart the backend server

### Issue: API Connection Failed

**Error:** `Network error` or `Failed to fetch`

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no firewall is blocking the connection

## Database Setup (Optional)

For persistent storage, you can add a database:

### PostgreSQL with Docker

\`\`\`bash
docker run --name flexliving-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=flexliving \
  -p 5432:5432 \
  -d postgres:15
\`\`\`

Update `backend/.env`:
\`\`\`env
DATABASE_URL=postgresql://postgres:password@localhost:5432/flexliving
\`\`\`

## Production Deployment

### Frontend (Vercel)

\`\`\`bash
npm run build
vercel deploy
\`\`\`

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Your production API URL

### Backend (Railway)

1. Create a new service
2. Connect your Git repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

## Next Steps

1. **Customize Mock Data**: Edit `backend/data/mock_reviews.json`
2. **Add Real API Integration**: Implement Hostaway API client in `backend/app/services/hostaway.py`
3. **Add Database**: Set up PostgreSQL and update repository layer
4. **Add Authentication**: Implement JWT-based auth for manager dashboard
5. **Deploy**: Follow production deployment steps above
