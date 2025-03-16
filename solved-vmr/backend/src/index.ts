import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import candidateRoutes from './routes/candidateRoutes';

const app = express();
const PORT = process.env.PORT || 3010;

// Define paths
export const paths = {
  uploads: path.join(__dirname, '..', 'uploads')
};

// Ensure uploads directory exists
if (!fs.existsSync(paths.uploads)) {
  fs.mkdirSync(paths.uploads, { recursive: true });
  console.log('Created uploads directory:', paths.uploads);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(paths.uploads));

// Routes
app.use('/api/candidates', candidateRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Uploads directory:', paths.uploads);
});
