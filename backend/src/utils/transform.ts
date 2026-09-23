export interface DBDocument {
  id: number;
  schemeId: number;
  documentName: string;
}

export interface DBEligibilityRule {
  id: number;
  schemeId: number;
  minAge: number | null;
  maxAge: number | null;
  incomeLimit: number | null;
  occupation: string | null;
  category: string | null;
  student: boolean | null;
  farmer: boolean | null;
  disabled: boolean | null;
  state: string | null;
}

export interface DBScheme {
  id: number;
  name: string;
  description: string;
  benefits: string;
  applicationProcess: string;
  officialUrl: string | null;
  category: string;
  state: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  eligibilityRules: DBEligibilityRule[];
  documents: DBDocument[];
}

export interface FrontendScheme {
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

export function toFrontendScheme(
  dbScheme: DBScheme,
  eligibilityReason: string = "You meet the eligibility criteria for this scheme."
): FrontendScheme {
  const benefitsList = dbScheme.benefits
    .split(/\n|•|,|;/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const stepsList = dbScheme.applicationProcess
    .split(/\n|\d+\.|,|;/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const criteriaList: string[] = [];
  for (const rule of dbScheme.eligibilityRules) {
    if (rule.minAge != null) criteriaList.push(`Minimum age: ${rule.minAge} years`);
    if (rule.maxAge != null) criteriaList.push(`Maximum age: ${rule.maxAge} years`);
    if (rule.incomeLimit != null) criteriaList.push(`Annual income must be ₹${rule.incomeLimit.toLocaleString()} or less`);
    if (rule.occupation) criteriaList.push(`Occupation: ${rule.occupation}`);
    if (rule.category) criteriaList.push(`Category: ${rule.category}`);
    if (rule.student === true) criteriaList.push(`Must be a student`);
    if (rule.farmer === true) criteriaList.push(`Must be a farmer`);
    if (rule.disabled === true) criteriaList.push(`Persons with disabilities eligible`);
    if (rule.state) criteriaList.push(`State: ${rule.state}`);
  }
  if (criteriaList.length === 0) {
    criteriaList.push("Open to all eligible citizens");
  }

  const faqs = generateFaqs(dbScheme);

  return {
    id: String(dbScheme.id),
    name: dbScheme.name,
    shortDescription: dbScheme.description,
    benefits: benefitsList.length > 0 ? benefitsList : [dbScheme.benefits],
    eligibilityReason,
    eligibilityCriteria: criteriaList,
    documentsRequired: dbScheme.documents.map((d) => d.documentName),
    applicationSteps: stepsList.length > 0 ? stepsList : [dbScheme.applicationProcess],
    officialLink: dbScheme.officialUrl || "https://india.gov.in",
    faqs,
    category: dbScheme.category,
  };
}

function generateFaqs(scheme: DBScheme): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: `What is ${scheme.name}?`,
    answer: scheme.description,
  });

  faqs.push({
    question: "What documents do I need?",
    answer: `You will need: ${scheme.documents.map((d) => d.documentName).join(", ")}.`,
  });

  faqs.push({
    question: "How do I apply?",
    answer: scheme.applicationProcess,
  });

  if (scheme.officialUrl) {
    faqs.push({
      question: "Where can I get more information?",
      answer: `Visit the official website at ${scheme.officialUrl} for the latest and most accurate information. Always verify details on the official portal before applying.`,
    });
  }

  return faqs;
}
