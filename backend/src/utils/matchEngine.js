const compatibilityMap = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
}

const isCompatible = (donorBloodType, recipientBloodType) =>
  compatibilityMap[recipientBloodType]?.includes(donorBloodType)

export const getMatches = (donors, patients) => {
  const donorPool = donors.map((donor) => ({
    ...donor.toObject(),
    availableOrgans: [...donor.organs],
  }))

  const matches = []

  patients.forEach((patient) => {
    patient.organs.forEach((requiredOrgan) => {
      const donor = donorPool.find(
        (candidate) =>
          candidate.availableOrgans.includes(requiredOrgan) &&
          isCompatible(candidate.bloodType, patient.bloodType)
      )

      if (!donor) {
        return
      }

      donor.availableOrgans = donor.availableOrgans.filter((organ) => organ !== requiredOrgan)
      matches.push({
        patientName: patient.fullName,
        patientMedicalId: patient.medicalId,
        requiredOrgan,
        recipientBloodType: patient.bloodType,
        donorName: donor.fullName,
        donorMedicalId: donor.medicalId,
        donorBloodType: donor.bloodType,
      })
    })
  })

  return matches
}
