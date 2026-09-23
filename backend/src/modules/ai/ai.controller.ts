import { Request, Response } from 'express';
import { GeminiService } from '../../services/gemini.service';

const geminiService = new GeminiService();

const fallbackEn =
  'You qualify for these schemes because your profile (occupation, income, category, age, and student/disability status where applicable) matches the official eligibility rules. Each scheme card shows the exact reason. Click "View Details" on any card to see required documents and the step-by-step application process. Always verify the latest rules on the official government website before applying.';

const fallbackHi =
  'आप इन योजनाओं के लिए पात्र हैं क्योंकि आपकी जानकारी (व्यवसाय, आय, श्रेणी, आयु, और यथास्थिति छात्र/अपंगता स्थिति) सरकारी पात्रता नियमों से मेल खाती है। हर योजना कार्ड पर सटीक कारण दिखाया गया है। किसी भी कार्ड पर "विवरण देखें" दबाकर आवश्यक दस्तावेज़ और आवेदन प्रक्रिया के चरण देखें। कृपया आवेदन से पहले आधिकारिक वेबसाइट पर नवीनतम नियम ज़रूर जांचें।';

export class AIController {
  async explainScheme(req: Request, res: Response) {
    const { profile, schemes } = req.body as {
      profile?: any;
      schemes?: any[];
    };

    const profileSnapshot = profile
      ? `- Occupation: ${profile.occupation || 'N/A'}\n- State: ${profile.state || 'N/A'}\n- District: ${profile.district || 'N/A'}\n- Age: ${profile.age || 'N/A'}\n- Income: ${profile.annualIncome != null ? '₹' + profile.annualIncome : 'N/A'}\n- Category: ${profile.category || 'N/A'}\n- Student: ${profile.student || 'No'}\n- Disability: ${profile.disability || 'No'}`
      : '';

    const schemeNames = (schemes || []).map((s) => s.name).join(', ');

    try {
      const prompt = `
You are a helpful, empathetic government scheme assistant in India. Your job is to explain WHY the user is eligible and WHAT they should do next, in TWO simple paragraphs: one in ENGLISH, one in HINDI.

User Profile:
${profileSnapshot}

Schemes found eligible:
${schemeNames || '(None found)'}

Write the ENGLISH paragraph first (4-6 simple sentences):
- Start with "You qualify for these schemes because..."
- Mention 1-2 profile attributes (like your income, occupation, category, age) that match the rules.
- Tell them the next practical step: click View Details, gather documents, apply via CSC or the official portal.
- Remind them to always verify on the official scheme website.

Then write the HINDI paragraph (4-6 simple sentences, Devanagari):
- Start with "आप इन योजनाओं के लिए पात्र हैं क्योंकि..."
- Mention 1-2 profile attributes.
- Tell them next practical step in Hindi.
- Remind them to verify on official website.

Return ONLY a JSON object in this format. Do NOT include any other text, code fences, or markdown.
{
  "en": "English paragraph here",
  "hi": "Hindi paragraph here"
}
`;

      const raw = await geminiService.generateContent(prompt);
      const cleaned = raw.replace(/```json|```/g, '').trim();
      try {
        const parsed = JSON.parse(cleaned);
        res.json({
          en: typeof parsed.en === 'string' ? parsed.en : fallbackEn,
          hi: typeof parsed.hi === 'string' ? parsed.hi : fallbackHi,
        });
      } catch {
        res.json({ en: fallbackEn, hi: fallbackHi });
      }
    } catch {
      res.json({ en: fallbackEn, hi: fallbackHi });
    }
  }
}
