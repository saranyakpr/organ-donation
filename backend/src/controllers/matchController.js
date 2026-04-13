import Donor from '../models/Donor.js'
import Patient from '../models/Patient.js'
import { getMatches } from '../utils/matchEngine.js'

export const getTransplantMatches = async (_req, res) => {
  const [donors, patients] = await Promise.all([Donor.find(), Patient.find()])
  res.json({ matches: getMatches(donors, patients) })
}
