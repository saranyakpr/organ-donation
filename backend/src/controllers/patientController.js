import Patient from '../models/Patient.js'

export const createPatient = async (req, res) => {
  const exists = await Patient.findOne({ medicalId: req.body.medicalId })
  if (exists) {
    return res.status(409).json({ message: 'A patient with this medical ID already exists.' })
  }

  const patient = await Patient.create(req.body)
  res.status(201).json({ patient })
}

export const getPatients = async (_req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 })
  res.json({ patients })
}

export const searchPatient = async (req, res) => {
  const patient = await Patient.findOne({ medicalId: req.params.medicalId.trim() })

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found.' })
  }

  res.json({ patient })
}
