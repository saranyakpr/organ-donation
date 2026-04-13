import { HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'

const AuthShell = ({ title, subtitle, children, altLabel, altHref, altAction }) => (
  <div className='grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]'>
    <div className='relative hidden overflow-hidden bg-stone-950 lg:block'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,82,0.4),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.32),_transparent_22%),linear-gradient(180deg,_#2d140f_0%,_#120d0b_100%)]' />
      <div className='relative flex h-full flex-col justify-between p-10 text-white'>
        <div className='inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur'>
          <HeartPulse className='h-4 w-4 text-emerald-300' />
          Organ Donation Platform
        </div>
        <div className='space-y-6'>
          <p className='max-w-md text-sm font-semibold uppercase tracking-[0.35em] text-white/55'>
            Protected transplant coordination
          </p>
          <h1 className='max-w-xl text-5xl font-extrabold leading-tight'>
            A calmer way to manage donors, patients, pledges, and transplant matches.
          </h1>
          <p className='max-w-lg text-base leading-7 text-white/72'>
            Built from the original organ donation dashboard flow, now upgraded into a responsive
            full-stack workspace with secure authentication.
          </p>
        </div>
      </div>
    </div>

    <div className='flex items-center justify-center px-5 py-8 sm:px-8'>
      <div className='glass-panel w-full max-w-xl rounded-[2rem] p-6 sm:p-8'>
        <Link
          to='/'
          className='mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-[var(--brand)]'
        >
          <HeartPulse className='h-4 w-4' />
          Back to homepage
        </Link>
        <div className='mb-8'>
          <h2 className='section-title text-4xl font-extrabold text-stone-950'>{title}</h2>
          <p className='mt-3 max-w-lg text-sm leading-6 text-stone-600'>{subtitle}</p>
        </div>
        {children}
        {altLabel && altHref && altAction ? (
          <p className='mt-6 text-sm text-stone-600'>
            {altLabel}{' '}
            <Link className='font-bold text-[var(--brand)]' to={altHref}>
              {altAction}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  </div>
)

export default AuthShell
