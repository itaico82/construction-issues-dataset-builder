const BaseAgent = require('./baseAgent');

class ValidatorAgent extends BaseAgent {
    constructor() {
        super();
        this.systemPrompt = `You are a validator agent responsible for verifying if images and posts show valid construction site issues.
Your role is to:
1. Analyze the image and post content
2. Determine if it shows a genuine construction site issue
3. Provide a confidence score for the validation
4. Explain the reasoning behind the decision

Valid issues include:
- Safety violations
- Structural problems
- Quality control issues
- Code violations
- Poor workmanship
- Installation errors
- Material defects`;
    }

    async analyze(post) {
        const messages = [
            { role: 'system', content: this.systemPrompt },
            {
                role: 'user',
                content: `Please analyze this construction post:
Title: ${post.title}
Description: ${post.description}
Image Path: ${post.image_path}

Determine if this shows a valid construction issue and provide your analysis in JSON format with the following fields:
{
    "isValid": boolean,
    "confidence": number (0-100),
    "reason": "string explaining your decision",
    "identifiedIssues": ["list of specific issues identified"]
}`
            }
        ];

        try {
            const response = await this.callOpenAI(messages);
            return JSON.parse(response);
        } catch (error) {
            console.error('Error in validator agent:', error);
            throw error;
        }
    }
}

module.exports = ValidatorAgent;