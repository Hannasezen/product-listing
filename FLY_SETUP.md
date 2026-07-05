# Fly.io Setup Instructions

## Manual Steps to Complete

### 1. Install Fly.io CLI
```bash
brew install flyctl
flyctl auth login
```

### 2. Create Staging App
```bash
flyctl app create product-listing-api-staging
```

### 3. Create Production App
```bash
flyctl app create product-listing-api-production
```
✅ Both apps have been created!

### 4. Set Environment Variables for Staging
```bash
flyctl secrets set \
  --app product-listing-api-staging \
  DATABASE_URL="your_neon_staging_url" \
  AUTH_SECRET="your_auth_secret" \
  GOOGLE_CLIENT_ID="your_google_client_id" \
  GOOGLE_CLIENT_SECRET="your_google_client_secret" \
  RESEND_API_KEY="your_resend_api_key"
```

### 5. Set Environment Variables for Production
```bash
flyctl secrets set \
  --app product-listing-api-production \
  DATABASE_URL="your_neon_production_url" \
  AUTH_SECRET="your_auth_secret" \
  GOOGLE_CLIENT_ID="your_google_client_id" \
  GOOGLE_CLIENT_SECRET="your_google_client_secret" \
  RESEND_API_KEY="your_resend_api_key"
```

### 6. Add GitHub Environment Secrets
Go to your GitHub repo → **Settings** → **Environments**

**Create `staging` environment** with these secrets:
- `FLY_API_TOKEN_STAGING`: Get from `flyctl auth token`
- `FLY_APP_STAGING`: `product-listing-api-staging`
- `DATABASE_URL_STAGING`: Your Neon staging database URL

**Create `production` environment** with these secrets:
- `FLY_API_TOKEN_PRODUCTION`: Get from `flyctl auth token`
- `FLY_APP_PRODUCTION`: `product-listing-api-production`
- `DATABASE_URL_PRODUCTION`: Your Neon production database URL

### 7. Create Neon Staging Branch (Optional but Recommended)
In Neon console, create a branch named `staging` from your main branch.
Update `DATABASE_URL_STAGING` secret with the new connection string.

### 8. Test Local Deployment (Optional)
```bash
cd product-listing/apps/api
flyctl deploy
```

## Files Created

1. `apps/api/fly.toml` — Fly.io configuration
2. `.github/workflows/ci-cd.yml` — GitHub Actions pipeline

## Deployment Flow

- **Staging**: Auto-deploys on push to `main` branch
- **Production**: Auto-deploys on push of git tags matching `v*` (e.g., `v1.0.0`)
- **Database migrations**: Run before staging deployment on the staging database
