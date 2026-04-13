import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  organization: user.organization,
})

export const register = async (req, res) => {
  const { name, email, password, organization } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const user = await User.create({ name, email, password, organization })

  res.status(201).json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  res.json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  })
}

export const getCurrentUser = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) })
}
