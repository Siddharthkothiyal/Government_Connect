"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const env_1 = require("../config/env");
const axios_1 = __importDefault(require("axios"));
class GeminiService {
    constructor() {
        this.apiKey = env_1.env.GEMINI_API_KEY;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }
    async generateContent(prompt) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}?key=${this.apiKey}`, {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                },
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data.candidates[0].content.parts[0].text;
        }
        catch (error) {
            console.error('Gemini API error:', error);
            throw new Error('Failed to generate content');
        }
    }
}
exports.GeminiService = GeminiService;
