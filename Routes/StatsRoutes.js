import express from 'express';
import { getDashboardStats } from '../Controller/StatController.js';

const router = express.Router();

router.get('/', getDashboardStats);

export default router;