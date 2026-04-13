import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import connectDatabase from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import donorRoutes from './routes/donorRoutes.js'
import matchRoutes from './routes/matchRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import pledgeRoutes from './routes/pledgeRoutes.js'

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
)
app.use(express.json())
app.use(morgan('dev'))

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
