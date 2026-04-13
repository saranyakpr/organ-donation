import mongoose from 'mongoose'
import envConfig from '../../envConfig.js'

const connectDatabase = async () => {
  const uri = envConfig.mongoDbUri

  if (!uri) {
    throw new Error('MONGODB_URI is not configured.')
  }

  await mongoose.connect(uri)
  console.log('MongoDB connected')
}

export default connectDatabase
