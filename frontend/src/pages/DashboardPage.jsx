import { createElement, useEffect, useState } from 'react'
import {
  Activity,
  HeartHandshake,
  LogOut,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'
import SectionCard from '../components/SectionCard'
import { useAuth } from '../context/useAuth'
import api from '../api/client'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const organs = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const initialRecord = {
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

const statCards = [
  { key: 'donorCount', label: 'Active donors', icon: Users },
  { key: 'patientCount', label: 'Patients', icon: Activity },
  { key: 'pendingPledges', label: 'Pending pledges', icon: ShieldCheck },
  { key: 'matchCount', label: 'Potential matches', icon: HeartHandshake },
]

const DataTable = ({ columns, rows, emptyMessage }) => (
  <div className='table-scroll rounded-[1.5rem] border border-stone-200/70 bg-white/75'>
    <table className='text-sm'>
      <thead className='bg-stone-100/80 text-stone-600'>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className='py-8 text-center text-stone-500'>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr key={row._id || `${row.medicalId || row.patientMedicalId}-${index}`} className='text-stone-700'>
              {columns.map((column) => (
                <td key={`${column}-${index}`}>
                  {Array.isArray(row[column]) ? row[column].join(', ') : row[column] ?? '-'}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const [overview, setOverview] = useState({
    donorCount: 0,
    patientCount: 0,
    pendingPledges: 0,
    matchCount: 0,
  })
  const [donors, setDonors] = useState([])
  const [patients, setPatients] = useState([])
  const [pledges, setPledges] = useState([])
  const [matches, setMatches] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [searchResults, setSearchResults] = useState({ donor: null, patient: null })
  const [searchValues, setSearchValues] = useState({ donorMedicalId: '', patientMedicalId: '' })
  const [donorForm, setDonorForm] = useState(initialRecord)
  const [patientForm, setPatientForm] = useState(initialRecord)
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    setLoading(true)

    try {
      const [overviewResponse, donorResponse, patientResponse, pledgeResponse, matchResponse] =
        await Promise.all([
          api.get('/dashboard/overview'),
          api.get('/donors'),
          api.get('/patients'),
          api.get('/pledges?status=pending'),
          api.get('/matches'),
        ])

      setOverview(overviewResponse.data)
      setDonors(donorResponse.data.donors)
      setPatients(patientResponse.data.patients)
      setPledges(pledgeResponse.data.pledges)
      setMatches(matchResponse.data.matches)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to load dashboard data.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const toggleOrgan = (target, organ) => {
    const setter = target === 'donor' ? setDonorForm : setPatientForm

    setter((current) => ({
      ...current,
      organs: current.organs.includes(organ)
        ? current.organs.filter((item) => item !== organ)
        : [...current.organs, organ],
    }))
  }

  const handleRecordChange = (target, event) => {
    const setter = target === 'donor' ? setDonorForm : setPatientForm
    const { name, value } = event.target
    setter((current) => ({ ...current, [name]: value }))
  }

  const createRecord = async (type, payload) => {
    setStatus({ type: '', message: '' })

    try {
      await api.post(`/${type}s`, payload)
      setStatus({
        type: 'success',
        message: `${type === 'donor' ? 'Donor' : 'Patient'} registered successfully.`,
      })
      if (type === 'donor') {
        setDonorForm(initialRecord)
      } else {
        setPatientForm(initialRecord)
      }
      await loadDashboard()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || `Unable to create the ${type} record.`,
      })
    }
  }

  const submitRecord = (type) => (event) => {
    event.preventDefault()
    const payload = type === 'donor' ? donorForm : patientForm
    createRecord(type, payload)
  }

  const approvePledge = async (pledgeId) => {
    setStatus({ type: '', message: '' })

    try {
      await api.post(`/pledges/${pledgeId}/approve`)
      setStatus({
        type: 'success',
        message: 'Pledge verified and added to the donor registry.',
      })
      await loadDashboard()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to approve this pledge.',
      })
    }
  }

  const handleSearchInput = (event) => {
    const { name, value } = event.target
    setSearchValues((current) => ({ ...current, [name]: value }))
  }

  const searchRecord = async (type) => {
    const field = type === 'donor' ? 'donorMedicalId' : 'patientMedicalId'
    const medicalId = searchValues[field]

    if (!medicalId) {
      setStatus({ type: 'error', message: `Enter a ${type} medical ID before searching.` })
      return
    }

    try {
      const { data } = await api.get(`/${type}s/search/${medicalId}`)
      setSearchResults((current) => ({ ...current, [type]: data[type] }))
      setStatus({ type: 'success', message: `${type === 'donor' ? 'Donor' : 'Patient'} found.` })
    } catch (error) {
      setSearchResults((current) => ({ ...current, [type]: null }))
      setStatus({
        type: 'error',
        message: error.response?.data?.message || `Unable to find that ${type}.`,
      })
    }
  }

  const renderForm = (title, eyebrow, target, formState, onSubmit) => (
    <SectionCard title={title} eyebrow={eyebrow}>
      <form className='space-y-4' onSubmit={onSubmit}>
        <div className='grid gap-4 md:grid-cols-2'>
          <label className='block space-y-2 text-sm font-semibold text-stone-700 md:col-span-2'>
            <span>Full name</span>
            <input className='field' name='fullName' value={formState.fullName} onChange={(event) => handleRecordChange(target, event)} required />
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700'>
            <span>Age</span>
            <input className='field' type='number' min='1' name='age' value={formState.age} onChange={(event) => handleRecordChange(target, event)} required />
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700'>
            <span>Gender</span>
            <select className='field' name='gender' value={formState.gender} onChange={(event) => handleRecordChange(target, event)}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700'>
            <span>Medical ID</span>
            <input className='field' name='medicalId' value={formState.medicalId} onChange={(event) => handleRecordChange(target, event)} required />
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700'>
            <span>Blood type</span>
            <select className='field' name='bloodType' value={formState.bloodType} onChange={(event) => handleRecordChange(target, event)}>
              {bloodTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700'>
            <span>Weight (kg)</span>
            <input className='field' type='number' min='1' name='weight' value={formState.weight} onChange={(event) => handleRecordChange(target, event)} required />
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700'>
            <span>Height (cm)</span>
            <input className='field' type='number' min='1' name='height' value={formState.height} onChange={(event) => handleRecordChange(target, event)} required />
          </label>
          <label className='block space-y-2 text-sm font-semibold text-stone-700 md:col-span-2'>
            <span>Contact number</span>
            <input className='field' name='contactNumber' value={formState.contactNumber} onChange={(event) => handleRecordChange(target, event)} required />
          </label>
        </div>
        <div>
          <p className='mb-3 text-sm font-semibold text-stone-700'>Organs</p>
          <div className='flex flex-wrap gap-3'>
            {organs.map((organ) => {
              const active = formState.organs.includes(organ)
              return (
                <button
                  key={organ}
                  type='button'
                  onClick={() => toggleOrgan(target, organ)}
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
        <button
          type='submit'
          disabled={formState.organs.length === 0}
          className='rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60'
        >
          Save {title}
        </button>
      </form>
    </SectionCard>
  )

  return (
    <div className='px-4 py-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <header className='glass-panel rounded-[2rem] px-5 py-5 sm:px-7'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.3em] text-stone-500'>Secure admin workspace</p>
              <h1 className='section-title mt-2 text-3xl font-extrabold text-stone-950 sm:text-4xl'>
                Organ Donation Dashboard
              </h1>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-stone-600'>
                Welcome back, {user?.name}. Review pledge approvals, register records, run quick searches, and scan transplant match recommendations from one place.
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700'>
                {user?.organization}
              </div>
              <button onClick={logout} className='inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-stone-800'>
                <LogOut className='h-4 w-4' />
                Logout
              </button>
            </div>
          </div>
        </header>

        {status.message ? (
          <div className={`rounded-[1.5rem] px-5 py-4 text-sm ${status.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>
            {status.message}
          </div>
        ) : null}

        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {statCards.map(({ key, label, icon }) => (
            <article key={key} className='glass-panel rounded-[2rem] p-5'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold text-stone-600'>{label}</p>
                <div className='rounded-2xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]'>
                  {createElement(icon, { className: 'h-5 w-5' })}
                </div>
              </div>
              <p className='mt-5 text-4xl font-extrabold text-[var(--brand-deep)]'>
                {loading ? '...' : overview[key]}
              </p>
            </article>
          ))}
        </section>

        <section className='grid gap-6 xl:grid-cols-2'>
          {renderForm('Donor', 'Register donor', 'donor', donorForm, submitRecord('donor'))}
          {renderForm('Patient', 'Register patient', 'patient', patientForm, submitRecord('patient'))}
        </section>

        <section className='grid gap-6 xl:grid-cols-2'>
          <SectionCard title='Quick search' eyebrow='Search donor'>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <input className='field' name='donorMedicalId' value={searchValues.donorMedicalId} onChange={handleSearchInput} placeholder='Enter donor medical ID' />
              <button onClick={() => searchRecord('donor')} className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'>
                <Search className='h-4 w-4' />
                Search donor
              </button>
            </div>
            {searchResults.donor ? (
              <div className='mt-5 rounded-[1.5rem] bg-white/70 p-4 text-sm text-stone-700'>
                <p><strong>Name:</strong> {searchResults.donor.fullName}</p>
                <p><strong>Blood type:</strong> {searchResults.donor.bloodType}</p>
                <p><strong>Organs:</strong> {searchResults.donor.organs.join(', ')}</p>
                <p><strong>Contact:</strong> {searchResults.donor.contactNumber}</p>
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title='Quick search' eyebrow='Search patient'>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <input className='field' name='patientMedicalId' value={searchValues.patientMedicalId} onChange={handleSearchInput} placeholder='Enter patient medical ID' />
              <button onClick={() => searchRecord('patient')} className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'>
                <Search className='h-4 w-4' />
                Search patient
              </button>
            </div>
            {searchResults.patient ? (
              <div className='mt-5 rounded-[1.5rem] bg-white/70 p-4 text-sm text-stone-700'>
                <p><strong>Name:</strong> {searchResults.patient.fullName}</p>
                <p><strong>Blood type:</strong> {searchResults.patient.bloodType}</p>
                <p><strong>Organs needed:</strong> {searchResults.patient.organs.join(', ')}</p>
                <p><strong>Contact:</strong> {searchResults.patient.contactNumber}</p>
              </div>
            ) : null}
          </SectionCard>
        </section>

        <SectionCard title='Pending pledge verification' eyebrow='Approve donor pledges'>
          <div className='space-y-4'>
            {pledges.length === 0 ? (
              <div className='rounded-[1.5rem] border border-dashed border-stone-300 bg-white/60 px-5 py-8 text-center text-sm text-stone-500'>
                No pending pledges right now.
              </div>
            ) : (
              pledges.map((pledge) => (
                <div key={pledge._id} className='flex flex-col gap-4 rounded-[1.5rem] border border-stone-200/80 bg-white/70 p-5 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='space-y-1 text-sm text-stone-700'>
                    <p className='text-lg font-extrabold text-stone-950'>{pledge.fullName}</p>
                    <p>Medical ID: {pledge.medicalId}</p>
                    <p>Blood type: {pledge.bloodType}</p>
                    <p>Organs: {pledge.organs.join(', ')}</p>
                    <p>Contact: {pledge.contactNumber}</p>
                  </div>
                  <button onClick={() => approvePledge(pledge._id)} className='rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'>
                    Verify and add donor
                  </button>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <section className='grid gap-6'>
          <SectionCard title='Registered donors' eyebrow='View donors'>
            <DataTable columns={['fullName', 'medicalId', 'bloodType', 'organs', 'contactNumber']} rows={donors} emptyMessage='No donors registered yet.' />
          </SectionCard>

          <SectionCard title='Registered patients' eyebrow='View patients'>
            <DataTable columns={['fullName', 'medicalId', 'bloodType', 'organs', 'contactNumber']} rows={patients} emptyMessage='No patients registered yet.' />
          </SectionCard>

          <SectionCard title='Transplant matches' eyebrow='Potential recommendations'>
            <DataTable columns={['patientName', 'patientMedicalId', 'requiredOrgan', 'recipientBloodType', 'donorName', 'donorMedicalId', 'donorBloodType']} rows={matches} emptyMessage='No matches available yet.' />
          </SectionCard>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
