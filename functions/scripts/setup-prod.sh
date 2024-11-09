#!/bin/bash

# Variables
API_URL="https://us-central1-restaurant-management-sy-1a0cd.cloudfunctions.net/app/auth/register"
LOGIN_URL="https://us-central1-restaurant-management-sy-1a0cd.cloudfunctions.net/app/auth/login"
TABLE_API_URL="https://us-central1-restaurant-management-sy-1a0cd.cloudfunctions.net/app/table"
OPENING_HOURS_API_URL="https://us-central1-restaurant-management-sy-1a0cd.cloudfunctions.net/app/openingHours"
PROJECT_ID="restaurant-management-sy-1a0cd"
COLLECTION_NAME="users" # Firestore collection name
FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"

# User details for registration
EMAIL=""
PASSWORD="" 
ID_TOKEN=""
REFRESH_TOKEN=""


# Function to log in and save tokens
login_and_save_tokens() {
  echo "Logging in the user..."

  # Login payload with email and password
  LOGIN_PAYLOAD=$(jq -n \
    --arg email "$EMAIL" \
    --arg password "$PASSWORD" \
    '{
      email: $email,
      password: $password
    }')

  # Send POST request to login endpoint
  LOGIN_RESPONSE=$(curl -s -X POST \
    "$LOGIN_URL" \
    -H "Content-Type: application/json" \
    --data "$LOGIN_PAYLOAD")

  # Extract status and tokens from the response
  STATUS=$(echo "$LOGIN_RESPONSE" | jq -r '.status')
  USER_UID=$(echo "$LOGIN_RESPONSE" | jq -r '.data.uid')
  ID_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.idToken') # Save idToken to variable
  REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.refreshToken')

  echo "User logged in successfully. UID: $USER_UID | ID Token: $ID_TOKEN"
}

# Function to generate a random number of seats between 2 and 10
generate_random_seats() {
  echo $((RANDOM % 9 + 2)) # Generates a number between 2 and 10
}

# Function to add tables with random seats
add_tables() {
  for i in {1..10}; do
    # Generate random number of seats
    SEATS=$(generate_random_seats)

    # Prepare JSON payload for the table API
    TABLE_PAYLOAD=$(jq -n --argjson seats "$SEATS" --arg nextToWindow "false" '{
      seats: $seats,
      nextToWindow: ($nextToWindow | test("true|false") | .)
    }')

    # Send POST request to the API to add the table with Bearer token
    TABLE_RESPONSE=$(curl -s -X POST "$TABLE_API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ID_TOKEN" \
      --data "$TABLE_PAYLOAD")

    # Check if the request was successful
    TABLE_STATUS=$(echo "$TABLE_RESPONSE" | jq -r '.status')
    if [[ "$TABLE_STATUS" == "success" ]]; then
      echo "Table $i added successfully with $SEATS seats."
    else
      echo "Failed to add table $i. Response: $TABLE_RESPONSE"
    fi
  done
}

# Function to add opening hours from Monday to Sunday
add_opening_hours() {
  echo "Adding opening hours..."

  DAYS=("monday" "tuesday" "wednesday" "thursday" "friday" "saturday" "sunday")

  for DAY in "${DAYS[@]}"; do
    # Prepare JSON payload for the opening hours API
    OPENING_HOURS_PAYLOAD=$(jq -n --arg day "$DAY" '{
      day: $day,
      startTime: null,
      endTime: null
    }')

    # Send POST request to the API to add opening hours with Bearer token
    OPENING_HOURS_RESPONSE=$(curl -s -X POST "$OPENING_HOURS_API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ID_TOKEN" \
      --data "$OPENING_HOURS_PAYLOAD")

    # Check if the request was successful
    OPENING_HOURS_STATUS=$(echo "$OPENING_HOURS_RESPONSE" | jq -r '.status')
    if [[ "$OPENING_HOURS_STATUS" == "success" ]]; then
      echo "Opening hours for $DAY added successfully."
    else
      echo "Failed to add opening hours for $DAY. Response: $OPENING_HOURS_RESPONSE"
    fi
  done
}

# Main execution

read -p "Enter your email: " EMAIL
read -sp "Enter your password: " PASSWORD
echo
login_and_save_tokens
add_tables
add_opening_hours
