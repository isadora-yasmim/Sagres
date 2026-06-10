import { createContext, useContext, useState, useCallback } from 'react'
import { TOKEN_KEY } from '../constants/auth'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

function tokenToUser(token) {
  if (!token) return null
  const payload = decodeToken(token)
  if (!payload) return null
  return { email: payload.sub, role: payload.role }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => tokenToUser(localStorage.getItem(TOKEN_KEY)))

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(tokenToUser(newToken))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
