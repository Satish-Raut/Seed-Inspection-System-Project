import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Leaf, Settings } from 'lucide-react'
import BottomNav from './BottomNav'
import { useAuth } from '../hooks/useAuth'
import { useInspection } from '../hooks/useInspection'

/**
 * AppLayout — shell for all app pages (after login)
 * Props:
 *   title       — header title text
 *   showBack    — show back arrow (default false)
 *   showSettings— show settings gear icon (default false)
 *   noPadding   — remove bottom safe-area padding (for full-bleed pages)
 *   children
 */
export default function AppLayout({
  title,
  showBack = false,
  showSettings = false,
  noPadding = false,
  children,
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { current, startNewInspection } = useInspection()

  const handleInspectionNav = () => {
    if (current.id) {
       // If in progress, go to stages overview
       const crop = current.cropType || 'wheat'
       const type = current.productionType || 'hybrid'
       navigate(`/inspection/${current.id}/${crop}/${type}/stages`)
    } else {
       // Start new session
       const newInsp = startNewInspection()
       navigate(`/inspection/${newInsp.id}/crop`)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center">
      {/* ── Internal App Shell ── */}
      <div className="w-full max-w-[430px] md:max-w-7xl min-h-screen flex flex-col relative bg-app-bg md:bg-transparent">


        {/* ── Desktop Top Navbar ── */}
        <header className="hidden md:flex sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-8 h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            {showBack && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2.5 -ml-4 rounded-xl text-text-secondary hover:bg-gray-100 hover:text-primary transition-all flex items-center justify-center group"
                title="Go Back"
              >
                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-md">
                <Leaf size={18} fill="currentColor" />
              </div>
              <span className="font-black text-lg text-text-primary tracking-tight">SeedInspect Pro</span>
            </button>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  window.location.pathname === '/dashboard' ? 'text-primary bg-primary-lighter' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={handleInspectionNav}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  window.location.pathname.startsWith('/inspection') ? 'text-primary bg-primary-lighter' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Inspection
              </button>
              <button
                onClick={() => navigate('/reports')}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  window.location.pathname === '/reports' ? 'text-primary bg-primary-lighter' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Reports
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/settings')} className="p-2 rounded-xl text-text-secondary hover:bg-gray-100 transition-all">
                <Settings size={20} />
             </button>
             <div className="w-10 h-10 rounded-full bg-primary-lighter border border-primary-light flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0)}
             </div>
          </div>
        </header>

        {/* ── Mobile Header Bar (Only visible < md) ── */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between
                           px-4 h-14 bg-primary shadow-md shadow-primary/20">
          {/* Left: back button or leaf logo */}
          <div className="w-9">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white
                           hover:bg-white/10 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
            )}
          </div>

          {/* Center: title */}
          <h1 className="text-white font-semibold text-base tracking-wide truncate px-2">
            {title}
          </h1>

          {/* Right: settings or empty */}
          <div className="w-9">
            {showSettings && (
              <button
                onClick={() => navigate('/settings')}
                className="p-1.5 rounded-lg text-white/80 hover:text-white
                           hover:bg-white/10 transition-all"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </header>


        {/* ── Page Content ── */}
        <main className={`flex-1 overflow-y-auto ${noPadding ? '' : 'pb-24 px-4 pt-4 md:pt-8 md:px-8'}`}>

          {children}
        </main>

        {/* ── Bottom Navigation ── */}
        <BottomNav />
      </div>
    </div>
  )
}
