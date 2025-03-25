const BaseAgent = require('./baseAgent');

class OrchestratorAgent extends BaseAgent {
    constructor() {
        super();
        this.systemPrompt = `You are an orchestrator agent responsible for managing the analysis of construction site issues.
Your role is to:
1. Break down the dataset into individual posts
2. Coordinate with other agents for validation and analysis
3. Ensure consistent data quality and format
4. Handle any errors or edge cases`;
    }

    async analyze(dataset) {
        const results = {
            valid: [],
            invalid: [],
            errors: []
        };

        for (const post of dataset) {
            try {
                const messages = [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: JSON.stringify(post) }
                ];

                const response = await this.callOpenAI(messages);
                const analysis = JSON.parse(response);

                if (analysis.isValid) {
                    results.valid.push({
                        ...post,
                        analysis
                    });
                } else {
                    results.invalid.push({
                        ...post,
                        reason: analysis.reason
                    });
                }
            } catch (error) {
                console.error(`Error analyzing post ${post.id}:`, error);
                results.errors.push({
                    post,
                    error: error.message
                });
            }
        }

        return results;
    }
}

module.exports = OrchestratorAgent;