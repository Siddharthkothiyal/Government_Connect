"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const validation_1 = require("../../utils/validation");
const prisma_1 = __importDefault(require("../../config/prisma"));
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        const data = validation_1.registerSchema.parse(req.body);
        const result = await authService.register(data.name, data.email, data.password);
        res.json({ success: true, data: result });
    }
    async login(req, res) {
        const data = validation_1.loginSchema.parse(req.body);
        const result = await authService.login(data.email, data.password);
        res.json({ success: true, data: result });
    }
    async logout(req, res) {
        res.json({ success: true, message: 'Logged out successfully' });
    }
    async getProfile(req, res) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        res.json({ success: true, data: user });
    }
}
exports.AuthController = AuthController;
