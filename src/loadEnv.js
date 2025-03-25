const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const result = dotenv.config();

if (result.error) {
    console.warn('Warning: .env file not found. Using default configuration.');
}

// Validate required environment variables
const requiredEnvVars = [
    'REDDIT_CLIENT_ID',
    'REDDIT_CLIENT_SECRET',
    'REDDIT_USER_AGENT',
    'OPENAI_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.warn(`Warning: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.warn('Some functionality may be limited.');
}

module.exports = {
    isEnvLoaded: !result.error,
    missingEnvVars
};