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
                    { category: { contains: data.message, mode: 'insensitive' } },
                    { benefits: { contains: data.message, mode: 'insensitive' } },
                ],
                isActive: true,
            },
            take: 5,
            include: { documents: true, eligibilityRules: true },
        });
        const context = schemes
            .map((scheme) => `
Scheme: ${scheme.name}
Category: ${scheme.category}
Description: ${scheme.description}
Benefits: ${scheme.benefits}
Application Process: ${scheme.applicationProcess}
Documents Required: ${scheme.documents.map((d) => d.documentName).join(', ')}
Official URL: ${scheme.officialUrl || 'See india.gov.in'}
`)
            .join('\n---\n');
        const fallbackReply = schemes.length > 0
            ? `Based on your question "${data.message}", here are some relevant schemes you may want to check: ${schemes
                .map((s) => s.name)
                .join(', ')}. For detailed eligibility, please fill the form on the Check Eligibility page. Always verify details on the official government website before applying.`
            : `Thank you for your question. I specialize in Indian government schemes. Could you tell me a bit more about what you're looking for — for example, farming (PM-KISAN), health (Ayushman Bharat), housing (PMAY), education scholarships, or a specific scheme name? You can also use the Check Eligibility form to get personalized results.`;
        try {
            const prompt = `
You are a helpful, friendly assistant for the Government of India scheme discovery platform called "SchemeWise AI".

CRITICAL RULES:
- Answer ONLY about Indian government schemes.
- Use ONLY the context provided below. If the context is empty or does not answer the user's question, say so politely and guide them to use the "Check Eligibility" form.
- NEVER invent schemes, numbers, URLs, or dates.
- Speak in very simple, plain language that a rural or semi-literate citizen can understand. Avoid jargon.
- Keep your answer concise but helpful (3-6 sentences max).
- When in doubt, advise the user to verify on the official website or visit the nearest Common Service Centre (CSC).
- If the user asks in Hindi, reply in Hindi; otherwise reply in English.

Context of relevant schemes:
${context || '(No specific scheme data loaded — guide the user to fill the eligibility form)'}

User's question: ${data.message}

Your reply:
`;
            const rawReply = await geminiService.generateContent(prompt);
            res.json({ reply: rawReply.trim() });
        }
        catch (err) {
            res.json({ reply: fallbackReply });
        }
    }
}
exports.ChatController = ChatController;
