import { Router } from "express";
import { getClients, createClient, deleteClient, updateClient, getClient, statusClient, getMembershipClient, createClientGoal, getClientGoals, createClientRoutine, getClientRoutines, createPhotoClient, getClientPhotos, createClientSizes, getClientSizes } from '../controllers/clients.controller.js';
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

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/clients', authMiddleware, getClients)
router.get('/clients/:id', authMiddleware, getClient)
router.get('/clients/photos/:id', authMiddleware, getClientPhotos)
router.get('/clients/membership/:id', authMiddleware, getMembershipClient)
router.post('/clients', upload.single('file'), createClient)
router.post('/clients/upload-photo', upload.single('file'), createPhotoClient)
router.patch('/clients/:id', authMiddleware, upload.single('file'), updateClient)
router.delete('/clients/:id', authMiddleware, deleteClient)
router.patch('/clients/activate/:id', authMiddleware, statusClient)
router.post('/clients/create-goal', authMiddleware, createClientGoal)
router.get('/clients/goals/:id', authMiddleware, getClientGoals)
router.post('/clients/create-routine', authMiddleware, createClientRoutine)
router.get('/clients/routines/:id', authMiddleware, getClientRoutines)
router.post('/clients/create-size', authMiddleware, createClientSizes)
router.get('/clients/sizes/:id', authMiddleware, getClientSizes)

export default router