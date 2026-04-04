import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ClipboardList, FileText, Settings } from 'lucide-react'
import { useInspection } from '../hooks/useInspection'

export default function BottomNav() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()
  const { current, startNewInspection } = useInspection()

  const tabs = [
    { label: 'Home',       icon: Home,          path: '/dashboard' },
    { label: 'Inspection', icon: ClipboardList,  path: '/inspection' },
    { label: 'Reports',    icon: FileText,       path: '/reports' },
    { label: 'Settings',   icon: Settings,       path: '/settings' },
  ]

  const isActive = (path) => {
    if (path === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(path)
  }

  const handleNav = (tab) => {
    if (tab.label === 'Inspection') {
       if (current.id) {
         const crop = current.cropType || 'wheat'
         const type = current.productionType || 'hybrid'
         navigate(`/inspection/${current.id}/${crop}/${type}/stages`)
       } else {
         const newInsp = startNewInspection()
         navigate(`/inspection/${newInsp.id}/crop`)
       }
    } else {
      navigate(tab.path)
    }
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:hidden
                    bg-white border-t border-gray-100 z-40
                    flex items-center justify-around px-2 pb-safe"
         style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
      {tabs.map((tab) => {
        const active = isActive(tab.path)
        const Icon = tab.icon
        return (
          <button
            key={tab.label}
            id={`nav-${tab.label.toLowerCase()}`}
            onClick={() => handleNav(tab)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl
                        transition-all duration-200 min-w-[60px] relative
                        ${active ? 'text-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            {/* Active indicator dot */}
            {active && (
              <span className="absolute top-1 left-1/2 -translate-x-1/2
                               w-1 h-1 rounded-full bg-primary" />
            )}
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              className={active ? 'text-primary' : 'text-text-muted'}
            />
            <span className={`text-[10px] font-semibold tracking-wide ${
              active ? 'text-primary' : 'text-text-muted'
            }`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
