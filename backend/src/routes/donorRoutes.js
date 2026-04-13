import express from 'express'
import { createDonor, getDonors, searchDonor, searchDonors } from '../controllers/donorController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.route('/').get(getDonors).post(createDonor)
router.get('/search', searchDonors)
router.get('/search/:medicalId', searchDonor)

export default router
