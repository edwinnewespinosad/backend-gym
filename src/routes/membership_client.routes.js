import { Router } from "express";
import { addMembershipClient } from '../controllers/membership_client.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router()

router.post('/memberships/add-client', authMiddleware, addMembershipClient)

export default router