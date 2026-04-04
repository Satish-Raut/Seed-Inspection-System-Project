import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const DESIGNATIONS = ['Field Inspector', 'Senior Inspector', 'Regional Inspector', 'Chief Inspector']
const REGIONS = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone']

export default function Register() {
  const { register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', designation: '', region: '' })
  const [showPass, setShowPass] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    clearError()
    setLocalError('')
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setLocalError('Passwords do not match.')
    }
    if (form.password.length < 6) {
      return setLocalError('Password must be at least 6 characters.')
    }
    const result = await register(form)
    if (result.success) navigate('/dashboard', { replace: true })
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 glow-green">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">Create Account</h1>
          <p className="text-text-secondary text-sm mt-1">Register as a field inspector</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/8 border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
              <div className="bg-danger-bg border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">
                {displayError}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Name</label>
              <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your full name" required
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary
                           placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent transition-all" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Email Address</label>
              <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="inspector@example.com" required
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary
                           placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent transition-all" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number</label>
              <input id="reg-phone" type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 00000 00000"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary
                           placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent transition-all" />
            </div>

            {/* Designation + Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Designation</label>
                <select id="reg-designation" name="designation" value={form.designation} onChange={handleChange}
                  className="w-full border border-border rounded-xl px-3 py-3 text-sm text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-primary-mid bg-white">
                  <option value="">Select...</option>
                  {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Region</label>
                <select id="reg-region" name="region" value={form.region} onChange={handleChange}
                  className="w-full border border-border rounded-xl px-3 py-3 text-sm text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-primary-mid bg-white">
                  <option value="">Select...</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required
                  className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text-primary
                             placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary p-1">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Confirm Password</label>
              <input id="reg-confirm" type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} placeholder="Re-enter password" required
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary
                           placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent transition-all" />
            </div>

            {/* Submit */}
            <button id="reg-submit" type="submit" disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-2
                         hover:bg-primary-mid transition-all duration-300 glow-button
                         flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
              ) : (
                <>Create Inspector Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Inspector ID note */}
          <div className="mt-4 bg-primary-lighter rounded-xl p-3 border border-primary-light">
            <p className="text-primary text-xs font-medium text-center">
              🪪 Your Inspector ID will be auto-generated (e.g. INS-2026-001)
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:text-primary-mid">Sign in</Link>
        </p>

        <p className="text-center text-xs text-text-muted mt-3">
          <Link to="/" className="hover:text-primary">← Back to home</Link>
        </p>
        
      </div>
    </div>
  )
}
