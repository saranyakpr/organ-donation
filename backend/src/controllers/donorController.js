import Donor from '../models/Donor.js'
import { buildPaginationMeta, getPagination } from '../utils/pagination.js'

export const createDonor = async (req, res) => {
  const exists = await Donor.findOne({ medicalId: req.body.medicalId })
  if (exists) {
    return res.status(409).json({ message: 'A donor with this medical ID already exists.' })
  }

  const donor = await Donor.create({ ...req.body, source: 'manual' })
  res.status(201).json({ donor })
}

export const getDonors = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query)
  const [donors, totalItems] = await Promise.all([
    Donor.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Donor.countDocuments(),
  ])

  res.json({
    donors,
    pagination: buildPaginationMeta(totalItems, page, limit),
  })
}

export const searchDonor = async (req, res) => {
  const donor = await Donor.findOne({ medicalId: req.params.medicalId.trim() })

  if (!donor) {
    return res.status(404).json({ message: 'Donor not found.' })
  }

  res.json({ donor })
}

export const searchDonors = async (req, res) => {
  const medicalId = req.query.medicalId?.trim()
  const organ = req.query.organ?.trim()

  if (!medicalId && !organ) {
    return res.status(400).json({ message: 'Enter a donor medical ID or organ to search.' })
  }

  if (medicalId) {
    const donor = await Donor.findOne({ medicalId })

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' })
    }

    return res.json({ donor, donors: [donor], mode: 'medicalId' })
  }

  const donors = await Donor.find({ organs: organ }).sort({ createdAt: -1 })

  if (donors.length === 0) {
    return res.status(404).json({ message: `No donors found for organ "${organ}".` })
  }

  return res.json({ donors, mode: 'organ' })
}
