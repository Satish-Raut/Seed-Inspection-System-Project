import { useAuth } from '../hooks/useAuth'
import { User, Mail, Briefcase, MapPin, BadgeCheck, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <AppLayout title="My Profile" hideBackButton>
      <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary mb-1">My Profile</h1>
            <p className="text-text-secondary">Manage your inspector account details</p>
          </div>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-text-primary hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-1 md:p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border">
          <div className="bg-gray-50/50 rounded-[22px] md:rounded-[28px] overflow-hidden">
            
            {/* Top Banner Area */}
            <div className="h-32 bg-gradient-to-r from-primary to-primary-mid relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            </div>

            {/* Avatar & Main Info */}
            <div className="px-6 md:px-10 pb-8 relative -mt-16">
              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                {/* Avatar Circle */}
                <div className="w-32 h-32 rounded-2xl bg-white border-[6px] border-white shadow-xl flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary-lighter/20 rounded-xl group-hover:bg-primary-lighter/40 transition-colors"></div>
                  <span className="text-6xl font-black text-primary relative z-10">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </span>
                  {/* Verified Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary z-20">
                    <BadgeCheck size={24} fill="currentColor" className="text-blue-500" />
                  </div>
                </div>

                <div className="flex-1 pb-2">
                  <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-1">{user.name}</h2>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Briefcase size={16} /> 
                    <span>{user.designation || 'Agricultural Inspector'}</span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Info Block */}
                <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1 text-text-muted">
                    <BadgeCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Inspector ID</span>
                  </div>
                  <p className="text-lg font-extrabold text-text-primary font-mono ml-7">
                    {user.inspectorId}
                  </p>
                </div>

                <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1 text-text-muted">
                    <Mail size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Email Address</span>
                  </div>
                  <p className="text-lg font-bold text-text-primary ml-7 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1 text-text-muted">
                    <MapPin size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Assigned Region</span>
                  </div>
                  <p className="text-lg font-bold text-text-primary ml-7">
                    {user.region || 'Not Assigned'}
                  </p>
                </div>

                <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1 text-text-muted">
                    <User size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Account Role</span>
                  </div>
                  <p className="text-lg font-bold text-text-primary ml-7 capitalize">
                    {user.role || 'Inspector'}
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
