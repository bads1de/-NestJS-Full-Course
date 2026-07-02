import LoginForm from './components/LoginForm'
import './App.css'

function App() {
  const handleLogin = (email: string, password: string) => {
    console.log('login:', { email, password })
  }

  return (
    <div className="app">
      <LoginForm onLogin={handleLogin} />
    </div>
  )
}

export default App
