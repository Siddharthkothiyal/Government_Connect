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
            if (matchingRules.length > 0) {
                results.push({
                    schemeId: scheme.id,
                    schemeName: scheme.name,
                    scheme: {
                        id: scheme.id,
                        name: scheme.name,
                        eligibilityRules: scheme.eligibilityRules,
                    },
                    eligibilityReason: this.getEligibilityReason(matchingRules, profile),
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
            conditions.push(profile.occupation?.toLowerCase() === rule.occupation.toLowerCase());
        }
        if (rule.category) {
            conditions.push(profile.category?.toLowerCase() === rule.category.toLowerCase());
        }
        if (rule.student !== null && rule.student !== undefined) {
            conditions.push(profile.student === rule.student);
        }
        if (rule.farmer !== null && rule.farmer !== undefined) {
            conditions.push((profile.occupation?.toLowerCase() === 'farmer') === rule.farmer);
        }
        if (rule.disabled !== null && rule.disabled !== undefined) {
            conditions.push(profile.disability === rule.disabled);
        }
        if (rule.state) {
            conditions.push(profile.state?.toLowerCase() === rule.state.toLowerCase());
        }
        return conditions.length === 0 || conditions.every((c) => c);
    }
    getEligibilityReason(rules, profile) {
        const reasons = [];
        const rule = rules[0];
        if (rule.minAge || rule.maxAge) {
            reasons.push(`Age ${profile.age} meets the requirement`);
        }
        if (rule.incomeLimit) {
            reasons.push(`Income within limit`);
        }
        if (rule.occupation) {
            reasons.push(`Occupation matches`);
        }
        if (rule.category) {
            reasons.push(`Category matches`);
        }
        if (rule.state) {
            reasons.push(`State matches`);
        }
        return reasons.length > 0 ? reasons.join(', ') : 'Meets all eligibility criteria';
    }
}
exports.EligibilityService = EligibilityService;
