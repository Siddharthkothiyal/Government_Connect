import { useAppStore } from "@/context/useAppStore";

const dict = {
  en: {
    heroTitle: "Find Government Schemes You Are Eligible For in Seconds",
    heroSubtitle:
      "Answer a few simple questions and our AI assistant will tell you exactly which government schemes you can benefit from — in plain language.",
    checkEligibility: "Check Eligibility",
    howItWorks: "How it works",
    step1Title: "Tell us about yourself",
    step1Desc: "Answer a short, simple form about your age, income, occupation and more.",
    step2Title: "AI checks your eligibility",
    step2Desc: "Our system compares your details against hundreds of government schemes.",
    step3Title: "Get clear results",
    step3Desc: "See which schemes you qualify for and exactly why, in English or Hindi.",
    trustTitle: "Official scheme guidance assistant",
    trustDesc: "Built to help every citizen understand government benefits — no jargon, no confusion.",
    languagesSupported: "Available in English and Hindi",
    findSchemes: "Find Eligible Schemes",
    next: "Next",
    back: "Back",
    submit: "Find Eligible Schemes",
    analyzing: "Finding best schemes for you...",
    viewDetails: "View Details",
    whyEligible: "Why you are eligible",
    aiSummary: "AI Personalized Summary",
    chatPlaceholder: "Ask about any scheme...",
    home: "Home",
    checkEligibilityNav: "Check Eligibility",
    assistant: "AI Assistant",
    profile: "Profile",
  },
  hi: {
    heroTitle: "सेकंडों में जानें आप किन सरकारी योजनाओं के लिए पात्र हैं",
    heroSubtitle:
      "कुछ सरल सवालों के जवाब दें और हमारा AI सहायक आपको आसान भाषा में बताएगा कि आप किन सरकारी योजनाओं का लाभ ले सकते हैं।",
    checkEligibility: "पात्रता जांचें",
    howItWorks: "यह कैसे काम करता है",
    step1Title: "अपने बारे में बताएं",
    step1Desc: "अपनी आयु, आय, व्यवसाय और अन्य जानकारी एक छोटे फॉर्म में भरें।",
    step2Title: "AI आपकी पात्रता जांचता है",
    step2Desc: "हमारा सिस्टम आपकी जानकारी को सैकड़ों सरकारी योजनाओं से मिलाता है।",
    step3Title: "स्पष्ट परिणाम पाएं",
    step3Desc: "देखें आप किन योजनाओं के लिए पात्र हैं और क्यों, अंग्रेज़ी या हिंदी में।",
    trustTitle: "आधिकारिक योजना सहायता सहायक",
    trustDesc: "हर नागरिक को सरकारी लाभ समझने में मदद के लिए बनाया गया — बिना जटिल भाषा के।",
    languagesSupported: "अंग्रेज़ी और हिंदी में उपलब्ध",
    findSchemes: "पात्र योजनाएं खोजें",
    next: "आगे",
    back: "पीछे",
    submit: "पात्र योजनाएं खोजें",
    analyzing: "आपके लिए सर्वोत्तम योजनाएं खोजी जा रही हैं...",
    viewDetails: "विवरण देखें",
    whyEligible: "आप पात्र क्यों हैं",
    aiSummary: "AI व्यक्तिगत सारांश",
    chatPlaceholder: "किसी भी योजना के बारे में पूछें...",
    home: "होम",
    checkEligibilityNav: "पात्रता जांचें",
    assistant: "AI सहायक",
    profile: "प्रोफाइल",
  },
};

export function useT() {
  const language = useAppStore((s) => s.language);
  return (key: keyof typeof dict["en"]) => dict[language][key] || dict.en[key];
}
