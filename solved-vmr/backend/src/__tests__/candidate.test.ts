import request from 'supertest';
import { app } from '../index';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { paths } from '../index';

const prisma = new PrismaClient();

describe('Candidate Upload Tests', () => {
  const testFilePath = path.join(__dirname, 'test-cv.pdf');
  
  beforeAll(async () => {
    // Create a test PDF file
    fs.writeFileSync(testFilePath, 'Test CV content');
    
    // Clean up any existing test data
    await prisma.candidate.deleteMany({
      where: {
        email: {
          in: ['test@example.com', 'test2@example.com', 'test3@example.com']
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    await prisma.$disconnect();
  });

  it('should successfully upload a CV file with candidate data', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Test')
      .field('lastName', 'User')
      .field('email', 'test@example.com')
      .field('phoneNumber', '1234567890')
      .field('education', 'Bachelor')
      .field('workExperience', '5 years')
      .attach('cv', testFilePath);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe('Test');
    expect(response.body.lastName).toBe('User');
    expect(response.body.email).toBe('test@example.com');
    expect(response.body.cvUrl).toMatch(/^\/uploads\//);

    // Verify file was uploaded
    const uploadedFilePath = path.join(paths.uploads, path.basename(response.body.cvUrl));
    expect(fs.existsSync(uploadedFilePath)).toBe(true);
  });

  it('should handle missing CV file gracefully', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Test')
      .field('lastName', 'User')
      .field('email', 'test2@example.com');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.cvUrl).toBeNull();
  });

  it('should reject invalid file types', async () => {
    const invalidFilePath = path.join(__dirname, 'test-invalid.txt');
    fs.writeFileSync(invalidFilePath, 'Invalid file content');

    try {
      const response = await request(app)
        .post('/api/candidates')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .field('email', 'test3@example.com')
        .attach('cv', invalidFilePath);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/Only PDF and DOCX files are allowed/);
    } finally {
      if (fs.existsSync(invalidFilePath)) {
        fs.unlinkSync(invalidFilePath);
      }
    }
  });
}); 