"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const validation_1 = require("../../utils/validation");
const prisma_1 = __importDefault(require("../../config/prisma"));
const gemini_service_1 = require("../../services/gemini.service");
const geminiService = new gemini_service_1.GeminiService();
class ChatController {
    async chat(req, res) {
        const data = validation_1.chatSchema.parse(req.body);
        const schemes = await prisma_1.default.scheme.findMany({
            where: {
                OR: [
                    { name: { contains: data.message, mode: 'insensitive' } },
                    { description: { contains: data.message, mode: 'insensitive' } },
                ],
                isActive: true,
            },
            take: 5,
            include: { documents: true, eligibilityRules: true },
        });
        const context = schemes.map((scheme) => `
Scheme: ${scheme.name}
Description: ${scheme.description}
Benefits: ${scheme.benefits}
Application Process: ${scheme.applicationProcess}
Documents: ${scheme.documents.map((document) => document.documentName).join(', ')}
`).join('\n---\n');
        const prompt = `
You are a helpful assistant for an Indian government scheme discovery platform. Answer the user's question based ONLY on the provided context. If you don't have the information, say so clearly. Do NOT invent any schemes or information.

Context:
${context}

User's Question: ${data.message}

Please provide a clear, helpful answer in simple language.
`;
        const response = await geminiService.generateContent(prompt);
        res.json({ success: true, data: { answer: response, schemes } });
    }
}
exports.ChatController = ChatController;
