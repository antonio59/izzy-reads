#!/bin/bash

# Deployment script for production environment
# Usage: ./scripts/deploy-production.sh

set -e

echo "🚀 Starting production deployment..."

# Check if we're on the production branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "production" ]; then
    echo "❌ You must be on the production branch to deploy to production"
    exit 1
fi

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "❌ You have uncommitted changes. Please commit them first."
    exit 1
fi

# Confirm production deployment
read -p "🔴 WARNING: You're about to deploy to PRODUCTION. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Production deployment cancelled."
    exit 1
fi

echo "✅ Pre-flight checks passed"

# Build the application for production
echo "📦 Building application for production..."
bun run build

# Deploy to Convex production
echo "🔄 Deploying to Convex production..."
bunx convex deploy -y --cmd 'echo "Frontend built successfully"'

# Create deployment directory
DEPLOY_DIR="./dist-production"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy built files
cp -r dist/* "$DEPLOY_DIR/"

# Copy Dockerfile and nginx.conf for deployment
cp Dockerfile "$DEPLOY_DIR/"
cp nginx.conf "$DEPLOY_DIR/"

# Create .env.production file
cat > "$DEPLOY_DIR/.env.production" << EOF
# Production Environment Variables
NODE_ENV=production
VITE_CONVEX_URL=\$CONVEX_PRODUCTION_URL
VITE_GIPHY_API_KEY=\$GIPHY_API_KEY
EOF

echo "📋 Created production environment files"

# Create a deployment info file
cat > "$DEPLOY_DIR/deploy-info.json" << EOF
{
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "branch": "$CURRENT_BRANCH",
  "commit": "$(git rev-parse HEAD)",
  "environment": "production",
  "domain": "your-production-domain.com"
}
EOF

echo "✅ Production build completed successfully"
echo "📁 Deployment files ready in: $DEPLOY_DIR"
echo ""
echo "🌐 Next steps:"
echo "1. Upload the contents of $DEPLOY_DIR to your production environment"
echo "2. Set the following environment variables in production:"
echo "   - CONVEX_PRODUCTION_URL: Your Convex production deployment URL"
echo "   - GIPHY_API_KEY: Your Giphy API key"
echo ""
echo "🎉 Production deployment preparation complete!"