"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const prisma_1 = __importDefault(require("../../config/prisma"));
class AuthService {
    async register(name, email, password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const token = this.generateToken(user.id, user.email, user.role);
        return { user, token };
    }
    async login(email, password) {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateToken(user.id, user.email, user.role);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    generateToken(id, email, role) {
        return jsonwebtoken_1.default.sign({ id, email, role }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
