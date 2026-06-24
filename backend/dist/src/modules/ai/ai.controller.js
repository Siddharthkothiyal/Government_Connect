"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const gemini_service_1 = require("../../services/gemini.service");
const prisma_1 = __importDefault(require("../../config/prisma"));
const validation_1 = require("../../utils/validation");
const geminiService = new gemini_service_1.GeminiService();
class AIController {
    async explainScheme(req, res) {
        const data = validation_1.explainSchema.parse(req.body);
        const scheme = await prisma_1.default.scheme.findUniqueOrThrow({
            where: { id: data.schemeId },
            include: { documents: true, eligibilityRules: true },
        });
        const prompt = `
Explain this government scheme in simple English and Hindi.

Scheme Details:
Name: ${scheme.name}
Description: ${scheme.description}
Benefits: ${scheme.benefits}
Application Process: ${scheme.applicationProcess}
Documents Required: ${scheme.documents.map((document) => document.documentName).join(', ')}
Official URL: ${scheme.officialUrl || 'Not available'}

User Profile:
${JSON.stringify(data.userProfile, null, 2)}

Please include:
1. Why the user qualifies (if eligible)
2. Clear benefits
3. Required documents
4. Step-by-step application process

Return the response as JSON with the following structure:
{
  "english": {
    "whyQualify": "...",
    "benefits": "...",
    "documents": "...",
    "application": "..."
  },
  "hindi": {
    "whyQualify": "...",
    "benefits": "...",
    "documents": "...",
    "application": "..."
  }
}
`;
        const response = await geminiService.generateContent(prompt);
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        try {
            const parsed = JSON.parse(cleanedResponse);
            res.json({ success: true, data: parsed });
        }
        catch {
            res.json({ success: true, data: { raw: response } });
        }
    }
}
exports.AIController = AIController;
