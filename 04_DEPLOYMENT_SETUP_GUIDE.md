# ============================================================================
# BROCAADE MES - COMPLETE DEPLOYMENT & SETUP GUIDE
# ============================================================================

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Security Checklist](#security-checklist)
7. [Troubleshooting](#troubleshooting)

---

## LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js v18+ (Download from https://nodejs.org/)
- PostgreSQL 12+ (Local or Cloud: Supabase)
- Git
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/brocaade-mes.git
cd brocaade-mes
```

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### Step 3: Environment Configuration
```bash
# In the backend directory, create .env file
cp .env.example .env

# Edit .env with your local database credentials
nano .env
```

Update the following in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brocaade_mes
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-secret-key-here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

FRONTEND_URL=http://localhost:3000
```

### Step 4: Start Local Services

#### Terminal 1: Database
```bash
# If using local PostgreSQL
psql -U postgres

# Create database (in psql prompt)
CREATE DATABASE brocaade_mes;
CREATE USER brocaade_user WITH PASSWORD 'secure_password';
ALTER ROLE brocaade_user SET client_encoding TO 'utf8';
ALTER ROLE brocaade_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE brocaade_user SET default_transaction_deferrable TO on;
ALTER ROLE brocaade_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE brocaade_mes TO brocaade_user;
\q
```

#### Terminal 2: Backend Server
```bash
cd backend
npm run dev
# Server should run on http://localhost:5000
```

#### Terminal 3: Frontend Development
```bash
cd frontend
npm run dev
# Frontend should run on http://localhost:3000
```

---

## DATABASE SETUP

### Option 1: Local PostgreSQL

```bash
# Initialize schema
cd backend
psql -U postgres -d brocaade_mes -f ../01_brocaade_schema.sql

# Seed sample data (optional)
npm run db:seed
```

### Option 2: Supabase (Cloud PostgreSQL - Recommended)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up or login
   - Create a new project

2. **Get Connection String**
   - Navigate to Project Settings > Database
   - Copy the connection string
   - Paste in `.env`:
   ```
   DB_HOST=your-project.supabase.co
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password
   DB_NAME=postgres
   DB_PORT=5432
   ```

3. **Initialize Database**
   ```bash
   psql postgresql://postgres:password@your-project.supabase.co:5432/postgres < 01_brocaade_schema.sql
   ```

4. **Enable Row Level Security (RLS)**
   - In Supabase Dashboard > SQL Editor
   - Paste and execute the RLS policies from the schema file

---

## BACKEND DEPLOYMENT

### Deploy to Vercel (Recommended for Node.js/Express)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "server.js" }
     ],
     "env": {
       "DB_HOST": "@db_host",
       "DB_USER": "@db_user",
       "DB_PASSWORD": "@db_password",
       "DB_NAME": "@db_name",
       "JWT_SECRET": "@jwt_secret",
       "CLOUDINARY_CLOUD_NAME": "@cloudinary_cloud_name",
       "CLOUDINARY_API_KEY": "@cloudinary_api_key",
       "CLOUDINARY_API_SECRET": "@cloudinary_api_secret"
     }
   }
   ```

3. **Deploy**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all variables from `.env`
   - Set FRONTEND_URL to your frontend domain

### Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up and link GitHub

2. **Create New Web Service**
   - Select your GitHub repository
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables**
   - In Environment tab, add all variables from `.env`

4. **Deploy Database**
   - Create PostgreSQL database in Render
   - Copy connection string to `.env`

### Deploy to Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create brocaade-mes

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0 --app brocaade-mes

# Set environment variables
heroku config:set DB_HOST=your_heroku_postgres_host \
  DB_USER=your_user \
  DB_PASSWORD=your_password \
  DB_NAME=your_db \
  JWT_SECRET=your_secret \
  CLOUDINARY_CLOUD_NAME=your_cloud \
  --app brocaade-mes

# Deploy
git push heroku main
```

---

## FRONTEND DEPLOYMENT

### Deploy to Vercel

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app
   ```

4. **Deploy**
   - Click Deploy
   - Vercel automatically deploys on push to main

### Deploy to Netlify

1. **Create Netlify Configuration**
   ```toml
   [build]
   command = "npm run build"
   publish = "dist"

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

2. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select GitHub repo
   - Set build directory: `frontend`

3. **Set Environment Variables**
   - Site settings > Build & deploy > Environment
   - Add `VITE_API_URL=https://your-backend-url`

4. **Deploy**
   - Netlify auto-deploys on push

### Deploy to GitHub Pages

```bash
cd frontend

# Install gh-pages
npm install --save-dev gh-pages

# Build
npm run build

# Deploy
npm run deploy
```

---

## ENVIRONMENT CONFIGURATION

### Development Environment (.env.development)
```
NODE_ENV=development
DB_HOST=localhost
FRONTEND_URL=http://localhost:3000
```

### Staging Environment (.env.staging)
```
NODE_ENV=staging
DB_HOST=your-staging-db-host
FRONTEND_URL=https://staging.yourdomain.com
```

### Production Environment (.env.production)
```
NODE_ENV=production
DB_HOST=your-prod-db-host
FRONTEND_URL=https://yourdomain.com
```

### Database Backup Strategy

```bash
# Automated daily backup (using cron)
0 2 * * * pg_dump -U postgres -d brocaade_mes > /backups/brocaade_$(date +\%Y\%m\%d).sql

# Restore from backup
psql -U postgres -d brocaade_mes < /backups/brocaade_20240101.sql
```

---

## SECURITY CHECKLIST

### Before Going Live

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS/SSL on all domains
- [ ] Set CORS origins to specific domains only
- [ ] Enable Row Level Security (RLS) in database
- [ ] Set up rate limiting on API endpoints
- [ ] Enable database backups
- [ ] Set up error logging (Sentry)
- [ ] Review all environment variables
- [ ] Test authentication flows
- [ ] Verify file upload security (virus scanning)
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Enable database encryption
- [ ] Set up monitoring and alerts

### Database Security

```sql
-- Revoke public access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public;

-- Create app-specific role
CREATE ROLE app_user WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE brocaade_mes TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;

-- Enable encryption at rest (Supabase: automatic)
-- Enable point-in-time recovery
VACUUM FULL;
```

### API Security

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Input validation
const { body, validationResult } = require('express-validator');

app.post('/api/auth/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process login
});
```

---

## TROUBLESHOOTING

### Database Connection Issues

**Problem**: `ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready -h localhost

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Ubuntu)
sudo systemctl start postgresql

# Verify connection string
psql postgresql://user:password@host:5432/dbname
```

### JWT Token Errors

**Problem**: `Invalid or expired token`

**Solution**:
```javascript
// Extend token expiration
jwt.sign(payload, secret, { expiresIn: '30d' });

// Clear old tokens from localStorage
localStorage.removeItem('auth_token');
```

### File Upload Issues

**Problem**: `Error uploading photo`

**Solution**:
```bash
# Check Cloudinary credentials in .env
# Verify upload preset exists in Cloudinary Dashboard
# Check file size limits (max 50MB)
# Verify CORS settings
```

### CORS Issues

**Problem**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
```javascript
// Update CORS in backend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
```

### Deploy Stuck

**Solution**:
```bash
# Check build logs
vercel logs

# Clear cache and rebuild
vercel --prod --force

# Check environment variables
vercel env ls
```

---

## MONITORING & MAINTENANCE

### Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    database: 'connected'
  });
});
```

### Log Aggregation

```bash
# View logs
vercel logs --follow

# Download logs
vercel logs > production.log

# Analyze errors
cat production.log | grep "error"
```

### Performance Monitoring

- Set up New Relic, DataDog, or similar APM
- Monitor query performance with `EXPLAIN ANALYZE`
- Use CDN (Cloudflare) for static assets
- Enable gzip compression
- Implement database query caching

### Regular Maintenance

- **Daily**: Check error logs, monitor SLA breaches
- **Weekly**: Review database size, backup verification
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Performance optimization, capacity planning

---

## SUPPORT & DOCUMENTATION

- GitHub Issues: https://github.com/yourusername/brocaade-mes/issues
- Documentation: https://docs.yourdomain.com
- API Reference: https://docs.yourdomain.com/api
- Status Page: https://status.yourdomain.com

---

Generated: 2024
Version: 1.0.0
