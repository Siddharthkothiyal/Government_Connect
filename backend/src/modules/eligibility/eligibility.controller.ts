import { Request, Response } from 'express';
import { EligibilityService } from './eligibility.service';
import { eligibilitySchema } from '../../utils/validation';
import prisma from '../../config/prisma';
import { GeminiService } from '../../services/gemini.service';
import { toFrontendScheme, type DBScheme } from '../../utils/transform';

const eligibilityService = new EligibilityService();
const geminiService = new GeminiService();

async function generateAiSummaries(
  profile: any,
  schemes: { dbScheme: DBScheme; eligibilityReason: string }[]
): Promise<{ aiSummaryEn: string; aiSummaryHi: string }> {
  if (schemes.length === 0) {
    return {
      aiSummaryEn: `Based on your profile (${profile.occupation || 'citizen'} from ${profile.district || 'your district'}, ${profile.state || 'your state'}), we did not find any schemes at this time. You may try adjusting your income or category details to see more options.`,
      aiSummaryHi: `आपकी जानकारी के आधार पर (${profile.occupation || 'नागरिक'}, ${profile.district || 'जिला'}, ${profile.state || 'राज्य'}), हमें इस समय कोई योजना नहीं मिली है। आप अधिक विकल्प देखने के लिए अपनी आय या श्रेणी का विवरण बदलकर प्रयास कर सकते हैं।`,
    };
  }

  const schemeNames = schemes.map((s) => s.dbScheme.name).join(', ');
  const fallbackEn = `Based on your profile (${profile.occupation || 'citizen'} from ${profile.district || 'your district'}, ${profile.state || 'your state'}), we found ${schemes.length} schemes you may be eligible for. These include: ${schemeNames}. Each scheme card below explains the exact reason you qualify, the benefits you'll receive, required documents, and step-by-step application process.`;
  const fallbackHi = `आपकी जानकारी के आधार पर (${profile.occupation || 'नागरिक'}, ${profile.district || 'जिला'}, ${profile.state || 'राज्य'}), हमें ${schemes.length} योजनाएं मिली हैं जिनके लिए आप पात्र हो सकते हैं। इनमें शामिल हैं: ${schemeNames}। नीचे हर योजना कार्ड में बताया गया है कि आप पात्र क्यों हैं, क्या लाभ मिलेंगे, कौन से दस्तावेज़ चाहिए, और आवेदन करने की पूरी प्रक्रिया।`;

  try {
    const prompt = `
You are a helpful government scheme assistant for an Indian citizen. Generate a personalized summary for the user based on their profile and eligible schemes.

User Profile:
- Occupation: ${profile.occupation || 'Not specified'}
- State: ${profile.state || 'Not specified'}
- District: ${profile.district || 'Not specified'}
- Age: ${profile.age || 'Not specified'}
- Annual Income: ${profile.annualIncome != null ? '₹' + profile.annualIncome.toLocaleString() : 'Not specified'}
- Category: ${profile.category || 'Not specified'}
- Student: ${profile.student ? 'Yes' : 'No'}
- Disability: ${profile.disability ? 'Yes' : 'No'}

Eligible Schemes (${schemes.length}):
${schemes.map((s, i) => `${i + 1}. ${s.dbScheme.name}: ${s.dbScheme.description}`).join('\n')}

Please write TWO paragraphs:
1. First paragraph in clear, simple ENGLISH (max 150 words). Personalize it with their occupation, state, and the number of schemes. Give them encouragement and explain what they should do next.
2. Second paragraph in clear, simple HINDI (max 150 words). Same information but in Hindi for users who prefer it.

Return ONLY a JSON object with this exact format:
{
  "en": "English paragraph here",
  "hi": "Hindi paragraph here"
}
`;

    const raw = await geminiService.generateContent(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return { aiSummaryEn: parsed.en || fallbackEn, aiSummaryHi: parsed.hi || fallbackHi };
  } catch {
    return { aiSummaryEn: fallbackEn, aiSummaryHi: fallbackHi };
  }
}

export class EligibilityController {
  async checkEligibility(req: Request, res: Response) {
    const data = eligibilitySchema.parse(req.body);

    if (req.user?.id) {
      try {
        await prisma.userSearchHistory.create({
          data: {
            userId: req.user.id,
            queryData: data as any,
          },
        });
      } catch {
        // ignore history write errors, eligibility check itself should proceed
      }
    }

    const serviceResults = await eligibilityService.checkEligibility(data as any);

    const schemePairs = serviceResults.map((r: any) => ({
      dbScheme: r.scheme as any as DBScheme,
      eligibilityReason: r.eligibilityReason,
    }));

    const frontendSchemes = schemePairs.map((pair) =>
      toFrontendScheme(pair.dbScheme, pair.eligibilityReason)
    );

    const { aiSummaryEn, aiSummaryHi } = await generateAiSummaries(data, schemePairs);

    res.json({
      schemes: frontendSchemes,
      aiSummaryEn,
      aiSummaryHi,
    });
  }
}
