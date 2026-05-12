import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import StatusAlert from '../components/StatusAlert'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function LoginPage() {
  const navigate = useNavigate()
  const { persistAuth, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [feedback, setFeedback] = useState({ status: 'success', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback({ status: 'success', message: '' })

    try {
      const { data } = await api.post('/login', form)
      persistAuth(data.token, data.user)
      navigate('/notes')
    } catch (error) {
      setFeedback({
        status: 'error',
        message: error.response?.data?.message || 'Unable to sign in. Check your credentials.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel--accent">
        <p className="eyebrow">Personal Notes Manager</p>
        <h1>Capture ideas before they disappear.</h1>
        <p>
          Sign in to manage your reminders, class tasks, and personal notes in one
          responsive workspace.
        </p>
      </section>

      <section className="auth-panel">
        <StatusAlert {...feedback} onClose={() => setFeedback({ status: 'success', message: '' })} />

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2>Login</h2>
            </div>
          </div>

          <label>
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
