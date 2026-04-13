import mongoose from 'mongoose'

const donorSchema = new mongoose.Schema(
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
    source: { type: String, enum: ['manual', 'pledge'], default: 'manual' },
  },
  { timestamps: true }
)

const Donor = mongoose.model('Donor', donorSchema)

export default Donor
