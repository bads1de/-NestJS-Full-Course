import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import AdminPanel from './components/AdminPanel'
import { authClient } from './lib/auth-client'
import './App.css'

type View = 'login' | 'welcome' | 'admin'
type UserProfile = { id: string; name: string; email: string; role: string; emailVerified: boolean }

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [view, setView] = useState<View>('login')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (): Promise<UserProfile | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/me`, { credentials: 'include' })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  const checkSession = async () => {
    const { data } = await authClient.getSession()
    if (data) {
      const p = await fetchProfile()
      setProfile(p ?? { id: data.user.id, name: (data.user as any).name, email: (data.user as any).email, role: 'user', emailVerified: false })
      setView('welcome')
    } else {
      setProfile(null)
      setView('login')
    }
    setLoading(false)
  }

  useEffect(() => { checkSession() }, [])

  const handleLogout = async () => {
    await authClient.signOut()
    setProfile(null)
    setView('login')
  }

  if (loading) {
    return <div className="app"><p>Loading...</p></div>
  }

  if (view === 'admin' && profile) {
    return <AdminPanel onBack={() => setView('welcome')} />
  }

  if (view === 'welcome' && profile) {
    return (
      <div className="app">
        <div className="welcome-card">
          <h1>Welcome, {profile.name}</h1>
          <p className={`role-badge role-${profile.role}`}>
            Role: {profile.role}
          </p>
          <div className="welcome-actions">
            {profile.role === 'admin' && (
              <button type="button" onClick={() => setView('admin')}>
                Admin Panel
              </button>
            )}
            <button type="button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <LoginForm onLogin={checkSession} />
    </div>
  )
}

export default App
