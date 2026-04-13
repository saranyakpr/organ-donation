import Patient from '../models/Patient.js'
import { buildPaginationMeta, getPagination } from '../utils/pagination.js'

export const createPatient = async (req, res) => {
  const exists = await Patient.findOne({ medicalId: req.body.medicalId })
  if (exists) {
    return res.status(409).json({ message: 'A patient with this medical ID already exists.' })
  }

  const patient = await Patient.create(req.body)
  res.status(201).json({ patient })
}

export const getPatients = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query)
  const [patients, totalItems] = await Promise.all([
    Patient.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Patient.countDocuments(),
  ])

  res.json({
    patients,
    pagination: buildPaginationMeta(totalItems, page, limit),
  })
}

export const searchPatient = async (req, res) => {
  const patient = await Patient.findOne({ medicalId: req.params.medicalId.trim() })

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found.' })
  }

  res.json({ patient })
}

export const searchPatients = async (req, res) => {
  const medicalId = req.query.medicalId?.trim()
  const organ = req.query.organ?.trim()

  if (!medicalId && !organ) {
    return res.status(400).json({ message: 'Enter a patient medical ID or organ to search.' })
  }

  if (medicalId) {
    const patient = await Patient.findOne({ medicalId })

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    return res.json({ patient, patients: [patient], mode: 'medicalId' })
  }

  const patients = await Patient.find({ organs: organ }).sort({ createdAt: -1 })

  if (patients.length === 0) {
    return res.status(404).json({ message: `No patients found for organ "${organ}".` })
  }

  return res.json({ patients, mode: 'organ' })
}
