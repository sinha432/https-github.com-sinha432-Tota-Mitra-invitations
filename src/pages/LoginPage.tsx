import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Leaf, Sun, CloudRain, Users, Calendar, BarChart3, Languages, Eye, EyeOff } from 'lucide-react'
import { useAuth, UserRole } from '@/App'

const LoginPage = () => {
  console.log('🔐 LoginPage component rendering...')
  
  const { login, language, setLanguage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>('supervisor')
  const [isLoading, setIsLoading] = useState(false)

  const translations = {
    en: {
      title: 'TotaMitra',
      subtitle: 'Farm Workforce Management System',
      description: 'ತೋಟಮಿತ್ರ - Friend of the Garden/Farm',
      loginTitle: 'Welcome Back',
      loginDesc: 'Sign in to your account to continue',
      email: 'Email Address',
      password: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      role: 'Select Role',
      signIn: 'Sign In',
      demoAccounts: 'Demo Accounts',
      supervisor: 'Supervisor',
      employer: 'Employer',
      worker: 'Worker',
      features: {
        workforce: 'Workforce Management',
        scheduling: 'Task Scheduling',
        analytics: 'Performance Analytics',
        weather: 'Weather Integration'
      }
    },
    kn: {
      title: 'ತೋಟಮಿತ್ರ',
      subtitle: 'ತೋಟದ ಕಾರ್ಮಿಕರ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',
      description: 'TotaMitra - Friend of the Garden/Farm',
      loginTitle: 'ಮರಳಿ ಸ್ವಾಗತ',
      loginDesc: 'ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
      email: 'ಇಮೇಲ್ ವಿಳಾಸ',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
      hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
      role: 'ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ',
      signIn: 'ಸೈನ್ ಇನ್',
      demoAccounts: 'ಡೆಮೊ ಖಾತೆಗಳು',
      supervisor: 'ಮೇಲ್ವಿಚಾರಕ',
      employer: 'ಉದ್ಯೋಗದಾತ',
      worker: 'ಕೆಲಸಗಾರ',
      features: {
        workforce: 'ಕಾರ್ಮಿಕರ ನಿರ್ವಹಣೆ',
        scheduling: 'ಕಾರ್ಯ ವೇಳಾಪಟ್ಟಿ',
        analytics: 'ಕಾರ್ಯಕ್ಷಮತೆ ವಿಶ್ಲೇಷಣೆ',
        weather: 'ಹವಾಮಾನ ಏಕೀಕರಣ'
      }
    }
  }

  const t = translations[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Login form submitted:', { email, role })
    
    if (!email || !password || !role) {
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password, role)
    } catch (error) {
      console.error('❌ Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    { email: 'supervisor@farm.com', role: 'supervisor' as UserRole, name: t.supervisor },
    { email: 'employer@farm.com', role: 'employer' as UserRole, name: t.employer },
    { email: 'worker@farm.com', role: 'worker' as UserRole, name: t.worker },
  ]

  const fillDemoAccount = (demoEmail: string, demoRole: UserRole) => {
    console.log('🎯 Demo account selected:', { demoEmail, demoRole })
    setEmail(demoEmail)
    setPassword('password123')
    setRole(demoRole)
  }

  return (
    <div className="min-h-screen agricultural-gradient farm-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary">{t.title}</h1>
              <p className="text-lg text-muted-foreground">{t.subtitle}</p>
              <p className="text-sm text-agriculture-brown italic">{t.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-primary/20">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{t.features.workforce}</h3>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-primary/20">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{t.features.scheduling}</h3>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-primary/20">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{t.features.analytics}</h3>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center border border-primary/20">
              <CloudRain className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{t.features.weather}</h3>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-primary/20 animate-fade-in">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-primary">{t.loginTitle}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
                className="h-8 w-8 p-0"
              >
                <Languages className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{t.loginDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'en' ? 'Enter your email' : 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ'}
                  required
                  className="border-primary/30 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Enter your password' : 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ'}
                    required
                    className="border-primary/30 focus:border-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? t.hidePassword : t.showPassword}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t.role}</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger className="border-primary/30 focus:border-primary">
                    <SelectValue placeholder={t.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">{t.supervisor}</SelectItem>
                    <SelectItem value="employer">{t.employer}</SelectItem>
                    <SelectItem value="worker">{t.worker}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    {language === 'en' ? 'Signing in...' : 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...'}
                  </div>
                ) : (
                  t.signIn
                )}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="text-center">
                <Label className="text-sm font-medium">{t.demoAccounts}</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'en' ? 'Click to auto-fill credentials' : 'ವಿವರಗಳನ್ನು ಸ್ವಯಂ ಭರ್ತಿ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {demoAccounts.map((account) => (
                  <Badge
                    key={account.email}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => fillDemoAccount(account.email, account.role)}
                  >
                    {account.name}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {language === 'en' ? 'Password: password123' : 'ಪಾಸ್‌ವರ್ಡ್: password123'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage