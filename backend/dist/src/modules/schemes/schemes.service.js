"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemesService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class SchemesService {
    async getAllSchemes(page = 1, limit = 10, search, category, state, sortBy = 'createdAt', sortOrder = 'desc') {
        const skip = (page - 1) * limit;
        const where = { isActive: true };
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
            prisma_1.default.scheme.findMany({
                where,
                skip,
                take: limit,
                include: { eligibilityRules: true, documents: true },
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma_1.default.scheme.count({ where }),
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
    async getSchemeById(id) {
        try {
            return await prisma_1.default.scheme.findUniqueOrThrow({
                where: { id },
                include: { eligibilityRules: true, documents: true },
            });
        }
        catch {
            return null;
        }
    }
    async getSchemeByNameOrId(nameOrId) {
        try {
            const byName = await prisma_1.default.scheme.findFirst({
                where: {
                    OR: [
                        { name: { contains: nameOrId, mode: 'insensitive' } },
                        { name: { equals: nameOrId, mode: 'insensitive' } },
                    ],
                    isActive: true,
                },
                include: { eligibilityRules: true, documents: true },
            });
            if (byName)
                return byName;
            const id = Number(nameOrId);
            if (!isNaN(id) && id > 0) {
                return await this.getSchemeById(id);
            }
            return null;
        }
        catch {
            return null;
        }
    }
    async getSchemesByCategory(category) {
        return prisma_1.default.scheme.findMany({
            where: { category, isActive: true },
            include: { eligibilityRules: true, documents: true },
        });
    }
}
exports.SchemesService = SchemesService;
