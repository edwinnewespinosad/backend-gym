import { Router } from "express";
import { getMemberships, createMembership, deleteMembership, updateMembership, getMembership, statusMembership } from '../controllers/membership.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router()

router.get('/memberships', authMiddleware, getMemberships)
router.get('/memberships/:id', authMiddleware, getMembership)
router.post('/memberships', authMiddleware, createMembership)
router.patch('/memberships/:id', authMiddleware, updateMembership)
router.delete('/memberships/:id', authMiddleware, deleteMembership)
router.patch('/memberships/activate/:id', authMiddleware, statusMembership)

export default router