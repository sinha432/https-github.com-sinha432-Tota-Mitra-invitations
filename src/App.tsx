import React, { createContext, useContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import SupervisorDashboard from '@/pages/SupervisorDashboard'
import EmployerDashboard from '@/pages/EmployerDashboard'
import WorkerDashboard from '@/pages/WorkerDashboard'
import { toast } from 'sonner'

// Authentication Context
interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  language: 'en' | 'kn'
  setLanguage: (lang: 'en' | 'kn') => void
}

export type UserRole = 'supervisor' | 'employer' | 'worker'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function App() {
  console.log('🚀 App component rendering...')
  
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<'en' | 'kn'>('en')

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('totamitra_user')
    const savedLanguage = localStorage.getItem('totamitra_language') as 'en' | 'kn'
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        console.log('✅ User session restored from localStorage')
      } catch (error) {
        console.error('❌ Error parsing saved user:', error)
        localStorage.removeItem('totamitra_user')
      }
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    console.log('🔑 Login attempt:', { email, role })
    
    // Mock authentication - in real app, this would call an API
    const mockUsers = {
      'supervisor@farm.com': { id: '1', name: 'Farm Supervisor', role: 'supervisor' as UserRole },
      'employer@farm.com': { id: '2', name: 'Farm Employer', role: 'employer' as UserRole },
      'worker@farm.com': { id: '3', name: 'Farm Worker', role: 'worker' as UserRole },
    }

    if (email in mockUsers && password === 'password123') {
      const userData = mockUsers[email as keyof typeof mockUsers]
      const newUser: User = {
        ...userData,
        email,
      }
      
      setUser(newUser)
      localStorage.setItem('totamitra_user', JSON.stringify(newUser))
      
      toast.success(language === 'en' ? 'Login successful!' : 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!')
      console.log('✅ Login successful for:', email)
      return true
    }
    
    toast.error(language === 'en' ? 'Invalid credentials' : 'ತಪ್ಪಾದ ವಿವರಗಳು')
    console.log('❌ Login failed for:', email)
    return false
  }

  const logout = () => {
    console.log('🚪 User logging out...')
    setUser(null)
    localStorage.removeItem('totamitra_user')
    toast.success(language === 'en' ? 'Logged out successfully' : 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಔಟ್ ಆಗಿದೆ')
  }

  const updateLanguage = (lang: 'en' | 'kn') => {
    console.log('🌐 Language changed to:', lang)
    setLanguage(lang)
    localStorage.setItem('totamitra_language', lang)
  }

  const authValue: AuthContextType = {
    user,
    login,
    logout,
    language,
    setLanguage: updateLanguage,
  }

  return (
    <AuthContext.Provider value={authValue}>
      <div className="min-h-screen bg-background relative pb-16">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                user.role === 'supervisor' ? <SupervisorDashboard /> :
                user.role === 'employer' ? <EmployerDashboard /> :
                <WorkerDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App