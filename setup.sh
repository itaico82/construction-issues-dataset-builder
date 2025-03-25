#!/bin/bash

# Create necessary directories
mkdir -p data/images data/processed logs temp_image_input

# Install dependencies
npm install

# Create example .env file if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOL
# Reddit API credentials
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=your_user_agent

# OpenAI API credentials
OPENAI_API_KEY=your_openai_api_key

# Data paths
DATA_DIR=./data
IMAGES_DIR=./data/images
PROCESSED_DIR=./data/processed
LOGS_DIR=./logs
TEMP_IMAGE_INPUT=./temp_image_input

# API settings
API_TIMEOUT=30000
EOL
    echo "Created example .env file. Please update it with your credentials."
fi

# Run validation
npm run validate