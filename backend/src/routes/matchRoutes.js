import express from 'express'
import { getTransplantMatches } from '../controllers/matchController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/', getTransplantMatches)

export default router
