import { createContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('odp-token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
      } catch {
        localStorage.removeItem('odp-token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [token])

  const authenticate = async (endpoint, payload) => {
    const { data } = await api.post(endpoint, payload)
    localStorage.setItem('odp-token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login: (payload) => authenticate('/auth/login', payload),
        register: (payload) => authenticate('/auth/register', payload),
        logout: () => {
          localStorage.removeItem('odp-token')
          setToken(null)
          setUser(null)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
