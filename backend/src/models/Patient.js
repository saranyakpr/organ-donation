import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    gender: { type: String, required: true, trim: true },
    medicalId: { type: String, required: true, unique: true, trim: true },
    bloodType: { type: String, required: true, trim: true },
    organs: {
      type: [String],
      required: true,
      validate: [(value) => value.length > 0, 'At least one organ is required.'],
    },
    weight: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    contactNumber: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

const Patient = mongoose.model('Patient', patientSchema)

export default Patient
