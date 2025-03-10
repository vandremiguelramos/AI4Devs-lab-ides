import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('cv');

interface PrismaError extends Error {
  code?: string;
}

export const createCandidate = async (req: Request, res: Response) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).json({ error: err.message });
      }

      try {
        const {
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          education,
          workExperience,
        } = req.body;

        console.log('Received data:', {
          firstName,
          lastName,
          email,
          file: req.file,
          body: req.body
        });

        if (!firstName || !lastName || !email) {
          return res.status(400).json({
            error: 'First name, last name, and email are required'
          });
        }

        const cvUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const candidate = await prisma.candidate.create({
          data: {
            firstName,
            lastName,
            email,
            phoneNumber: phoneNumber || null,
            address: address || null,
            education: education || null,
            workExperience: workExperience || null,
            cvUrl,
          },
        });

        res.status(201).json(candidate);
      } catch (error) {
        console.error('Database error:', error);
        if ((error as PrismaError).code === 'P2002') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        throw error;
      }
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
};

export const getAllCandidates = async (_req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
}; 