import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import AwarenessPage from './pages/AwarenessPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PledgePage from './pages/PledgePage'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/home' element={<Navigate to='/' replace />} />
      <Route path='/homepage.html' element={<HomePage />} />
      <Route path='/about-us' element={<AboutPage />} />
      <Route path='/about-us.html' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/contact.html' element={<ContactPage />} />
      <Route path='/awareness' element={<AwarenessPage />} />
      <Route path='/awareness.html' element={<AwarenessPage />} />
      <Route path='/pledge' element={<PledgePage />} />
      <Route path='/donor-pledge.html' element={<PledgePage />} />
      <Route
        path='/login'
        element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <LoginPage />}
      />
      <Route
        path='/register'
        element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <RegisterPage />}
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App
