import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Award, LogOut, ChevronRight, Shield } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-border last:border-0">
      <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center shrink-0">
        <Icon size={15} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-muted text-[11px] font-medium">{label}</p>
        <p className="text-text-primary text-sm font-semibold truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <AppLayout title="Settings">
      {/* Profile Header */}
      <div className="bg-primary rounded-2xl p-5 mb-5 flex items-center gap-4 shadow-lg shadow-primary/20">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || 'I'}
        </div>
        <div>
          <h2 className="text-white font-extrabold text-lg leading-tight">{user?.name}</h2>
          <p className="text-white/70 text-sm">{user?.designation || 'Field Inspector'}</p>
          <div className="inline-flex items-center gap-1.5 mt-1.5 bg-white/15 px-2.5 py-0.5 rounded-full">
            <Shield size={11} className="text-emerald-300" />
            <span className="text-emerald-300 text-[11px] font-bold">{user?.inspectorId}</span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl px-4 border border-border mb-4 shadow-sm">
        <InfoRow icon={User}   label="Full Name"    value={user?.name} />
        <InfoRow icon={Mail}   label="Email"        value={user?.email} />
        <InfoRow icon={Phone}  label="Phone"        value={user?.phone} />
        <InfoRow icon={MapPin} label="Region"       value={user?.region} />
        <InfoRow icon={Award}  label="Designation"  value={user?.designation} />
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl px-4 border border-border mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider py-3">Account</h3>
        <div className="flex items-center gap-3 py-3.5">
          <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center">
            <Shield size={15} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-text-muted text-[11px] font-medium">Inspector ID</p>
            <p className="text-primary font-bold text-sm">{user?.inspectorId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3.5 border-t border-border">
          <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center">
            <Award size={15} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-text-muted text-[11px] font-medium">Role</p>
            <p className="text-text-primary font-semibold text-sm capitalize">{user?.role || 'Inspector'}</p>
          </div>
        </div>
      </div>

      {/* App version */}
      <div className="bg-primary-lighter rounded-2xl p-4 border border-primary-light mb-4 text-center">
        <p className="text-primary text-xs font-semibold">SeedInspect Pro · v1.0.0</p>
        <p className="text-primary/70 text-[11px] mt-0.5">Patent Pending · Achyuttam Research</p>
      </div>

      {/* Logout */}
      <button id="btn-logout" onClick={handleLogout}
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl
                   border-2 border-danger/20 text-danger hover:bg-danger-bg
                   transition-all active:scale-95">
        <div className="flex items-center gap-3">
          <LogOut size={18} />
          <span className="font-bold text-sm">Sign Out</span>
        </div>
        <ChevronRight size={16} />
      </button>
    </AppLayout>
  )
}
