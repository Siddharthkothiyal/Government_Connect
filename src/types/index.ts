export type Occupation = "Farmer" | "Student" | "Employed" | "Unemployed";
export type Category = "General" | "SC" | "ST" | "OBC";
export type Gender = "Male" | "Female" | "Other";
export type YesNo = "Yes" | "No";

export interface UserProfile {
  fullName: string;
  age: number | "";
  gender: Gender | "";
  state: string;
  district: string;
  occupation: Occupation | "";
  annualIncome: number | "";
  category: Category | "";
  disability: YesNo | "";
  student: YesNo | "";
}

export interface Scheme {
  id: string;
  name: string;
  shortDescription: string;
  benefits: string[];
  eligibilityReason: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  applicationSteps: string[];
  officialLink: string;
  faqs: { question: string; answer: string }[];
  category: string;
}

export interface EligibilityResponse {
  schemes: Scheme[];
  aiSummaryEn: string;
  aiSummaryHi: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

export interface SearchHistoryItem {
  id: string;
  date: string;
  profileSnapshot: Partial<UserProfile>;
  resultCount: number;
}

export type Language = "en" | "hi";
