import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const eligibilitySchema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().min(1),
  gender: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  occupation: z.string().optional(),
  annualIncome: z.coerce.number().min(0),
  category: z.string().optional(),
  disability: z.coerce.boolean().optional(),
  student: z.coerce.boolean().optional(),
});

export const explainSchema = z.object({
  schemeId: z.coerce.number(),
  userProfile: eligibilitySchema,
});

export const chatSchema = z.object({
  message: z.string().min(1),
});

export const schemeCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  benefits: z.string().min(1),
  applicationProcess: z.string().min(1),
  officialUrl: z.string().url().optional(),
  category: z.string().min(1),
  state: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
  documents: z.array(z.string()).optional(),
  eligibilityRules: z.array(z.object({
    minAge: z.coerce.number().optional(),
    maxAge: z.coerce.number().optional(),
    incomeLimit: z.coerce.number().optional(),
    occupation: z.string().optional(),
    category: z.string().optional(),
    student: z.coerce.boolean().optional(),
    farmer: z.coerce.boolean().optional(),
    disabled: z.coerce.boolean().optional(),
    state: z.string().optional(),
  })).optional(),
});

export const schemeUpdateSchema = schemeCreateSchema.partial();

export const eligibilityRuleCreateSchema = z.object({
  schemeId: z.coerce.number(),
  minAge: z.coerce.number().optional(),
  maxAge: z.coerce.number().optional(),
  incomeLimit: z.coerce.number().optional(),
  occupation: z.string().optional(),
  category: z.string().optional(),
  student: z.coerce.boolean().optional(),
  farmer: z.coerce.boolean().optional(),
  disabled: z.coerce.boolean().optional(),
  state: z.string().optional(),
});
