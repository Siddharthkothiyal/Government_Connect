import prisma from '../../config/prisma';

export class AdminService {
  async createScheme(data: any) {
    const { documents, eligibilityRules, ...schemeData } = data;

    return prisma.scheme.create({
      data: {
        ...schemeData,
        documents: documents
          ? {
              create: documents.map((name: string) => ({ documentName: name })),
            }
          : undefined,
        eligibilityRules: eligibilityRules
          ? {
              create: eligibilityRules,
            }
          : undefined,
      },
      include: { documents: true, eligibilityRules: true },
    });
  }

  async updateScheme(id: number, data: any) {
    const { documents, eligibilityRules, ...schemeData } = data;

    return prisma.scheme.update({
      where: { id },
      data: {
        ...schemeData,
        documents: documents
          ? {
              deleteMany: {},
              create: documents.map((name: string) => ({ documentName: name })),
            }
          : undefined,
        eligibilityRules: eligibilityRules
          ? {
              deleteMany: {},
              create: eligibilityRules,
            }
          : undefined,
      },
      include: { documents: true, eligibilityRules: true },
    });
  }

  async deleteScheme(id: number) {
    return prisma.scheme.delete({ where: { id } });
  }

  async createEligibilityRule(data: any) {
    return prisma.eligibilityRule.create({ data });
  }

  async updateEligibilityRule(id: number, data: any) {
    return prisma.eligibilityRule.update({ where: { id }, data });
  }

  async deleteEligibilityRule(id: number) {
    return prisma.eligibilityRule.delete({ where: { id } });
  }
}
