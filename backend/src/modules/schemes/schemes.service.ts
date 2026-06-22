import prisma from '../../config/prisma';

export class SchemesService {
  async getAllSchemes(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    state?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (state) {
      where.state = state;
    }

    const [schemes, total] = await Promise.all([
      prisma.scheme.findMany({
        where,
        skip,
        take: limit,
        include: { eligibilityRules: true, documents: true },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.scheme.count({ where }),
    ]);

    return {
      schemes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getSchemeById(id: number) {
    return prisma.scheme.findUniqueOrThrow({
      where: { id },
      include: { eligibilityRules: true, documents: true },
    });
  }

  async getSchemesByCategory(category: string) {
    return prisma.scheme.findMany({
      where: { category, isActive: true },
      include: { eligibilityRules: true, documents: true },
    });
  }
}
