#!/bin/bash

# Test script to verify action creation works with guest authentication

echo "🧪 Testing EcoLog Action Creation"
echo "================================"

# Base URL
BASE_URL="http://localhost:5050"

# Step 1: Create guest session
echo "1. Creating guest session..."
GUEST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/guest" \
  -H "Content-Type: application/json" \
  -c cookies.tmp)

echo "   Response: $GUEST_RESPONSE"

# Step 2: Verify auth user
echo "2. Checking authenticated user..."
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/user" \
  -b cookies.tmp)

echo "   User: $USER_RESPONSE"

# Step 3: Create an action
echo "3. Creating a test action..."
ACTION_DATA='{
  "category": "energy_saving",
  "title": "Switched to LED bulbs",
  "description": "Replaced 5 incandescent bulbs with LED bulbs in living room",
  "quantity": "5",
  "unit": "bulbs"
}'

ACTION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/actions" \
  -H "Content-Type: application/json" \
  -b cookies.tmp \
  -d "$ACTION_DATA")

echo "   Action created: $ACTION_RESPONSE"

# Step 4: Verify action was saved
echo "4. Fetching user actions..."
ACTIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/actions" \
  -b cookies.tmp)

echo "   Actions: $ACTIONS_RESPONSE"

# Step 5: Check updated metrics
echo "5. Checking updated metrics..."
METRICS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/metrics/personal" \
  -b cookies.tmp)

echo "   Metrics: $METRICS_RESPONSE"

# Cleanup
rm -f cookies.tmp

echo ""
echo "✅ Test completed!"