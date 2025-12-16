#!/bin/bash

# Deployment script for staging environment on Coolify
# Usage: ./scripts/deploy-staging.sh

set -e

echo "🚀 Starting staging deployment to izzy.antoniosmith.xyz..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ You must be on the main branch to deploy to staging"
    exit 1
fi

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "❌ You have uncommitted changes. Please commit them first."
    exit 1
fi

echo "✅ Pre-flight checks passed"

# Build the application
echo "📦 Building application..."
bun run build

# Deploy to Convex (using dev deployment for now)
echo "🔄 Deploying to Convex..."
bunx convex deploy --cmd 'echo "Frontend built successfully"'

# Create deployment directory
DEPLOY_DIR="./dist-staging"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy built files
cp -r dist/* "$DEPLOY_DIR/"

# Copy Dockerfile and nginx.conf for deployment
cp Dockerfile "$DEPLOY_DIR/"
cp nginx.conf "$DEPLOY_DIR/"

# Create .env.staging file
cat > "$DEPLOY_DIR/.env.staging" << EOF
# Staging Environment Variables
NODE_ENV=production
VITE_CONVEX_URL=\$CONVEX_STAGING_URL
VITE_GIPHY_API_KEY=\$GIPHY_API_KEY
EOF

echo "📋 Created staging environment files"

# Create a deployment info file
cat > "$DEPLOY_DIR/deploy-info.json" << EOF
{
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "branch": "$CURRENT_BRANCH",
  "commit": "$(git rev-parse HEAD)",
  "environment": "staging",
  "domain": "izzy.antoniosmith.xyz"
}
EOF

echo "✅ Build completed successfully"
echo "📁 Deployment files ready in: $DEPLOY_DIR"
echo ""
echo "🌐 Next steps:"
echo "1. Upload the contents of $DEPLOY_DIR to your Coolify staging environment"
echo "2. Set the following environment variables in Coolify:"
echo "   - CONVEX_STAGING_URL: Your Convex staging deployment URL"
echo "   - GIPHY_API_KEY: Your Giphy API key"
echo ""
echo "🎉 Staging deployment preparation complete!"