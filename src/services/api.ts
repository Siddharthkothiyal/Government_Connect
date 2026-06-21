import axios from "axios";
import type { ChatMessage, EligibilityResponse, Scheme, UserProfile } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// ---- Mock fallbacks (used when backend is unavailable, so the UI is always demo-able) ----
const MOCK_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    shortDescription: "Income support of ₹6,000/year for small and marginal farmers.",
    benefits: ["₹2,000 every 4 months", "Direct bank transfer", "No repayment needed"],
    eligibilityReason: "You are eligible because you are registered as a Farmer.",
    eligibilityCriteria: ["Must be a landholding farmer", "Family-based eligibility", "Excludes income-tax payers"],
    documentsRequired: ["Aadhaar Card", "Land ownership papers", "Bank account passbook"],
    applicationSteps: [
      "Visit the PM-KISAN portal or nearest CSC center",
      "Fill the registration form with land and bank details",
      "Submit Aadhaar for verification",
      "Track status using your registration number",
    ],
    officialLink: "https://pmkisan.gov.in",
    faqs: [
      { question: "How much money will I get?", answer: "₹6,000 per year, paid in 3 installments of ₹2,000." },
      { question: "Do I need land documents?", answer: "Yes, proof of land ownership is required." },
    ],
    category: "Agriculture",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat (PM-JAY)",
    shortDescription: "Free health insurance cover up to ₹5 lakh per family per year.",
    benefits: ["Free hospital treatment", "Cashless care at empanelled hospitals", "Covers pre-existing diseases"],
    eligibilityReason: "You may be eligible based on your income and category criteria.",
    eligibilityCriteria: ["Belongs to economically weaker family", "Listed in SECC database or eligible category"],
    documentsRequired: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    applicationSteps: [
      "Check eligibility on the PM-JAY website",
      "Visit nearest Common Service Centre",
      "Get your Ayushman Card made",
      "Use card at any empanelled hospital",
    ],
    officialLink: "https://pmjay.gov.in",
    faqs: [{ question: "Is treatment really free?", answer: "Yes, cashless treatment up to ₹5 lakh/year." }],
    category: "Health",
  },
  {
    id: "pm-awas",
    name: "PM Awas Yojana",
    shortDescription: "Financial assistance to build or buy a house.",
    benefits: ["Subsidy on home loan interest", "Up to ₹2.67 lakh assistance", "Priority for women applicants"],
    eligibilityReason: "Based on your income category, you may qualify for housing assistance.",
    eligibilityCriteria: ["Should not own a pucca house", "Household income within prescribed limits"],
    documentsRequired: ["Aadhaar Card", "Income Certificate", "Bank account details"],
    applicationSteps: [
      "Apply online at pmaymis.gov.in or via CSC",
      "Fill personal and income details",
      "Upload required documents",
      "Track application status online",
    ],
    officialLink: "https://pmaymis.gov.in",
    faqs: [{ question: "Can I apply if I already own land?", answer: "Yes, as long as you don't own a pucca house." }],
    category: "Housing",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEligibleSchemes(profile: UserProfile): Promise<EligibilityResponse> {
  try {
    const { data } = await api.post<EligibilityResponse>("/eligibility", profile);
    return data;
  } catch {
    await delay(1200);
    const filtered = MOCK_SCHEMES.filter((s) => {
      if (profile.occupation === "Farmer" && s.id === "pm-kisan") return true;
      if (profile.occupation === "Student" && s.id !== "pm-kisan") return true;
      return true;
    });
    return {
      schemes: filtered,
      aiSummaryEn: `Based on your profile (${profile.occupation || "citizen"} from ${profile.district || "your district"}, ${profile.state || "your state"}), we found ${filtered.length} schemes you may be eligible for. These include income support, health insurance, and housing benefits tailored to your category and income level.`,
      aiSummaryHi: `आपकी जानकारी के आधार पर (${profile.occupation || "नागरिक"}, ${profile.district || "जिला"}, ${profile.state || "राज्य"}), हमें ${filtered.length} योजनाएं मिली हैं जिनके लिए आप पात्र हो सकते हैं। इनमें आय सहायता, स्वास्थ्य बीमा और आवास सहायता शामिल हैं।`,
    };
  }
}

export async function fetchSchemeById(id: string): Promise<Scheme | undefined> {
  try {
    const { data } = await api.get<Scheme>(`/schemes/${id}`);
    return data;
  } catch {
    await delay(500);
    return MOCK_SCHEMES.find((s) => s.id === id);
  }
}

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<string> {
  try {
    const { data } = await api.post<{ reply: string }>("/chat", { message, history });
    return data.reply;
  } catch {
    await delay(900);
    if (/ayushman/i.test(message)) {
      return "Ayushman Bharat gives free hospital treatment up to ₹5 lakh per year for eligible families. You usually qualify if your household income is low and you're listed in the government database. Would you like steps to check your eligibility?";
    }
    if (/awas|house|home/i.test(message)) {
      return "PM Awas Yojana helps you build or buy a house with financial support. You can apply online at pmaymis.gov.in or visit your nearest Common Service Centre with your Aadhaar and income certificate.";
    }
    if (/kisan|farmer/i.test(message)) {
      return "PM-KISAN gives farmers ₹6,000 per year in three installments directly to their bank account. You need land ownership papers and Aadhaar to apply.";
    }
    return "I can help you find government schemes and explain how to apply. Could you tell me a bit more about what you're looking for — for example, health, housing, farming, or education support?";
  }
}

export async function explainEligibility(profile: UserProfile, schemes: Scheme[]): Promise<{ en: string; hi: string }> {
  try {
    const { data } = await api.post("/ai/explain", { profile, schemes });
    return data;
  } catch {
    await delay(600);
    return {
      en: `You qualify for these schemes mainly because of your occupation (${profile.occupation}), income level, and category (${profile.category}). Each card below explains the exact reason.`,
      hi: `आप मुख्य रूप से अपने व्यवसाय (${profile.occupation}), आय स्तर, और श्रेणी (${profile.category}) के कारण इन योजनाओं के लिए पात्र हैं। नीचे हर कार्ड में सटीक कारण बताया गया है।`,
    };
  }
}

export default api;
