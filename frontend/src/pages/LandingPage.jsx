import { createElement, useMemo, useState } from 'react'
import {
  ArrowRight,
  CircleCheckBig,
  HeartHandshake,
  HeartPulse,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/client'

const stats = [
  { label: 'People waiting for transplants', value: '100,000+' },
  { label: 'Daily waitlist deaths', value: '17' },
  { label: 'Lives impacted by one donor', value: '75+' },
]

const features = [
  {
    title: 'Coordinator dashboard',
    description: 'Manage donors, patients, pledges, quick searches, and transplant matches from one responsive workspace.',
    icon: LayoutDashboard,
  },
  {
    title: 'Verified donor pipeline',
    description: 'Capture public donor pledges and let authorized teams verify them before adding them to the active donor registry.',
    icon: ShieldCheck,
  },
  {
    title: 'Matching support',
    description: 'Surface likely transplant matches using organ and blood compatibility to reduce manual triage.',
    icon: HeartHandshake,
  },
]

const faqs = [
  {
    question: 'Who can be a donor?',
    answer:
      'People of all ages and medical histories can consider organ donation. Medical suitability is determined at the time of donation.',
  },
  {
    question: 'Does registering as a donor change patient care?',
    answer:
      'No. Care teams focus on saving the patient first. Donation is only considered after all lifesaving efforts are exhausted and legal criteria are met.',
  },
  {
    question: 'Is there a cost to be an organ donor?',
    answer:
      'No. Donation costs are not charged to the donor family or estate. Standard medical and funeral expenses remain separate.',
  },
]

const defaultPledge = {
  fullName: '',
  age: '',
  gender: 'Female',
  medicalId: '',
  bloodType: 'A+',
  organs: [],
  weight: '',
  height: '',
  contactNumber: '',
}

const organOptions = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']

const LandingPage = () => {
  const [pledge, setPledge] = useState(defaultPledge)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const selectedOrgans = useMemo(() => pledge.organs.join(', '), [pledge.organs])

  const handleField = (event) => {
    const { name, value } = event.target
    setPledge((current) => ({ ...current, [name]: value }))
  }

  const toggleOrgan = (organ) => {
    setPledge((current) => ({
      ...current,
      organs: current.organs.includes(organ)
        ? current.organs.filter((item) => item !== organ)
        : [...current.organs, organ],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await api.post('/pledges', pledge)
      setStatus({
        type: 'success',
        message: 'Pledge submitted successfully. A coordinator can now review and verify it.',
      })
      setPledge(defaultPledge)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to submit your pledge right now.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='px-4 py-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <header className='glass-panel rounded-[2rem] px-5 py-4 sm:px-7'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-lg'>
                <HeartPulse className='h-6 w-6' />
              </div>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.28em] text-stone-500'>Organ Donation Platform</p>
                <h1 className='text-lg font-extrabold text-stone-950'>Trusted coordination for donors and recipients</h1>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <a href='#pledge' className='rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-400'>
                Pledge now
              </a>
              <Link
                to='/login'
                className='rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'
              >
                Admin login
              </Link>
            </div>
          </div>
        </header>

        <main className='space-y-6 py-6'>
          <section className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
            <div className='mesh-card relative overflow-hidden rounded-[2.5rem] px-6 py-8 text-white shadow-[0_24px_80px_rgba(93,35,23,0.28)] sm:px-8 lg:px-10'>
              <div className='absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-8 rounded-full bg-white/10 blur-3xl' />
              <div className='absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-emerald-300/15 blur-3xl' />
              <div className='relative max-w-2xl'>
                <p className='badge mb-5 bg-white/12 text-white'>
                  <CircleCheckBig className='h-4 w-4 text-emerald-300' />
                  Inspired by the reference dashboard and rebuilt as a modern MERN platform
                </p>
                <h2 className='section-title text-4xl font-extrabold leading-tight sm:text-5xl'>
                  Pledge to become a donor. Help move one more family closer to hope.
                </h2>
                <p className='mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg'>
                  This platform brings together public donor pledges and secure coordinator workflows
                  for donor registration, patient registration, search, pledge verification, and
                  transplant matching.
                </p>
                <div className='mt-8 flex flex-wrap gap-3'>
                  <a
                    href='#pledge'
                    className='inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--brand)] transition hover:translate-x-1'
                  >
                    Make a pledge
                    <ArrowRight className='h-4 w-4' />
                  </a>
                  <Link
                    to='/register'
                    className='inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10'
                  >
                    Create admin account
                  </Link>
                </div>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-1'>
              {stats.map((item) => (
                <div key={item.label} className='glass-panel rounded-[2rem] p-6'>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-stone-500'>{item.label}</p>
                  <p className='mt-4 text-4xl font-extrabold text-[var(--brand-deep)]'>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className='grid gap-6 lg:grid-cols-3'>
            {features.map(({ title, description, icon }) => (
              <article key={title} className='glass-panel rounded-[2rem] p-6'>
                <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]'>
                  {createElement(icon, { className: 'h-6 w-6' })}
                </div>
                <h3 className='text-xl font-extrabold text-stone-950'>{title}</h3>
                <p className='mt-3 text-sm leading-6 text-stone-600'>{description}</p>
              </article>
            ))}
          </section>

          <section id='pledge' className='grid gap-6 lg:grid-cols-[0.8fr_1.2fr]'>
            <div className='glass-panel rounded-[2rem] p-6 sm:p-8'>
              <p className='text-xs font-bold uppercase tracking-[0.28em] text-stone-500'>Public pledge form</p>
              <h3 className='section-title mt-3 text-3xl font-extrabold text-stone-950'>Become a donor</h3>
              <p className='mt-4 text-sm leading-7 text-stone-600'>
                Submit your donor pledge here. Coordinators can verify it from the secure dashboard
                before it becomes an active donor record.
              </p>
              <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-3xl bg-stone-950 px-5 py-4 text-white'>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-white/55'>Selected organs</p>
                  <p className='mt-3 text-lg font-bold'>{selectedOrgans || 'Choose one or more organs'}</p>
                </div>
                <div className='rounded-3xl bg-emerald-900 px-5 py-4 text-white'>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200'>Review path</p>
                  <p className='mt-3 text-lg font-bold'>Pending verification before activation</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='glass-panel rounded-[2rem] p-6 sm:p-8'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='block space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2'>
                  <span>Full name</span>
                  <input className='field' name='fullName' value={pledge.fullName} onChange={handleField} required />
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700'>
                  <span>Age</span>
                  <input className='field' type='number' min='18' name='age' value={pledge.age} onChange={handleField} required />
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700'>
                  <span>Gender</span>
                  <select className='field' name='gender' value={pledge.gender} onChange={handleField}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700'>
                  <span>Medical ID</span>
                  <input className='field' name='medicalId' value={pledge.medicalId} onChange={handleField} required />
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700'>
                  <span>Blood type</span>
                  <select className='field' name='bloodType' value={pledge.bloodType} onChange={handleField}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700'>
                  <span>Weight (kg)</span>
                  <input className='field' type='number' min='20' name='weight' value={pledge.weight} onChange={handleField} required />
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700'>
                  <span>Height (cm)</span>
                  <input className='field' type='number' min='80' name='height' value={pledge.height} onChange={handleField} required />
                </label>
                <label className='block space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2'>
                  <span>Contact number</span>
                  <input className='field' name='contactNumber' value={pledge.contactNumber} onChange={handleField} required />
                </label>
              </div>

              <div className='mt-5'>
                <p className='mb-3 text-sm font-semibold text-stone-700'>Select organs</p>
                <div className='flex flex-wrap gap-3'>
                  {organOptions.map((organ) => {
                    const active = pledge.organs.includes(organ)
                    return (
                      <button
                        key={organ}
                        type='button'
                        onClick={() => toggleOrgan(organ)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                          active
                            ? 'bg-[var(--brand)] text-white'
                            : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {organ}
                      </button>
                    )
                  })}
                </div>
              </div>

              {status.message ? (
                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {status.message}
                </div>
              ) : null}

              <button
                type='submit'
                disabled={submitting || pledge.organs.length === 0}
                className='mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {submitting ? 'Submitting pledge...' : 'Submit donor pledge'}
              </button>
            </form>
          </section>

          <section className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
            <div className='glass-panel rounded-[2rem] p-6 sm:p-8'>
              <p className='text-xs font-bold uppercase tracking-[0.28em] text-stone-500'>Need secure access?</p>
              <h3 className='section-title mt-3 text-3xl font-extrabold text-stone-950'>
                Login for coordinator workflows
              </h3>
              <p className='mt-4 text-sm leading-7 text-stone-600'>
                Authorized users can register donors and patients, verify pledges, search records,
                and review matching recommendations in the dashboard.
              </p>
              <div className='mt-6 flex flex-wrap gap-3'>
                <Link
                  to='/login'
                  className='rounded-full bg-stone-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-stone-800'
                >
                  Sign in
                </Link>
                <Link
                  to='/register'
                  className='rounded-full border border-stone-300 px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-400'
                >
                  Register admin
                </Link>
              </div>
            </div>

            <div className='grid gap-4'>
              {faqs.map((item) => (
                <article key={item.question} className='glass-panel rounded-[2rem] p-6'>
                  <h4 className='text-lg font-extrabold text-stone-950'>{item.question}</h4>
                  <p className='mt-3 text-sm leading-6 text-stone-600'>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LandingPage
