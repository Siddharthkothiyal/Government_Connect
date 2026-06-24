"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/config/prisma"));
const schemes = [
    {
        name: 'PM Kisan Samman Nidhi',
        description: 'Income support scheme for farmer families across the country.',
        benefits: '₹6000 per year in 3 equal installments of ₹2000 each.',
        applicationProcess: 'Register on pmkisan.gov.in or through CSC.',
        officialUrl: 'https://pmkisan.gov.in',
        category: 'Agriculture',
        state: null,
        documents: ['Aadhaar Card', 'Land Ownership Documents', 'Bank Account Details'],
        eligibilityRules: [
            { minAge: 18, farmer: true, incomeLimit: null },
        ],
    },
    {
        name: 'Ayushman Bharat Yojana',
        description: 'National Health Protection Scheme providing free healthcare access.',
        benefits: 'Health cover of ₹5 lakh per family per year for secondary and tertiary care.',
        applicationProcess: 'Check eligibility on PMJAY portal, visit empanelled hospital.',
        officialUrl: 'https://pmjay.gov.in',
        category: 'Healthcare',
        state: null,
        documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
        eligibilityRules: [
            { category: 'BPL', incomeLimit: 500000 },
        ],
    },
    {
        name: 'Pradhan Mantri Awas Yojana (PMAY)',
        description: 'Housing for all mission providing affordable houses.',
        benefits: 'Financial assistance up to ₹2.67 lakh for house construction.',
        applicationProcess: 'Apply online on pmaymis.gov.in.',
        officialUrl: 'https://pmaymis.gov.in',
        category: 'Housing',
        state: null,
        documents: ['Aadhaar Card', 'Income Certificate', 'Land Documents'],
        eligibilityRules: [
            { incomeLimit: 1800000, category: 'EWS/LIG' },
        ],
    },
    {
        name: 'National Scholarship Portal',
        description: 'Central sector scheme of scholarships for college students.',
        benefits: 'Scholarship amount up to ₹25000 per annum.',
        applicationProcess: 'Apply through NSP portal.',
        officialUrl: 'https://scholarships.gov.in',
        category: 'Education',
        state: null,
        documents: ['Mark Sheets', 'Aadhaar Card', 'Bank Details', 'Income Certificate'],
        eligibilityRules: [
            { student: true, minAge: 17, maxAge: 30, incomeLimit: 800000 },
        ],
    },
    {
        name: 'Mudra Yojana',
        description: 'Micro Units Development and Refinance Agency scheme.',
        benefits: 'Loans from ₹50,000 to ₹10 lakh for non-farm micro units.',
        applicationProcess: 'Apply through any nationalized bank.',
        officialUrl: 'https://mudra.org.in',
        category: 'Business',
        state: null,
        documents: ['Business Plan', 'ID Proof', 'Address Proof', 'Bank Statements'],
        eligibilityRules: [
            { occupation: 'Small Business Owner', minAge: 18 },
        ],
    },
    {
        name: 'PM Jan Dhan Yojana',
        description: 'Financial inclusion scheme to provide banking services.',
        benefits: 'Zero balance account with Rupay debit card and insurance cover.',
        applicationProcess: 'Visit any bank branch to open account.',
        officialUrl: 'https://pmjdy.gov.in',
        category: 'Finance',
        state: null,
        documents: ['Aadhaar Card', 'Voter ID'],
        eligibilityRules: [
            { minAge: 10 },
        ],
    },
    {
        name: 'Nirbhaya Fund Scheme',
        description: 'Scheme for safety and security of women.',
        benefits: 'Various initiatives including women helpline, safe cities.',
        applicationProcess: 'Contact local authorities or women helpdesk.',
        officialUrl: 'https://wcd.nic.in',
        category: 'Women Welfare',
        state: null,
        documents: ['Any ID Proof'],
        eligibilityRules: [
            { category: 'Female', minAge: 1 },
        ],
    },
    {
        name: 'Atal Pension Yojana',
        description: 'Pension scheme for workers in unorganized sector.',
        benefits: 'Fixed pension from ₹1000 to ₹5000 per month after 60 years.',
        applicationProcess: 'Open through banks or post offices.',
        officialUrl: 'https://npscra.nsdl.co.in',
        category: 'Social Security',
        state: null,
        documents: ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
        eligibilityRules: [
            { minAge: 18, maxAge: 40 },
        ],
    },
    {
        name: 'Digital India',
        description: 'Programme to transform India into digitally empowered society.',
        benefits: 'Various digital services, Aadhaar, DigiLocker, etc.',
        applicationProcess: 'Avail services through respective portals.',
        officialUrl: 'https://digitalindia.gov.in',
        category: 'Technology',
        state: null,
        documents: ['Aadhaar Card'],
        eligibilityRules: [
            { minAge: 1 },
        ],
    },
    {
        name: 'Skill India Mission',
        description: 'Skill development and entrepreneurship scheme.',
        benefits: 'Free skill training with placement assistance.',
        applicationProcess: 'Register on skillindia.gov.in.',
        officialUrl: 'https://skillindia.gov.in',
        category: 'Education',
        state: null,
        documents: ['Aadhaar Card', 'Educational Certificates'],
        eligibilityRules: [
            { minAge: 15, maxAge: 45 },
        ],
    },
];
async function main() {
    console.log('🌱 Starting to seed database...');
    await prisma_1.default.savedScheme.deleteMany();
    await prisma_1.default.userSearchHistory.deleteMany();
    await prisma_1.default.document.deleteMany();
    await prisma_1.default.eligibilityRule.deleteMany();
    await prisma_1.default.scheme.deleteMany();
    for (const schemeData of schemes) {
        const { documents, eligibilityRules, ...scheme } = schemeData;
        const createdScheme = await prisma_1.default.scheme.create({
            data: {
                ...scheme,
                documents: {
                    create: documents.map((name) => ({ documentName: name })),
                },
                eligibilityRules: {
                    create: eligibilityRules,
                },
            },
        });
        console.log(`✅ Created scheme: ${createdScheme.name}`);
    }
    console.log('🎉 Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
