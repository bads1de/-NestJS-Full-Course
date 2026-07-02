import { useEffect, useState } from 'react'
import { authClient } from '../lib/auth-client'

type Status = { type: 'idle' } | { type: 'loading' } | { type: 'error'; message: string } | { type: 'success'; message: string }

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>({ type: 'idle' })

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data) {
        setStatus({ type: 'success', message: 'Signed in' })
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: 'loading' })

    if (isSignUp) {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      })
      if (signUpError) {
        setStatus({ type: 'error', message: signUpError.message || signUpError.code || 'Sign up failed' })
        return
      }
      setStatus({ type: 'success', message: 'Account created! You are now signed in.' })
    } else {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      })
      if (signInError) {
        setStatus({ type: 'error', message: signInError.message || signInError.code || 'Sign in failed' })
        return
      }
      setStatus({ type: 'success', message: 'Signed in successfully!' })
    }
  }

  if (status.type === 'success') {
    return (
      <div className="login-form">
        <h1>Welcome</h1>
        <p className="success">{status.message}</p>
        <button type="button" onClick={async () => { await authClient.signOut(); setStatus({ type: 'idle' }); setEmail(''); setPassword(''); setName('') }}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      {status.type === 'error' && <p className="error">{status.message}</p>}
      {isSignUp && (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.type === 'loading'}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status.type === 'loading'}
          required
        />
      </div>
      <button type="submit" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <button type="button" className="toggle" onClick={() => setIsSignUp(!isSignUp)} disabled={status.type === 'loading'}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
    </form>
  )
}
