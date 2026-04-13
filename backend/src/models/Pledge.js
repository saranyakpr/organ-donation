import mongoose from 'mongoose'

const pledgeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18 },
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
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  },
  { timestamps: true }
)

const Pledge = mongoose.model('Pledge', pledgeSchema)

export default Pledge
