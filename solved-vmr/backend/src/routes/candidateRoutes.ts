import express from 'express';
import { createCandidate, getAllCandidates } from '../controllers/candidateController';

const router = express.Router();

router.get('/', getAllCandidates);
router.post('/', createCandidate);

export default router;