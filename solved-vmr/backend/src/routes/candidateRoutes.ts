import { Router } from 'express';
import { createCandidate, getAllCandidates, getCandidate, uploadMiddleware } from '../controllers/candidateController';

const router = Router();

router.get('/', getAllCandidates);
router.get('/:id', getCandidate);
router.post('/', uploadMiddleware, createCandidate);

export default router;