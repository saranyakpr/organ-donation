import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/useAuth'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await register(form)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the account right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Create admin access'
      subtitle='Set up a coordinator account for your hospital or organization. This account can manage approvals, records, and transplant matching.'
      altLabel='Already have an account?'
      altHref='/login'
      altAction='Sign in'
    >
      <form className='space-y-4' onSubmit={handleSubmit}>
        <label className='block space-y-2 text-sm font-semibold text-stone-700'>
          <span>Full name</span>
          <input
            className='field'
            type='text'
            name='name'
            value={form.name}
            onChange={handleChange}
            placeholder='Dr. Meera Nair'
            required
          />
        </label>
        <label className='block space-y-2 text-sm font-semibold text-stone-700'>
          <span>Organization</span>
          <input
            className='field'
            type='text'
            name='organization'
            value={form.organization}
            onChange={handleChange}
            placeholder='City Transplant Center'
            required
          />
        </label>
        <label className='block space-y-2 text-sm font-semibold text-stone-700'>
          <span>Email address</span>
          <input
            className='field'
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='admin@hospital.org'
            required
          />
        </label>
        <label className='block space-y-2 text-sm font-semibold text-stone-700'>
          <span>Password</span>
          <input
            className='field'
            type='password'
            name='password'
            minLength='6'
            value={form.password}
            onChange={handleChange}
            placeholder='Minimum 6 characters'
            required
          />
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
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}

export default RegisterPage
