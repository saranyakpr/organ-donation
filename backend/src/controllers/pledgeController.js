import Donor from '../models/Donor.js'
import Pledge from '../models/Pledge.js'

export const createPledge = async (req, res) => {
  const inPledges = await Pledge.findOne({ medicalId: req.body.medicalId })
  const inDonors = await Donor.findOne({ medicalId: req.body.medicalId })

  if (inPledges || inDonors) {
    return res.status(409).json({ message: 'This medical ID is already registered.' })
  }

  const pledge = await Pledge.create(req.body)
  res.status(201).json({ pledge })
}

export const getPledges = async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {}
  const pledges = await Pledge.find(filter).sort({ createdAt: -1 })
  res.json({ pledges })
}

export const approvePledge = async (req, res) => {
  const pledge = await Pledge.findById(req.params.id)

  if (!pledge) {
    return res.status(404).json({ message: 'Pledge not found.' })
  }

  if (pledge.status === 'approved') {
    return res.status(400).json({ message: 'This pledge has already been approved.' })
  }

  const donorExists = await Donor.findOne({ medicalId: pledge.medicalId })
  if (donorExists) {
    return res.status(409).json({ message: 'A donor with this medical ID already exists.' })
  }

  await Donor.create({
    fullName: pledge.fullName,
    age: pledge.age,
    gender: pledge.gender,
    medicalId: pledge.medicalId,
    bloodType: pledge.bloodType,
    organs: pledge.organs,
    weight: pledge.weight,
    height: pledge.height,
    contactNumber: pledge.contactNumber,
    source: 'pledge',
  })

  pledge.status = 'approved'
  await pledge.save()

  res.json({ message: 'Pledge approved successfully.' })
}
