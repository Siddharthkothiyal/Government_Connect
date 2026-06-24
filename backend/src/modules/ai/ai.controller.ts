import { Request, Response } from 'express';
import { GeminiService } from '../../services/gemini.service';
import prisma from '../../config/prisma';
import { explainSchema } from '../../utils/validation';

const geminiService = new GeminiService();

export class AIController {
  async explainScheme(req: Request, res: Response) {
    const data = explainSchema.parse(req.body);
    const scheme = await prisma.scheme.findUniqueOrThrow({
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
Documents Required: ${scheme.documents.map((document: { documentName: string }) => document.documentName).join(', ')}
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
    } catch {
      res.json({ success: true, data: { raw: response } });
    }
  }
}
