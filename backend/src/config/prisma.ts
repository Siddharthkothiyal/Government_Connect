import { PrismaClient } from '../generated/prisma';
import { env } from './env';

const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
});

export default prisma;
