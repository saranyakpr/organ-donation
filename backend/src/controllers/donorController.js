import Donor from '../models/Donor.js'

export const createDonor = async (req, res) => {
  const exists = await Donor.findOne({ medicalId: req.body.medicalId })
  if (exists) {
    return res.status(409).json({ message: 'A donor with this medical ID already exists.' })
  }

  const donor = await Donor.create({ ...req.body, source: 'manual' })
  res.status(201).json({ donor })
}

export const getDonors = async (_req, res) => {
  const donors = await Donor.find().sort({ createdAt: -1 })
  res.json({ donors })
}

export const searchDonor = async (req, res) => {
  const donor = await Donor.findOne({ medicalId: req.params.medicalId.trim() })

  if (!donor) {
    return res.status(404).json({ message: 'Donor not found.' })
  }

  res.json({ donor })
}
