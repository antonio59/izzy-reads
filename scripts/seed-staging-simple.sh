#!/bin/bash

# Simple seeding script for staging
echo "📚 Seeding staging database with Izzy's books..."

# Use the correct staging URL
STAGING_URL="https://aware-gecko-889.convex.cloud"

echo "🔍 Staging URL: $STAGING_URL"
echo ""

# Test connection to Convex
echo "🌐 Testing Convex connection..."
curl -s "$STAGING_URL" || echo "❌ Cannot reach Convex"

# Try to check existing data
echo "📋 Checking existing books..."
curl -s -X POST "$STAGING_URL/api/books/getAll" \
  -H "Content-Type: application/json" \
  -d '{}' | head -c 100

echo ""
echo "👤 If you want to create a user manually:"
echo "   1. Go to: https://izzysbookshelf.antoniosmith.xyz"
echo "   2. Sign up with: izzy@izzyreads.com"
echo "   3. Set password: temp12345"
echo ""
echo "📚 After signup, you can add books through the UI"
echo ""
echo "🐛 If it's still spinning, check browser console for errors"