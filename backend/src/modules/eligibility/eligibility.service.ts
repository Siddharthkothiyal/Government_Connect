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

interface RuleCriteria {
  minAge?: number | null;
  maxAge?: number | null;
  incomeLimit?: number | null;
  occupation?: string | null;
  category?: string | null;
  student?: boolean | null;
  farmer?: boolean | null;
  disabled?: boolean | null;
  state?: string | null;
}

interface EligibleSchemeResult {
  schemeId: number;
  schemeName: string;
  scheme: any;
  eligibilityReason: string;
}

export class EligibilityService {
  async checkEligibility(profile: UserProfile) {
    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      include: { eligibilityRules: true, documents: true },
    });

    const eligibleSchemes = schemes.reduce<EligibleSchemeResult[]>((results, scheme) => {
      const matchingRules = scheme.eligibilityRules.filter((rule: any) =>
        this.isRuleMatching(rule as RuleCriteria, profile)
      );

      if (matchingRules.length > 0 || scheme.eligibilityRules.length === 0) {
        results.push({
          schemeId: scheme.id,
          schemeName: scheme.name,
          scheme: scheme,
          eligibilityReason: this.getEligibilityReason(
            matchingRules.length > 0 ? matchingRules : (scheme.eligibilityRules as any),
            profile
          ),
        });
      }

      return results;
    }, []);

    return eligibleSchemes;
  }

  private isRuleMatching(rule: RuleCriteria, profile: UserProfile): boolean {
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
      conditions.push(
        (profile.occupation || '').toLowerCase() === rule.occupation.toLowerCase()
      );
    }

    if (rule.category) {
      const profileCat = (profile.category || '').toLowerCase();
      const ruleCat = rule.category.toLowerCase();
      if (ruleCat === 'bpl' || ruleCat === 'ews/lig') {
        conditions.push(profile.annualIncome <= 500000 || profileCat === ruleCat);
      } else {
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

  private getEligibilityReason(rules: RuleCriteria[], profile: UserProfile): string {
    const reasons: string[] = [];
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
