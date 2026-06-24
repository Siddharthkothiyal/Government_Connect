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

    const context = schemes.map((scheme: { name: string; description: string; benefits: string; applicationProcess: string; documents: Array<{ documentName: string }> }) => `
Scheme: ${scheme.name}
Description: ${scheme.description}
Benefits: ${scheme.benefits}
Application Process: ${scheme.applicationProcess}
Documents: ${scheme.documents.map((document: { documentName: string }) => document.documentName).join(', ')}
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
