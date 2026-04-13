import { useState } from 'react'
import PublicSiteLayout from '../components/PublicSiteLayout'
import api from '../api/client'

const defaultPledge = {
  fullName: '',
  age: '',
  gender: 'Male',
  medicalId: '',
  bloodType: 'A-',
  organs: [],
  weight: '',
  height: '',
  contactNumber: '',
}

const organOptions = [
  'Left Kidney',
  'Right Kidney',
  'Left Lung',
  'Right Lung',
  'Liver',
  'Heart',
  'Pancreas',
  'Intestine',
]

const PledgePage = () => {
  const [pledge, setPledge] = useState(defaultPledge)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
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
    <PublicSiteLayout>
      <div className='public-container'>
        <div className='public-pledge-title-row'>
          <h3>Pledge as an organ donor</h3>
        </div>

        <div className='public-pledge-row'>
          <form className='public-pledge-card' onSubmit={handleSubmit}>
            <label className='public-form-field'>
              <span>Full Name:</span>
              <input
                type='text'
                name='fullName'
                value={pledge.fullName}
                onChange={handleChange}
                placeholder='Full name'
                required
              />
            </label>

            <label className='public-form-field'>
              <span>Age:</span>
              <input
                type='text'
                name='age'
                value={pledge.age}
                onChange={handleChange}
                placeholder='Age'
                required
              />
            </label>

            <div className='public-choice-group'>
              <p>Gender:</p>
              <div className='public-chip-group'>
                {['Male', 'Female', 'Others'].map((option) => (
                  <label key={option}>
                    <input
                      type='radio'
                      name='gender'
                      value={option}
                      checked={pledge.gender === option}
                      onChange={handleChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className='public-form-field'>
              <span>Medical ID:</span>
              <input
                type='text'
                name='medicalId'
                value={pledge.medicalId}
                onChange={handleChange}
                placeholder='Donor Medical ID'
                required
              />
            </label>

            <label className='public-form-field'>
              <span>Blood Type:</span>
              <select name='bloodType' value={pledge.bloodType} onChange={handleChange}>
                {['A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <div className='public-choice-group'>
              <p>Organ(s):</p>
              <div className='public-chip-group'>
                {organOptions.map((organ) => (
                  <label key={organ}>
                    <input
                      type='checkbox'
                      name='organs'
                      value={organ}
                      checked={pledge.organs.includes(organ)}
                      onChange={() => toggleOrgan(organ)}
                    />
                    <span>{organ}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className='public-form-field'>
              <span>Weight (kg):</span>
              <input
                type='text'
                name='weight'
                value={pledge.weight}
                onChange={handleChange}
                placeholder='Weight'
                required
              />
            </label>

            <label className='public-form-field'>
              <span>Height (cm):</span>
              <input
                type='text'
                name='height'
                value={pledge.height}
                onChange={handleChange}
                placeholder='Height'
                required
              />
            </label>

            <label className='public-form-field'>
              <span>Contact Number:</span>
              <input
                type='text'
                name='contactNumber'
                value={pledge.contactNumber}
                onChange={handleChange}
                placeholder='Phone number'
                required
              />
            </label>

            <div className='public-pledge-actions'>
              <button
                type='submit'
                className='public-submit-button'
                disabled={submitting || pledge.organs.length === 0}
              >
                {submitting ? 'Submitting...' : 'Pledge'}
              </button>
            </div>
          </form>
        </div>

        {status.message ? (
          <div className={`public-alert ${status.type === 'success' ? 'success' : 'error'}`}>
            {status.message}
          </div>
        ) : null}
      </div>
    </PublicSiteLayout>
  )
}

export default PledgePage
