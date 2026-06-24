"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class UsersController {
    getNumericParam(value) {
        return Number(Array.isArray(value) ? value[0] : value);
    }
    async saveScheme(req, res) {
        const schemeId = this.getNumericParam(req.params.schemeId);
        const saved = await prisma_1.default.savedScheme.create({
            data: {
                userId: req.user.id,
                schemeId,
            },
            include: { scheme: true },
        });
        res.json({ success: true, data: saved });
    }
    async unsaveScheme(req, res) {
        const schemeId = this.getNumericParam(req.params.schemeId);
        await prisma_1.default.savedScheme.delete({
            where: {
                userId_schemeId: {
                    userId: req.user.id,
                    schemeId,
                },
            },
        });
        res.json({ success: true, message: 'Scheme removed from saved' });
    }
    async getSavedSchemes(req, res) {
        const saved = await prisma_1.default.savedScheme.findMany({
            where: { userId: req.user.id },
            include: { scheme: { include: { documents: true, eligibilityRules: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: saved });
    }
    async getSearchHistory(req, res) {
        const history = await prisma_1.default.userSearchHistory.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: history });
    }
}
exports.UsersController = UsersController;
