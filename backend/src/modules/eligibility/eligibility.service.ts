import prisma from '../../config/prisma';

interface UserProfile {
  age: number;
  state?: string;
  occupation?: string;
  annualIncome: number;
  category?: string;
  disability?: boolean;
  student?: boolean;
}

export class EligibilityService {
  async checkEligibility(profile: UserProfile) {
    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      include: { eligibilityRules: true, documents: true },
    });

    const eligibleSchemes = schemes
      .map((scheme) => {
        const matchingRules = scheme.eligibilityRules.filter((rule) =>
          this.isRuleMatching(rule, profile)
        );

        if (matchingRules.length > 0) {
          return {
            schemeId: scheme.id,
            schemeName: scheme.name,
            scheme,
            eligibilityReason: this.getEligibilityReason(matchingRules, profile),
          };
        }

        return null;
      })
      .filter((s) => s !== null);

    return eligibleSchemes;
  }

  private isRuleMatching(rule: any, profile: UserProfile): boolean {
    const conditions: boolean[] = [];

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

  private getEligibilityReason(rules: any[], profile: UserProfile): string {
    const reasons: string[] = [];
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
