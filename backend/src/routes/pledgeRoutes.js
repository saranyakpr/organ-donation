import express from 'express'
import { approvePledge, createPledge, getPledges } from '../controllers/pledgeController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createPledge)
router.get('/', protect, getPledges)
router.post('/:id/approve', protect, approvePledge)

export default router
