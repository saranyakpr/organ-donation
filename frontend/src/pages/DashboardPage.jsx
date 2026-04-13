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
const pageSize = 10
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

const dashboardTabs = [
  {
    key: 'donors',
    label: 'Donors',
    description: 'Register and review donor records',
  },
  {
    key: 'patients',
    label: 'Patients',
    description: 'Register and review patient records',
  },
  {
    key: 'search',
    label: 'Quick Search',
    description: 'Find donors and patients by medical ID',
  },
  {
    key: 'pledges',
    label: 'Pending Pledges',
    description: 'Verify incoming donor pledges',
  },
  {
    key: 'matches',
    label: 'Transplant Matches',
    description: 'Review potential donor-recipient matches',
  },
]

const Toast = ({ toast, onClose }) => {
  if (!toast.message) {
    return null
  }

  return (
    <div className='fixed right-4 top-4 z-50 w-[min(92vw,24rem)]'>
      <div
        className={`rounded-[1.5rem] border px-5 py-4 shadow-xl backdrop-blur ${
          toast.type === 'success'
            ? 'border-emerald-200 bg-emerald-50/95 text-emerald-700'
            : 'border-rose-200 bg-rose-50/95 text-rose-700'
        }`}
      >
        <div className='flex items-start justify-between gap-4'>
          <p className='text-sm font-semibold'>{toast.message}</p>
          <button
            type='button'
            onClick={onClose}
            className='text-lg leading-none opacity-70 transition hover:opacity-100'
            aria-label='Close notification'
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

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

const PaginationControls = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className='mt-5 flex flex-col gap-3 border-t border-stone-200/80 pt-4 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between'>
      <p>
        Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} total
      </p>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className='rounded-full border border-stone-300 bg-white px-4 py-2 font-semibold text-stone-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50'
        >
          Previous
        </button>
        <button
          type='button'
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className='rounded-full bg-[var(--brand)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  )
}

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
  const [donorPagination, setDonorPagination] = useState(null)
  const [patientPagination, setPatientPagination] = useState(null)
  const [matchPagination, setMatchPagination] = useState(null)
  const [donorPage, setDonorPage] = useState(1)
  const [patientPage, setPatientPage] = useState(1)
  const [matchPage, setMatchPage] = useState(1)
  const [donorRefreshKey, setDonorRefreshKey] = useState(0)
  const [patientRefreshKey, setPatientRefreshKey] = useState(0)
  const [matchRefreshKey, setMatchRefreshKey] = useState(0)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [toast, setToast] = useState({ type: '', message: '' })
  const [fieldErrors, setFieldErrors] = useState({
    donor: {},
    patient: {},
  })
  const [searchResults, setSearchResults] = useState({
    donor: null,
    patient: null,
    donorList: [],
    patientList: [],
  })
  const [searchValues, setSearchValues] = useState({
    donorMedicalId: '',
    patientMedicalId: '',
    donorOrgan: '',
    patientOrgan: '',
  })
  const [donorForm, setDonorForm] = useState(initialRecord)
  const [patientForm, setPatientForm] = useState(initialRecord)
  const [activeTab, setActiveTab] = useState('donors')
  const [loading, setLoading] = useState(true)

  const loadDashboardSummary = async () => {
    setLoading(true)

    try {
      const [overviewResponse, pledgeResponse] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/pledges?status=pending'),
      ])

      setOverview(overviewResponse.data)
      setPledges(pledgeResponse.data.pledges)
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
    loadDashboardSummary()
  }, [])

  useEffect(() => {
    if (!toast.message) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToast({ type: '', message: '' })
    }, 3500)

    return () => window.clearTimeout(timeoutId)
  }, [toast])

  useEffect(() => {
    const loadDonors = async () => {
      try {
        const { data } = await api.get(`/donors?page=${donorPage}&limit=${pageSize}`)
        setDonors(data.donors)
        setDonorPagination(data.pagination)
      } catch (error) {
        setStatus({
          type: 'error',
          message: error.response?.data?.message || 'Unable to load donors.',
        })
      }
    }

    loadDonors()
  }, [donorPage, donorRefreshKey])

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const { data } = await api.get(`/patients?page=${patientPage}&limit=${pageSize}`)
        setPatients(data.patients)
        setPatientPagination(data.pagination)
      } catch (error) {
        setStatus({
          type: 'error',
          message: error.response?.data?.message || 'Unable to load patients.',
        })
      }
    }

    loadPatients()
  }, [patientPage, patientRefreshKey])

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const { data } = await api.get(`/matches?page=${matchPage}&limit=${pageSize}`)
        setMatches(data.matches)
        setMatchPagination(data.pagination)
      } catch (error) {
        setStatus({
          type: 'error',
          message: error.response?.data?.message || 'Unable to load transplant matches.',
        })
      }
    }

    loadMatches()
  }, [matchPage, matchRefreshKey])

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
    const nextValue =
      name === 'contactNumber' ? value.replace(/\D/g, '').slice(0, 10) : value

    setter((current) => ({ ...current, [name]: nextValue }))
    setFieldErrors((current) => ({
      ...current,
      [target]: {
        ...current[target],
        [name]: '',
      },
    }))
  }

  const createRecord = async (type, payload) => {
    setStatus({ type: '', message: '' })
    setFieldErrors((current) => ({ ...current, [type]: {} }))

    try {
      await api.post(`/${type}s`, payload)
      setToast({
        type: 'success',
        message: `${type === 'donor' ? 'Donor' : 'Patient'} registered successfully.`,
      })
      if (type === 'donor') {
        setDonorForm(initialRecord)
        setDonorPage(1)
        setDonorRefreshKey((current) => current + 1)
      } else {
        setPatientForm(initialRecord)
        setPatientPage(1)
        setPatientRefreshKey((current) => current + 1)
      }
      setMatchPage(1)
      setMatchRefreshKey((current) => current + 1)
      await loadDashboardSummary()
    } catch (error) {
      const message = error.response?.data?.message || `Unable to create the ${type} record.`

      if (message.includes('medical ID already exists')) {
        setFieldErrors((current) => ({
          ...current,
          [type]: {
            ...current[type],
            medicalId: message,
          },
        }))
      }

      setToast({
        type: 'error',
        message,
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
      setDonorPage(1)
      setMatchPage(1)
      setDonorRefreshKey((current) => current + 1)
      setMatchRefreshKey((current) => current + 1)
      await loadDashboardSummary()
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

  const clearSearchField = (type) => {
    setSearchValues((current) => ({
      ...current,
      [`${type}MedicalId`]: '',
    }))
    setSearchResults((current) => ({
      ...current,
      [type]: null,
      [`${type}List`]: [],
    }))
  }

  const searchRecord = async (type) => {
    const field = type === 'donor' ? 'donorMedicalId' : 'patientMedicalId'
    const organField = type === 'donor' ? 'donorOrgan' : 'patientOrgan'
    const medicalId = searchValues[field].trim()
    const organ = searchValues[organField].trim()

    if (!medicalId && !organ) {
      setToast({
        type: 'error',
        message: `Enter a ${type} medical ID or organ before searching.`,
      })
      return
    }

    try {
      const params = new URLSearchParams()

      if (medicalId) {
        params.set('medicalId', medicalId)
      } else if (organ) {
        params.set('organ', organ)
      }

      const { data } = await api.get(`/${type}s/search?${params.toString()}`)
      setSearchResults((current) => ({
        ...current,
        [type]: data[type] || null,
        [`${type}List`]: data[`${type}s`] || [],
      }))
      setToast({
        type: 'success',
        message: `${type === 'donor' ? 'Donor' : 'Patient'} search completed.`,
      })
    } catch (error) {
      setSearchResults((current) => ({ ...current, [type]: null, [`${type}List`]: [] }))
      setToast({
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
            <input
              className={`field ${fieldErrors[target]?.medicalId ? 'field-error' : ''}`}
              name='medicalId'
              value={formState.medicalId}
              onChange={(event) => handleRecordChange(target, event)}
              required
            />
            {fieldErrors[target]?.medicalId ? (
              <span className='text-sm font-semibold text-rose-600'>
                {fieldErrors[target].medicalId}
              </span>
            ) : null}
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
            <input
              className='field'
              name='contactNumber'
              value={formState.contactNumber}
              onChange={(event) => handleRecordChange(target, event)}
              inputMode='numeric'
              pattern='\d{10}'
              maxLength='10'
              placeholder='Enter 10-digit contact number'
              required
            />
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

  const renderDonorsTab = () => (
    <div className='space-y-6'>
      {renderForm('Donor', 'Register donor', 'donor', donorForm, submitRecord('donor'))}

      <SectionCard title='Registered donors' eyebrow='View donors'>
        <DataTable
          columns={['fullName', 'medicalId', 'bloodType', 'organs', 'contactNumber']}
          rows={donors}
          emptyMessage='No donors registered yet.'
        />
        <PaginationControls pagination={donorPagination} onPageChange={setDonorPage} />
      </SectionCard>
    </div>
  )

  const renderPatientsTab = () => (
    <div className='space-y-6'>
      {renderForm('Patient', 'Register patient', 'patient', patientForm, submitRecord('patient'))}

      <SectionCard title='Registered patients' eyebrow='View patients'>
        <DataTable
          columns={['fullName', 'medicalId', 'bloodType', 'organs', 'contactNumber']}
          rows={patients}
          emptyMessage='No patients registered yet.'
        />
        <PaginationControls pagination={patientPagination} onPageChange={setPatientPage} />
      </SectionCard>
    </div>
  )

  const renderSearchTab = () => (
    <section className='grid gap-6 xl:grid-cols-2'>
      <SectionCard title='Quick search' eyebrow='Search donor'>
        <div className='grid gap-3 lg:grid-cols-[1fr_1fr_auto]'>
          <div className='relative'>
            <input
              className='field pr-12'
              name='donorMedicalId'
              value={searchValues.donorMedicalId}
              onChange={handleSearchInput}
              placeholder='Enter donor medical ID'
            />
            {searchValues.donorMedicalId ? (
              <button
                type='button'
                onClick={() => clearSearchField('donor')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400 transition hover:text-stone-700'
                aria-label='Clear donor medical ID'
              >
                ×
              </button>
            ) : null}
          </div>
          <select
            className='field'
            name='donorOrgan'
            value={searchValues.donorOrgan}
            onChange={handleSearchInput}
          >
            <option value=''>Search by organ instead</option>
            {organs.map((organ) => (
              <option key={organ} value={organ}>
                {organ}
              </option>
            ))}
          </select>
          <button
            onClick={() => searchRecord('donor')}
            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'
          >
            <Search className='h-4 w-4' />
            Search donor
          </button>
        </div>
        {searchResults.donor ? (
          <div className='mt-5 rounded-[1.5rem] bg-white/70 p-4 text-sm text-stone-700'>
            <p><strong>Name:</strong> {searchResults.donor.fullName}</p>
            <p><strong>Medical ID:</strong> {searchResults.donor.medicalId}</p>
            <p><strong>Blood type:</strong> {searchResults.donor.bloodType}</p>
            <p><strong>Available organs:</strong> {searchResults.donor.organs.join(', ')}</p>
            <p><strong>Contact:</strong> {searchResults.donor.contactNumber}</p>
          </div>
        ) : null}
        {searchResults.donorList.length > 0 && !searchResults.donor ? (
          <div className='mt-5 space-y-3'>
            {searchResults.donorList.map((donor) => (
              <div key={donor._id} className='rounded-[1.5rem] bg-white/70 p-4 text-sm text-stone-700'>
                <p><strong>Name:</strong> {donor.fullName}</p>
                <p><strong>Medical ID:</strong> {donor.medicalId}</p>
                <p><strong>Blood type:</strong> {donor.bloodType}</p>
                <p><strong>Available organs:</strong> {donor.organs.join(', ')}</p>
                <p><strong>Contact:</strong> {donor.contactNumber}</p>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title='Quick search' eyebrow='Search patient'>
        <div className='grid gap-3 lg:grid-cols-[1fr_1fr_auto]'>
          <div className='relative'>
            <input
              className='field pr-12'
              name='patientMedicalId'
              value={searchValues.patientMedicalId}
              onChange={handleSearchInput}
              placeholder='Enter patient medical ID'
            />
            {searchValues.patientMedicalId ? (
              <button
                type='button'
                onClick={() => clearSearchField('patient')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400 transition hover:text-stone-700'
                aria-label='Clear patient medical ID'
              >
                ×
              </button>
            ) : null}
          </div>
          <select
            className='field'
            name='patientOrgan'
            value={searchValues.patientOrgan}
            onChange={handleSearchInput}
          >
            <option value=''>Search by organ instead</option>
            {organs.map((organ) => (
              <option key={organ} value={organ}>
                {organ}
              </option>
            ))}
          </select>
          <button
            onClick={() => searchRecord('patient')}
            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'
          >
            <Search className='h-4 w-4' />
            Search patient
          </button>
        </div>
        {searchResults.patient ? (
          <div className='mt-5 rounded-[1.5rem] bg-white/70 p-4 text-sm text-stone-700'>
            <p><strong>Name:</strong> {searchResults.patient.fullName}</p>
            <p><strong>Medical ID:</strong> {searchResults.patient.medicalId}</p>
            <p><strong>Blood type:</strong> {searchResults.patient.bloodType}</p>
            <p><strong>Organs needed:</strong> {searchResults.patient.organs.join(', ')}</p>
            <p><strong>Contact:</strong> {searchResults.patient.contactNumber}</p>
          </div>
        ) : null}
        {searchResults.patientList.length > 0 && !searchResults.patient ? (
          <div className='mt-5 space-y-3'>
            {searchResults.patientList.map((patient) => (
              <div key={patient._id} className='rounded-[1.5rem] bg-white/70 p-4 text-sm text-stone-700'>
                <p><strong>Name:</strong> {patient.fullName}</p>
                <p><strong>Medical ID:</strong> {patient.medicalId}</p>
                <p><strong>Blood type:</strong> {patient.bloodType}</p>
                <p><strong>Organs needed:</strong> {patient.organs.join(', ')}</p>
                <p><strong>Contact:</strong> {patient.contactNumber}</p>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>
    </section>
  )

  const renderPledgesTab = () => (
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
              <button
                onClick={() => approvePledge(pledge._id)}
                className='rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]'
              >
                Verify and add donor
              </button>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  )

  const renderMatchesTab = () => (
    <SectionCard title='Transplant matches' eyebrow='Potential recommendations'>
      <DataTable
        columns={[
          'patientName',
          'patientMedicalId',
          'requiredOrgan',
          'recipientBloodType',
          'donorName',
          'donorMedicalId',
          'donorBloodType',
        ]}
        rows={matches}
        emptyMessage='No matches available yet.'
      />
      <PaginationControls pagination={matchPagination} onPageChange={setMatchPage} />
    </SectionCard>
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'patients':
        return renderPatientsTab()
      case 'search':
        return renderSearchTab()
      case 'pledges':
        return renderPledgesTab()
      case 'matches':
        return renderMatchesTab()
      case 'donors':
      default:
        return renderDonorsTab()
    }
  }

  return (
    <div className='px-4 py-4 sm:px-6 lg:px-8'>
      <Toast toast={toast} onClose={() => setToast({ type: '', message: '' })} />
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
              <button
                onClick={() => {
                  const confirmed = window.confirm('Are you sure you want to logout?')

                  if (confirmed) {
                    logout()
                  }
                }}
                className='inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-stone-800'
              >
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

        <section className='glass-panel rounded-[2rem] p-4 sm:p-5'>
          <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
            {dashboardTabs.map((tab) => {
              const active = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  type='button'
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                    active
                      ? 'border-[var(--brand)] bg-[var(--brand)] text-white shadow-lg shadow-sky-900/10'
                      : 'border-stone-200/80 bg-white/75 text-stone-700 hover:border-[var(--brand)]/40 hover:bg-white'
                  }`}
                >
                  <p className={`text-sm font-extrabold ${active ? 'text-white' : 'text-stone-900'}`}>
                    {tab.label}
                  </p>
                  <p className={`mt-1 text-sm ${active ? 'text-white/80' : 'text-stone-500'}`}>
                    {tab.description}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.28em] text-stone-500'>
                Dashboard section
              </p>
              <h2 className='section-title mt-2 text-2xl font-extrabold text-stone-950'>
                {dashboardTabs.find((tab) => tab.key === activeTab)?.label}
              </h2>
            </div>
          </div>

          {renderActiveTab()}
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
