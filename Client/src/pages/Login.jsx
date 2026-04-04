import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Leaf, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login, loading, error, clearError } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    clearError()
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form)
    if (result.success) navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 glow-green">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary text-sm mt-1">Sign in to your inspector account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/8 border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="bg-danger-bg border border-danger/20 text-danger text-sm
                              rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="inspector@example.com"
                required
                className="w-full border border-border rounded-xl px-4 py-3 text-sm
                           text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent
                           transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm
                             text-text-primary placeholder:text-text-muted
                             focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-transparent
                             transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary p-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl
                         hover:bg-primary-mid transition-all duration-300 glow-button
                         flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:text-primary-mid">
            Register here
          </Link>
        </p>
        <p className="text-center text-xs text-text-muted mt-3">
          <Link to="/" className="hover:text-primary">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
