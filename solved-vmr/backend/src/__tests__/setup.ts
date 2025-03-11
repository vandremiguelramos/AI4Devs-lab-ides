import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Ensure test uploads directory exists
const testUploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(testUploadsDir)) {
  fs.mkdirSync(testUploadsDir, { recursive: true });
}

// Clean up function
afterAll(async () => {
  await prisma.$disconnect();
}); 