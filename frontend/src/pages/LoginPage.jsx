import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/useAuth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(form)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Welcome back'
      subtitle='Sign in to review pledges, manage donor and patient registrations, and view transplant matches.'
      altLabel='Need an admin account?'
      altHref='/register'
      altAction='Create one'
    >
      <form className='space-y-4' onSubmit={handleSubmit}>
        <label className='block space-y-2 text-sm font-semibold text-stone-700'>
          <span>Email address</span>
          <input
            className='field'
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='coordinator@hospital.org'
            required
          />
        </label>
        <label className='block space-y-2 text-sm font-semibold text-stone-700'>
          <span>Password</span>
          <div className='relative'>
            <input
              className='field pr-12'
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Enter your password'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword((current) => !current)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-stone-800'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
            </button>
          </div>
        </label>
        {error ? (
          <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
            {error}
          </div>
        ) : null}
        <button
          type='submit'
          disabled={submitting}
          className='w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60'
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}

export default LoginPage
