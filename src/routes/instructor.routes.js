import { Router } from "express";
import { getInstructors, createInstructor, deleteInstructor, updateInstructor, getInstructor, statusInstructor } from '../controllers/instructor.controller.js';
import multer from 'multer';
import authMiddleware from '../middlewares/auth.middleware.js';

const storageM = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'src/public/uploads')
    // },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`)
    }
});

// const upload = multer({ storage: storageM })
const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/instructors', authMiddleware, getInstructors)
router.get('/instructors/:id', authMiddleware, getInstructor)
router.post('/instructors', authMiddleware, upload.single('file'), createInstructor)
router.patch('/instructors/:id', authMiddleware, upload.single('file'), updateInstructor)
router.delete('/instructors/:id', authMiddleware, deleteInstructor)
router.patch('/instructors/activate/:id', authMiddleware, statusInstructor)

export default router