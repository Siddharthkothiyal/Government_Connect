"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityRuleCreateSchema = exports.schemeUpdateSchema = exports.schemeCreateSchema = exports.chatSchema = exports.explainSchema = exports.eligibilitySchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.eligibilitySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    age: zod_1.z.coerce.number().min(1),
    gender: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    annualIncome: zod_1.z.coerce.number().min(0),
    category: zod_1.z.string().optional(),
    disability: zod_1.z.coerce.boolean().optional(),
    student: zod_1.z.coerce.boolean().optional(),
});
exports.explainSchema = zod_1.z.object({
    schemeId: zod_1.z.coerce.number(),
    userProfile: exports.eligibilitySchema,
});
exports.chatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1),
});
exports.schemeCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    benefits: zod_1.z.string().min(1),
    applicationProcess: zod_1.z.string().min(1),
    officialUrl: zod_1.z.string().url().optional(),
    category: zod_1.z.string().min(1),
    state: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().default(true),
    documents: zod_1.z.array(zod_1.z.string()).optional(),
    eligibilityRules: zod_1.z.array(zod_1.z.object({
        minAge: zod_1.z.coerce.number().optional(),
        maxAge: zod_1.z.coerce.number().optional(),
        incomeLimit: zod_1.z.coerce.number().optional(),
        occupation: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        student: zod_1.z.coerce.boolean().optional(),
        farmer: zod_1.z.coerce.boolean().optional(),
        disabled: zod_1.z.coerce.boolean().optional(),
        state: zod_1.z.string().optional(),
    })).optional(),
});
exports.schemeUpdateSchema = exports.schemeCreateSchema.partial();
exports.eligibilityRuleCreateSchema = zod_1.z.object({
    schemeId: zod_1.z.coerce.number(),
    minAge: zod_1.z.coerce.number().optional(),
    maxAge: zod_1.z.coerce.number().optional(),
    incomeLimit: zod_1.z.coerce.number().optional(),
    occupation: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    student: zod_1.z.coerce.boolean().optional(),
    farmer: zod_1.z.coerce.boolean().optional(),
    disabled: zod_1.z.coerce.boolean().optional(),
    state: zod_1.z.string().optional(),
});
