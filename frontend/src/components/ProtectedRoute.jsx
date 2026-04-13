import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center px-6'>
        <div className='glass-panel rounded-[2rem] px-6 py-5 text-sm font-semibold text-stone-700'>
          Loading secure workspace...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
