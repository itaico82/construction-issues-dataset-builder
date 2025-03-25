require('./src/loadEnv');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const {
    OrchestratorAgent,
    ValidatorAgent,
    ConstructionAnalyzerAgent
} = require('./src/agents');

async function main() {
    // Load the dataset
    const datasetPath = path.join(config.paths.processed, 'llm_ready_construction_issues.json');
    if (!fs.existsSync(datasetPath)) {
        console.error('Dataset not found. Please run the scraper first.');
        process.exit(1);
    }

    const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    console.log(`Loaded ${dataset.length} posts from dataset.`);

    // Initialize agents
    const orchestrator = new OrchestratorAgent();
    const validator = new ValidatorAgent();
    const analyzer = new ConstructionAnalyzerAgent();

    try {
        // Step 1: Orchestrator breaks down dataset
        console.log('Running orchestrator...');
        const orchestratorResults = await orchestrator.analyze(dataset);
        
        // Save invalid posts
        const invalidPath = path.join(config.paths.processed, 'invalid_construction_issues.json');
        fs.writeFileSync(invalidPath, JSON.stringify(orchestratorResults.invalid, null, 2));
        console.log(`Saved ${orchestratorResults.invalid.length} invalid posts.`);

        // Step 2: Validate each post
        console.log('Running validator...');
        const validatedPosts = [];
        for (const post of orchestratorResults.valid) {
            const validationResult = await validator.analyze(post);
            if (validationResult.isValid) {
                validatedPosts.push({
                    ...post,
                    validationResult
                });
            }
        }

        const validPath = path.join(config.paths.processed, 'valid_construction_issues.json');
        fs.writeFileSync(validPath, JSON.stringify(validatedPosts, null, 2));
        console.log(`Saved ${validatedPosts.length} validated posts.`);

        // Step 3: Detailed analysis
        console.log('Running construction analyzer...');
        const analysisResults = await analyzer.analyzeBatch(validatedPosts);
        
        const analyzedPath = path.join(config.paths.processed, 'analyzed_construction_issues.json');
        fs.writeFileSync(analyzedPath, JSON.stringify(analysisResults.results, null, 2));
        console.log(`Saved ${analysisResults.results.length} analyzed posts.`);

        if (analysisResults.errors.length > 0) {
            console.warn(`Warning: ${analysisResults.errors.length} posts had analysis errors.`);
        }

    } catch (error) {
        console.error('Error running agents:', error);
        process.exit(1);
    }
}

main().catch(console.error);