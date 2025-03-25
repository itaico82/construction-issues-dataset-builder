const OpenAI = require('openai');
const config = require('../../config/config');

class BaseAgent {
    constructor() {
        this.openai = new OpenAI({
            apiKey: config.api.openai.apiKey
        });
        this.model = config.api.openai.model;
    }

    async analyze(data) {
        throw new Error('analyze() method must be implemented by subclass');
    }

    async callOpenAI(messages) {
        try {
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }
}

module.exports = BaseAgent;