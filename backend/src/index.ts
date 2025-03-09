import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';
import path from 'path';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/candidates', candidateRoutes);

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    body: req.body,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: err.message || 'Something broke!',
    path: req.path,
    method: req.method
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
