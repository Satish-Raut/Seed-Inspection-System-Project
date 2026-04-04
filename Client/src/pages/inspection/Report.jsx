import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, AlertCircle, FileText, ArrowLeft, Download } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../hooks/useAuth'
import { useInspection } from '../../hooks/useInspection'
import { VERDICTS } from '../../utils/constants'
import { generateReport } from '../../utils/reportGenerator'

const VERDICT_CONFIG = {
  [VERDICTS.APPROVED]: { color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2, label: 'Approved' },
  [VERDICTS.PROVISIONAL_APPROVAL]: { color: '#F59E0B', bg: '#FFFBEB', icon: AlertCircle, label: 'Provisional Approval' },
  [VERDICTS.REJECTED]: { color: '#EF4444', bg: '#FEF2F2', icon: XCircle, label: 'Rejected' },
}

export default function FinalReport() {
  const { user }                                   = useAuth()
  const { current, completeInspection }            = useInspection()
  const navigate                                   = useNavigate()

  const [verdict, setVerdict]           = useState(VERDICTS.APPROVED)
  const [summaryNotes, setSummaryNotes] = useState('')
  const [submitted, setSubmitted]       = useState(false)

  const handleSubmit = () => {
    completeInspection(verdict, summaryNotes, user.id)
    setSubmitted(true)
    setTimeout(() => navigate('/reports'), 2000)
  }

  const handleDownload = () => {
    // Generate report with current local state (verdict + notes)
    const reportData = { ...current, verdict, summaryNotes }
    generateReport(reportData, current.stages, user)
  }

  const VerdictConfig = VERDICT_CONFIG[verdict]
  const VIcon = VerdictConfig.icon

  return (
    <AppLayout title="Final Report" showBack>
      {/* Back to stages link */}
      <div className="mb-6">
        <button onClick={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)} 
          className="flex items-center gap-2 text-text-secondary hover:text-primary font-bold text-sm transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Stages
        </button>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={40} className="text-success" />
          </div>
          <h2 className="text-xl font-extrabold text-text-primary mb-2">Report Saved!</h2>
          <p className="text-text-secondary text-sm">Redirecting to reports...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Inspection Summary */}
          <div className="bg-primary rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
            <p className="text-white/70 text-xs uppercase tracking-wider mb-2">Inspection Summary</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-white/60">Crop: </span><span className="font-bold capitalize">{current.cropType}</span></div>
              <div><span className="text-white/60">Type: </span><span className="font-bold capitalize">{current.productionType}</span></div>
              <div><span className="text-white/60">Stages: </span><span className="font-bold">{current.stages.length} / {current.totalStages}</span></div>
              <div><span className="text-white/60">Field: </span><span className="font-bold">{current.field?.fieldLocation || 'N/A'}</span></div>
            </div>
          </div>

          {/* Verdict Selection */}
          <div className="bg-white rounded-2xl p-5 border border-border">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-4">Select Verdict</h3>
            <div className="flex flex-col gap-2">
              {Object.entries(VERDICT_CONFIG).map(([val, cfg]) => {
                const Icon = cfg.icon
                return (
                  <button key={val} id={`verdict-${val.toLowerCase().replace(/ /g, '-')}`}
                    type="button" onClick={() => setVerdict(val)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      verdict === val ? 'shadow-md' : 'border-border hover:border-gray-200'
                    }`}
                    style={verdict === val ? { borderColor: cfg.color, background: cfg.bg } : {}}>
                    <Icon size={20} style={{ color: cfg.color }} />
                    <span className="font-semibold text-sm" style={{ color: verdict === val ? cfg.color : '#0F172A' }}>
                      {cfg.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected verdict display */}
          <div className="rounded-2xl p-4 border-2 flex items-center gap-3"
               style={{ borderColor: VerdictConfig.color, background: VerdictConfig.bg }}>
            <VIcon size={24} style={{ color: VerdictConfig.color }} />
            <div>
              <p className="text-xs font-medium" style={{ color: VerdictConfig.color }}>Final Decision</p>
              <p className="font-extrabold text-base" style={{ color: VerdictConfig.color }}>
                {VerdictConfig.label}
              </p>
            </div>
          </div>

          {/* Summary Notes */}
          <div className="bg-white rounded-2xl p-5 border border-border">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Inspector Summary Notes
            </label>
            <textarea id="summary-notes" value={summaryNotes} onChange={(e) => setSummaryNotes(e.target.value)}
              placeholder="Add final remarks, observations, and recommendations..."
              rows={4}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary
                         placeholder:text-text-muted focus:outline-none focus:ring-2
                         focus:ring-primary-mid resize-none transition-all" />
          </div>

          {/* Inspector info */}
          <div className="bg-white rounded-2xl p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-lighter rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Submitted by</p>
              <p className="font-bold text-text-primary text-sm">{user?.name}</p>
              <p className="text-primary text-xs font-semibold">{user?.inspectorId}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button id="btn-download-report" onClick={handleDownload}
              className="flex-1 bg-white border-2 border-emerald-500 text-emerald-600 font-bold py-4 rounded-2xl
                         flex items-center justify-center gap-2
                         hover:bg-emerald-50 active:scale-95 transition-all shadow-sm">
              <Download size={20} />
              Download Full Report PDF
            </button>
            <button id="btn-complete-inspection" onClick={handleSubmit}
              className="flex-2 bg-emerald-600 text-white font-bold py-4 rounded-2xl
                         flex items-center justify-center gap-2
                         hover:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-200">
              Complete & Save ✓
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
