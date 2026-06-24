"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = __importDefault(require("zod"));
dotenv_1.default.config();
const envSchema = zod_1.default.object({
    DATABASE_URL: zod_1.default.string().url(),
    JWT_SECRET: zod_1.default.string().min(32),
    GEMINI_API_KEY: zod_1.default.string(),
    PORT: zod_1.default.coerce.number().default(5000),
    NODE_ENV: zod_1.default.enum(['development', 'production', 'test']).default('development'),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
