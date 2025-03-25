require('../src/loadEnv');
const path = require('path');

module.exports = {
    paths: {
        data: process.env.DATA_DIR || path.join(__dirname, '..', 'data'),
        images: process.env.IMAGES_DIR || path.join(__dirname, '..', 'data', 'images'),
        processed: process.env.PROCESSED_DIR || path.join(__dirname, '..', 'data', 'processed'),
        logs: process.env.LOGS_DIR || path.join(__dirname, '..', 'logs'),
        tempImageInput: process.env.TEMP_IMAGE_INPUT || path.join(__dirname, '..', 'temp_image_input')
    },
    api: {
        timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
        reddit: {
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            userAgent: process.env.REDDIT_USER_AGENT
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-4-0125-preview'
        }
    },
    subreddits: [
        'Construction',
        'CivilEngineering',
        'StructuralEngineering',
        'OSHA'
    ],
    batchSize: 25,
    delayBetweenRequests: 2000,
    maxRetries: 3,
    retryDelay: 5000
};