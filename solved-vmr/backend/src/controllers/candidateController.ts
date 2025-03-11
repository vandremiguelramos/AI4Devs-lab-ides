import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { paths } from '../index';

const prisma = new PrismaClient();

// Ensure uploads directory exists before configuring multer
const ensureUploadsDir = () => {
  try {
    if (!fs.existsSync(paths.uploads)) {
      fs.mkdirSync(paths.uploads, { recursive: true });
      console.log('Created uploads directory:', paths.uploads);
    }
    return true;
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    return false;
  }
};

// Ensure directory exists initially
ensureUploadsDir();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    // Ensure directory exists before each upload
    if (!ensureUploadsDir()) {
      cb(new Error('Could not access or create uploads directory'), '');
      return;
    }
    console.log('Using upload directory:', paths.uploads);
    cb(null, paths.uploads);
  },
  filename: function (_req, file, cb) {
    try {
      // Create a safe filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = uniqueSuffix + ext;
      console.log('Generated filename:', filename);
      console.log('Full file path will be:', path.join(paths.uploads, filename));
      cb(null, filename);
    } catch (error) {
      console.error('Error generating filename:', error);
      cb(error as Error, '');
    }
  }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    try {
      // Check file type
      const allowedTypes = ['.pdf', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and DOCX files are allowed'));
      }
    } catch (error) {
      console.error('Error in file filter:', error);
      cb(error as Error);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('cv');

interface PrismaError extends Error {
  code?: string;
}

export const createCandidate = async (req: Request, res: Response) => {
  // Ensure uploads directory exists before processing the request
  if (!ensureUploadsDir()) {
    return res.status(500).json({ error: 'Could not access or create uploads directory' });
  }

  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
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

      // Log received data
      console.log('Processing candidate:', {
        firstName,
        lastName,
        email,
        file: req.file ? {
          filename: req.file.filename,
          path: req.file.path,
          destination: req.file.destination
        } : null
      });

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return res.status(400).json({
          error: 'First name, last name, and email are required'
        });
      }

      // Create the candidate
      const candidate = await prisma.candidate.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber || null,
          address: address || null,
          education: education || null,
          workExperience: workExperience || null,
          cvUrl: req.file ? `/uploads/${req.file.filename}` : null,
        },
      });

      // Log success
      console.log('Created candidate:', {
        id: candidate.id,
        email: candidate.email,
        cvUrl: candidate.cvUrl,
        fullPath: req.file ? path.join(paths.uploads, req.file.filename) : null
      });

      res.status(201).json(candidate);
    } catch (error) {
      console.error('Database error:', error);
      
      // Handle duplicate email
      if ((error as any).code === 'P2002') {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Handle other errors
      res.status(500).json({ error: 'Failed to create candidate' });
    }
  });
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