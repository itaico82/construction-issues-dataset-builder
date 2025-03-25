// Main application entry point
require('./loadEnv');
const RedditScraper = require('./redditScraper');

async function main() {
    const scraper = new RedditScraper();
    await scraper.start();
}

main().catch(console.error);