import Donor from '../models/Donor.js'
import Patient from '../models/Patient.js'
import { getMatches } from '../utils/matchEngine.js'
import { buildPaginationMeta, getPagination } from '../utils/pagination.js'

export const getTransplantMatches = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query)
  const [donors, patients] = await Promise.all([Donor.find(), Patient.find()])
  const allMatches = getMatches(donors, patients)

  res.json({
    matches: allMatches.slice(skip, skip + limit),
    pagination: buildPaginationMeta(allMatches.length, page, limit),
  })
}
