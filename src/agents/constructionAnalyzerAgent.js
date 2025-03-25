const BaseAgent = require('./baseAgent');

class ConstructionAnalyzerAgent extends BaseAgent {
    constructor() {
        super();
        this.systemPrompt = `You are a construction analyzer agent with expertise in identifying and analyzing construction site issues.
Your role is to:
1. Analyze validated construction issues in detail
2. Identify multiple potential problems in each image
3. Provide detailed descriptions and categorization
4. Suggest responsible parties and root causes
5. Assign confidence scores to your analysis

Categories include:
- Safety
- Structural
- Electrical
- Plumbing
- Quality
- Code Compliance
- Workmanship
- Materials`;
    }

    async analyze(post) {
        const messages = [
            { role: 'system', content: this.systemPrompt },
            {
                role: 'user',
                content: `Please analyze this validated construction issue:
Title: ${post.title}
Description: ${post.description}
Image Path: ${post.image_path}
Identified Issues: ${JSON.stringify(post.validationResult.identifiedIssues)}

Provide a detailed analysis in JSON format with the following structure:
{
    "issues": [
        {
            "title": "Clear, descriptive issue title (up to 10 words)",
            "description": "Detailed description of the issue (up to 100 words)",
            "issueType": "Category of the issue",
            "assignedTo": "Responsible party",
            "rootCause": "Likely cause of the issue",
            "confidence": "Score between 1-100"
        }
    ],
    "overallSeverity": "Score between 1-100",
    "recommendedActions": ["List of recommended actions"],
    "additionalNotes": "Any other relevant observations"
}`
            }
        ];

        try {
            const response = await this.callOpenAI(messages);
            return JSON.parse(response);
        } catch (error) {
            console.error('Error in construction analyzer agent:', error);
            throw error;
        }
    }

    async analyzeBatch(posts) {
        const results = [];
        const errors = [];

        for (const post of posts) {
            try {
                const analysis = await this.analyze(post);
                results.push({
                    ...post,
                    analysis
                });
            } catch (error) {
                console.error(`Error analyzing post ${post.id}:`, error);
                errors.push({
                    post,
                    error: error.message
                });
            }
        }

        return {
            results,
            errors
        };
    }
}

module.exports = ConstructionAnalyzerAgent;