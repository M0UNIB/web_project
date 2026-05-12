import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import StatusAlert from '../components/StatusAlert'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function RegisterPage() {
  const navigate = useNavigate()
  const { persistAuth, isAuthenticated } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
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
      const { data } = await api.post('/register', form)
      persistAuth(data.token, data.user)
      navigate('/notes')
    } catch (error) {
      const validationErrors = error.response?.data?.errors
      const message = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : 'Unable to create the account right now.'

      setFeedback({
        status: 'error',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel--accent">
        <p className="eyebrow">Project-ready stack</p>
        <h1>Laravel API. React interface. Fast personal notes.</h1>
        <p>
          Create an account and start organizing tasks with priority badges, instant
          updates, and protected routes.
        </p>
      </section>

      <section className="auth-panel">
        <StatusAlert {...feedback} onClose={() => setFeedback({ status: 'success', message: '' })} />

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Get started</p>
              <h2>Register</h2>
            </div>
          </div>

          <label>
            <span>Username</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>

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
              minLength="8"
              required
            />
          </label>

          <label>
            <span>Confirm password</span>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              minLength="8"
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already registered? <Link to="/login">Go to login</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
