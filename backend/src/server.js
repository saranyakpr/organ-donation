import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import envConfig from '../envConfig.js'
import connectDatabase from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import donorRoutes from './routes/donorRoutes.js'
import matchRoutes from './routes/matchRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import pledgeRoutes from './routes/pledgeRoutes.js'

const app = express()
const port = envConfig.port || 5000
const allowedOrigins = envConfig.allowedOrigins || ['http://localhost:5173']

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true
  }

  if (allowedOrigins.includes(origin)) {
    return true
  }

  try {
    const { hostname } = new URL(origin)
    return hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
  })
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_req, res) => {
  res.json({ message: 'Server running on root route.' })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/donors', donorRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/pledges', pledgeRoutes)
app.use('/api/matches', matchRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Something went wrong on the server.' })
})

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed', error)
    process.exit(1)
  })
