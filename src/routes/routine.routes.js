import { Router } from "express";
import { getRoutines } from '../controllers/routine.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router()

router.get('/routines', authMiddleware, getRoutines)
export default router
