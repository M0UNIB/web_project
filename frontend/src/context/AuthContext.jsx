import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'notes-app-auth'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      const parsed = JSON.parse(stored)
      setToken(parsed.token)
      setUser(parsed.user)
      setAuthToken(parsed.token)
    }

    setLoading(false)
  }, [])

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    setAuthToken(nextToken)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: nextToken,
        user: nextUser,
      }),
    )
  }

  const clearAuth = async () => {
    try {
      if (token) {
        await api.post('/logout')
      }
    } catch (_error) {
    } finally {
      setToken(null)
      setUser(null)
      setAuthToken(null)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    persistAuth,
    clearAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
