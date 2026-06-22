import { Request, Response } from 'express';
import { chatSchema } from '../../utils/validation';
import prisma from '../../config/prisma';
import { GeminiService } from '../../services/gemini.service';

const geminiService = new GeminiService();

export class ChatController {
  async chat(req: Request, res: Response) {
    const data = chatSchema.parse(req.body);

    const schemes = await prisma.scheme.findMany({
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

    const context = schemes.map((s) => `
Scheme: ${s.name}
Description: ${s.description}
Benefits: ${s.benefits}
Application Process: ${s.applicationProcess}
Documents: ${s.documents.map((d) => d.documentName).join(', ')}
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
