import { Router } from "express";
import { statusGoal } from '../controllers/goal.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router()

router.post('/goals/status/:id', authMiddleware, statusGoal)

export default router