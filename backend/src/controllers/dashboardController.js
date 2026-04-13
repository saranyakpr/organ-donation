import Donor from '../models/Donor.js'
import Patient from '../models/Patient.js'
import Pledge from '../models/Pledge.js'
import { getMatches } from '../utils/matchEngine.js'

export const getOverview = async (_req, res) => {
  const [donorCount, patientCount, pendingPledges, donors, patients] = await Promise.all([
    Donor.countDocuments(),
    Patient.countDocuments(),
    Pledge.countDocuments({ status: 'pending' }),
    Donor.find(),
    Patient.find(),
  ])

  res.json({
    donorCount,
    patientCount,
    pendingPledges,
    matchCount: getMatches(donors, patients).length,
  })
}
