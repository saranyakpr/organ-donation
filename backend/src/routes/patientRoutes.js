import express from 'express'
import { createPatient, getPatients, searchPatient } from '../controllers/patientController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.route('/').get(getPatients).post(createPatient)
router.get('/search/:medicalId', searchPatient)

export default router
