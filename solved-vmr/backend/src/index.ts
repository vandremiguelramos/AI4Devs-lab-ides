import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
export const app = express();
export default prisma;

const port = process.env.PORT ? parseInt(process.env.PORT) : 3010;

// Define absolute paths
const PROJECT_ROOT = path.join(__dirname, '../..');
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads');

console.log('Project root:', PROJECT_ROOT);
console.log('Uploads directory:', UPLOADS_DIR);

// Ensure uploads directory exists
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Created uploads directory:', UPLOADS_DIR);
  }
} catch (error) {
  console.error('Error creating uploads directory:', error);
  process.exit(1); // Exit if we can't create the uploads directory
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Export paths for use in other modules
export const paths = {
  root: PROJECT_ROOT,
  uploads: UPLOADS_DIR
};

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

// Only start the server if this file is being run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Project root:', PROJECT_ROOT);
    console.log('Uploads directory:', UPLOADS_DIR);
  });
}
