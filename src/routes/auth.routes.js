import { Router } from "express";
import { isLogged, login } from "../controllers/auth.controller.js";

const router = Router()

router.post('/login', login);
router.post('/is-logged', isLogged);

export default router
