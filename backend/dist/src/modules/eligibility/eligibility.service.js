"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class EligibilityService {
    async checkEligibility(profile) {
        const schemes = await prisma_1.default.scheme.findMany({
            where: { isActive: true },
            include: { eligibilityRules: true, documents: true },
        });
        const eligibleSchemes = schemes.reduce((results, scheme) => {
            const matchingRules = scheme.eligibilityRules.filter((rule) => this.isRuleMatching(rule, profile));
            if (matchingRules.length > 0 || scheme.eligibilityRules.length === 0) {
                results.push({
                    schemeId: scheme.id,
                    schemeName: scheme.name,
                    scheme: scheme,
                    eligibilityReason: this.getEligibilityReason(matchingRules.length > 0 ? matchingRules : scheme.eligibilityRules, profile),
                });
            }
            return results;
        }, []);
        return eligibleSchemes;
    }
    isRuleMatching(rule, profile) {
        const conditions = [];
        if (rule.minAge !== null && rule.minAge !== undefined) {
            conditions.push(profile.age >= rule.minAge);
        }
        if (rule.maxAge !== null && rule.maxAge !== undefined) {
            conditions.push(profile.age <= rule.maxAge);
        }
        if (rule.incomeLimit !== null && rule.incomeLimit !== undefined) {
            conditions.push(profile.annualIncome <= rule.incomeLimit);
        }
        if (rule.occupation) {
            conditions.push((profile.occupation || '').toLowerCase() === rule.occupation.toLowerCase());
        }
        if (rule.category) {
            const profileCat = (profile.category || '').toLowerCase();
            const ruleCat = rule.category.toLowerCase();
            if (ruleCat === 'bpl' || ruleCat === 'ews/lig') {
                conditions.push(profile.annualIncome <= 500000 || profileCat === ruleCat);
            }
            else {
                conditions.push(profileCat === ruleCat);
            }
        }
        if (rule.student !== null && rule.student !== undefined) {
            conditions.push(!!profile.student === rule.student);
        }
        if (rule.farmer !== null && rule.farmer !== undefined) {
            const isFarmer = (profile.occupation || '').toLowerCase() === 'farmer';
            conditions.push(isFarmer === rule.farmer);
        }
        if (rule.disabled !== null && rule.disabled !== undefined) {
            conditions.push(!!profile.disability === rule.disabled);
        }
        if (rule.state) {
            conditions.push((profile.state || '').toLowerCase() === rule.state.toLowerCase());
        }
        return conditions.length === 0 || conditions.every((c) => c);
    }
    getEligibilityReason(rules, profile) {
        const reasons = [];
        if (rules.length === 0) {
            return 'Open to all eligible citizens';
        }
        const rule = rules[0];
        if (rule.minAge !== null && rule.minAge !== undefined) {
            reasons.push(`Age ${profile.age} meets the minimum age requirement of ${rule.minAge}`);
        }
        if (rule.maxAge !== null && rule.maxAge !== undefined) {
            reasons.push(`Age ${profile.age} is within the maximum age of ${rule.maxAge}`);
        }
        if (rule.incomeLimit !== null && rule.incomeLimit !== undefined) {
            reasons.push(`Income (₹${profile.annualIncome?.toLocaleString() || 0}) is within the limit of ₹${rule.incomeLimit.toLocaleString()}`);
        }
        if (rule.occupation) {
            reasons.push(`Occupation (${profile.occupation}) matches`);
        }
        if (rule.category) {
            reasons.push(`Category (${profile.category || 'General'}) qualifies`);
        }
        if (rule.student === true) {
            reasons.push('You are a student');
        }
        if (rule.farmer === true) {
            reasons.push('You are registered as a farmer');
        }
        if (rule.disabled === true) {
            reasons.push('Persons with disability benefit applies');
        }
        if (rule.state) {
            reasons.push(`State matches (${profile.state})`);
        }
        return reasons.length > 0 ? reasons.join('; ') : 'Meets all eligibility criteria';
    }
}
exports.EligibilityService = EligibilityService;
