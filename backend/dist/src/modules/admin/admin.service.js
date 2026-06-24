"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class AdminService {
    async createScheme(data) {
        const { documents, eligibilityRules, ...schemeData } = data;
        return prisma_1.default.scheme.create({
            data: {
                ...schemeData,
                documents: documents
                    ? {
                        create: documents.map((name) => ({ documentName: name })),
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
    async updateScheme(id, data) {
        const { documents, eligibilityRules, ...schemeData } = data;
        return prisma_1.default.scheme.update({
            where: { id },
            data: {
                ...schemeData,
                documents: documents
                    ? {
                        deleteMany: {},
                        create: documents.map((name) => ({ documentName: name })),
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
    async deleteScheme(id) {
        return prisma_1.default.scheme.delete({ where: { id } });
    }
    async createEligibilityRule(data) {
        return prisma_1.default.eligibilityRule.create({ data });
    }
    async updateEligibilityRule(id, data) {
        return prisma_1.default.eligibilityRule.update({ where: { id }, data });
    }
    async deleteEligibilityRule(id) {
        return prisma_1.default.eligibilityRule.delete({ where: { id } });
    }
}
exports.AdminService = AdminService;
