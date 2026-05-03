import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle2, XCircle, Plus, Play, FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { useInspection } from '../hooks/useInspection'

function StatCard({ icon: Icon, count, label, color, bg }) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-2xl" style={{ background: bg }}>
      <Icon size={22} style={{ color }} />
      <span className="text-2xl font-extrabold" style={{ color }}>{count}</span>
      <span className="text-xs text-text-secondary font-medium">{label}</span>
    </div>
  )
}

export default function Dashboard() {
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  
  const { 
    startNewInspection, 
    inspections, 
    fetchInspections, 
    resumeInspection,
    loading, 
    current 
  } = useInspection()
  
  const navigate = useNavigate()

  useEffect(() => {
    fetchInspections();
  }, [])

  const safeInspections = Array.isArray(inspections) ? inspections : [];

  const pending = safeInspections.filter((i) => i.status === 'In Progress').length
  const completed = safeInspections.filter((i) => i.status === 'Completed').length
  const rejected = safeInspections.filter((i) => i.status === 'Rejected').length

  const handleStartNew = async () => {
    try {
      const realInstanceId = await startNewInspection()
      navigate(`/inspection/${realInstanceId}/field`)
    } catch(err) {
      alert("Failed to initialize a new inspection session. Check connection.");
    }
  }

  const handleResume = (insp) => {
    resumeInspection(insp);
    const crop = insp.cropType || 'wheat';
    const prod = insp.productionType || 'Hybrid';
    // If field registration is completely unstarted, we could bounce them to /field, 
    // but the system naturally creates the row inside Stages.
    const dest = insp.field || insp.fieldRegistration 
                 ? `/inspection/${insp.id}/${crop}/${prod}/stages` 
                 : `/inspection/${insp.id}/field`;
    navigate(dest);
  }

  const INITIAL_DISPLAY_COUNT = 6;
  const recentInspections = showAll ? safeInspections : safeInspections.slice(0, INITIAL_DISPLAY_COUNT);

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <AppLayout title="Inspection Dashboard" showSettings showBack backUrl="/">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Main Content Column ── */}
        <div className="flex-1">
          {/* Greeting */}
          <div className="mb-8">
            <p className="text-text-muted text-sm">{greeting()},</p>
            <h2 className="text-2xl md:text-3xl font-black text-text-primary">{user?.name}</h2>
            <div className="inline-flex items-center gap-1.5 mt-2 bg-primary-lighter
                            px-3 py-1 rounded-full border border-primary-light">
              <span className="w-2 h-2 rounded-full bg-primary-mid" />
              <span className="text-primary text-sm font-bold tracking-tight">{user?.inspectorId}</span>
            </div>
          </div>

          {/* Stat Cards — Today's Overview */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-widest">
              Today's Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={Clock} count={pending} label="Pending" color="#F59E0B" bg="#FFFBEB" />
              <StatCard icon={CheckCircle2} count={completed} label="Completed" color="#10B981" bg="#ECFDF5" />
              <StatCard icon={XCircle} count={rejected} label="Rejected" color="#EF4444" bg="#FEF2F2" />
            </div>
          </div>

          {/* Recent Inspections */}
          {recentInspections.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                  Recent Activity
                </h3>
                <button onClick={() => navigate('/reports')} className="text-primary text-xs font-bold hover:underline">
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {recentInspections.map((insp) => (
                  <div
                    key={insp.id}
                    onClick={() => handleResume(insp)}
                    className="bg-white rounded-[1.5rem] p-5 border border-border flex items-center justify-between transition-all cursor-pointer hover:border-primary-mid hover:shadow-md group active:scale-[0.98]"
                  >
                    <div>
                      <div className="font-bold text-text-primary text-base capitalize">{insp.cropType}</div>
                      <div className="text-text-muted text-xs capitalize font-medium">{insp.productionType} • {new Date(insp.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${insp.status === 'Completed' ? 'bg-success-bg text-success' :
                          insp.status === 'Rejected' ? 'bg-danger-bg text-danger' :
                            'bg-warning-bg text-warning'
                        }`}>
                        {insp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {safeInspections.length > INITIAL_DISPLAY_COUNT && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2 text-primary font-bold text-xs py-2 px-4 rounded-xl border border-primary-light bg-primary-lighter hover:bg-primary-light transition-colors"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp size={16} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Show More ({safeInspections.length - INITIAL_DISPLAY_COUNT} others)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {safeInspections.length === 0 && (
            <div className="bg-white rounded-3xl p-12 border border-border text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h4 className="text-text-primary text-xl font-bold">No inspections yet</h4>
              <p className="text-text-muted text-sm mt-2 max-w-xs mx-auto">
                Your dashboard looks fresh! Start a new inspection to begin tracking seed quality.
              </p>
            </div>
          )}
        </div>

        {/* ── Sidebar Action Column ── */}
        <div className="lg:w-80 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-widest">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button
                id="btn-start-inspection"
                onClick={handleStartNew}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl
                           flex items-center justify-center gap-2
                           hover:bg-primary-mid active:scale-95 transition-all glow-button"
              >
                <Plus size={20} />
                Start New Inspection
              </button>

              {pending > 0 && (
                <button
                  id="btn-resume-inspection"
                  onClick={() => {
                     const mostRecentPending = safeInspections.find(i => i.status === 'In Progress');
                     if (mostRecentPending) handleResume(mostRecentPending);
                  }}
                  className="w-full bg-white border-2 border-primary text-primary font-bold py-4 rounded-2xl
                             flex items-center justify-center gap-2
                             hover:bg-primary-lighter active:scale-95 transition-all text-sm"
                >
                  <Play size={18} />
                  Resume Active Inspection
                </button>
              )}

              <button
                id="btn-view-reports"
                onClick={() => navigate('/reports')}
                className="w-full bg-white border border-border text-text-secondary font-semibold py-4 rounded-2xl
                           flex items-center justify-center gap-2
                           hover:border-primary hover:text-primary active:scale-95 transition-all"
              >
                <FileText size={18} />
                View All Reports
              </button>
            </div>
          </div>

          {/* Help box */}
          <div className="bg-primary-lighter p-6 rounded-3xl border border-primary-light">
            <h4 className="text-primary font-bold text-sm mb-1">Need help?</h4>
            <p className="text-primary/70 text-xs leading-relaxed">
              Access the training manual or contact support for field assistance.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
