import { Router } from "express";
import { getUsers, createUser, deleteUser, updateUser, getUser, statusUser } from '../controllers/users.controller.js';
import multer from 'multer';
import authMiddleware from '../middlewares/auth.middleware.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`)
    }
});

const upload = multer({ storage })

const router = Router()

router.get('/users', authMiddleware, getUsers)
router.get('/users/:id', authMiddleware, getUser)
router.post('/users', authMiddleware, upload.single('file'), createUser)
router.patch('/users/:id', authMiddleware, upload.single('file'), updateUser)
router.delete('/users/:id', authMiddleware, deleteUser)
router.patch('/users/activate/:id', authMiddleware, statusUser)

export default router