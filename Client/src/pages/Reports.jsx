import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle2, XCircle, Clock, ChevronRight, 
  ArrowLeft, Download, Calendar, MapPin, 
  Layers, User, Tag, Sparkles, Play
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { useInspection } from '../hooks/useInspection'
import { CROP_TYPES } from '../utils/constants'
import { generateReport } from '../utils/reportGenerator'

const statusConfig = {
  'Completed': { label: 'Approved', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
  'Rejected':  { label: 'Rejected', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
  'In Progress':{ label: 'In Progress', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
}

export default function Reports() {
  const { user } = useAuth()
  const { inspections, fetchInspections, resumeInspection } = useInspection()
  const navigate = useNavigate()
  const [selectedInspection, setSelectedInspection] = useState(null)

  useEffect(() => {
    fetchInspections()
  }, [])

  const safeInspections = Array.isArray(inspections) ? inspections : [];
  const completed = safeInspections.filter((i) => i.status !== 'In Progress' || i.stages?.length > 0)

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const getCropEmoji = (cropId) => CROP_TYPES.find((c) => c.id === cropId)?.emoji || '🌾'

  const handleDownload = async (e, insp) => {
    e.stopPropagation()
    await generateReport(insp, insp.stages, user)
  }

  const handleResume = (e, insp) => {
    e.stopPropagation();
    resumeInspection(insp);
    const crop = insp.cropType || 'wheat';
    const prod = insp.productionType || 'Hybrid';
    const dest = insp.field || insp.fieldRegistration 
                 ? `/inspection/${insp.id}/${crop}/${prod}/stages` 
                 : `/inspection/${insp.id}/field`;
    navigate(dest);
  }

  if (selectedInspection) {
    return (
      <ReportDetailOverlay 
        inspection={selectedInspection} 
        onClose={() => setSelectedInspection(null)} 
        onDownload={(e) => handleDownload(e, selectedInspection)}
        onResume={(e) => handleResume(e, selectedInspection)}
        formatDate={formatDate}
        getCropEmoji={getCropEmoji}
      />
    )
  }

  return (
    <AppLayout title="Inspection Reports">
      <div className="max-w-5xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Inspections', count: completed.length, color: '#475569', icon: Clock },
            { label: 'Approved Seeds', count: completed.filter((i) => i.status === 'Completed').length, color: '#10B981', icon: CheckCircle2 },
            { label: 'Rejected Batches', count: completed.filter((i) => i.status === 'Rejected').length, color: '#EF4444', icon: XCircle },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-6 border border-border flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-inner" style={{ background: `${s.color}15` }}>
                 <s.icon size={24} style={{ color: s.color }} />
              </div>
              <p className="text-3xl font-black tracking-tighter" style={{ color: s.color }}>{s.count}</p>
              <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Detailed History</h3>
          <span className="text-[10px] text-text-muted font-bold uppercase py-1 px-3 bg-gray-100 rounded-lg">
            {completed.length} Records Found
          </span>
        </div>

        {completed.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 border border-border text-center shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <h4 className="text-text-primary text-xl font-bold italic">No reports found</h4>
            <p className="text-text-muted text-sm mt-3 max-w-xs mx-auto leading-relaxed">
              Start a new inspection to see your professional records and PDF archives here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {completed.map((insp) => (
              <ReportCard key={insp.id} inspection={insp} onClick={() => setSelectedInspection(insp)} 
                formatDate={formatDate} getCropEmoji={getCropEmoji} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function ReportCard({ inspection, onClick, formatDate, getCropEmoji }) {
  const sc = statusConfig[inspection.status] || statusConfig['In Progress']
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[2rem] p-6 border border-border shadow-sm
                 hover:shadow-xl hover:border-primary-mid/30 transition-all flex flex-col sm:flex-row items-center gap-6 group cursor-pointer active:scale-[0.98]"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-primary-lighter transition-all duration-300">
        {getCropEmoji(inspection.cropType)}
      </div>

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-text-primary text-xl md:text-2xl capitalize truncate tracking-tighter">
            {inspection.cropType} · <span className="text-primary">{inspection.productionType}</span>
          </h3>
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm self-center sm:self-start"
                style={{ background: sc.bg, color: sc.color }}>
            {inspection.verdict || sc.label}
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-5 gap-y-2 mt-4 text-text-muted text-[11px] font-bold uppercase tracking-wider">
           <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary-mid/50" /> {formatDate(inspection.completedAt || inspection.createdAt)}</span>
           <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary-mid/50" /> {inspection.field?.fieldLocation || 'Remote Field'}</span>
           <span className="flex items-center gap-1.5"><Layers size={14} className="text-primary-mid/50" /> {inspection.stages?.length || 0} / {inspection.totalStages} Stages</span>
        </div>
      </div>

      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
        <ChevronRight size={22} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  )
}

function ReportDetailOverlay({ inspection, onClose, onDownload, onResume, formatDate, getCropEmoji }) {
  const sc = statusConfig[inspection.status] || statusConfig['In Progress']

  return (
    <AppLayout title={`Inspection: ${String(inspection.id || '').slice(-8) || ''}`} showBack>
      <div className="max-w-4xl mx-auto pb-10">
        <button onClick={onClose} className="mb-6 flex items-center gap-2 text-text-secondary hover:text-primary font-bold text-sm transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Reports
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] border border-border shadow-md overflow-hidden mb-8">
          <div className="bg-primary p-8 text-white relative">
             <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
             <div className="flex items-center gap-6 relative z-10">
               <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] backdrop-blur-md flex items-center justify-center text-5xl">
                 {getCropEmoji(inspection.cropType)}
               </div>
               <div className="flex-1">
                 <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Detailed Inspection Profile</p>
                 <h2 className="text-3xl font-black tracking-tight capitalize select-none">{inspection.cropType} · {inspection.productionType}</h2>
                 <div className="flex items-center gap-3 mt-4">
                   <span className="px-5 py-1.5 bg-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg" style={{ color: sc.color }}>
                     {inspection.verdict || sc.label}
                   </span>
                   <span className="text-[11px] font-bold text-white/80">{formatDate(inspection.completedAt || inspection.createdAt)}</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoItem icon={User} label="Inspector" value={inspection.inspectorId || 'Satish Raut'} subValue="Lead Seed Auditor" />
            <InfoItem icon={MapPin} label="Field Location" value={inspection.field?.fieldLocation || 'kbkb'} subValue="Geotagged & Verified" />
            <InfoItem icon={Tag} label="Seed Source" value={inspection.field?.tagNumber || 'N/A'} subValue={`Variety: ${inspection.field?.varietyName || 'Wheat-Hybrid'}`} />
            <InfoItem icon={Sparkles} label="Assessment" value={`${inspection.stages?.length || 0} Stages`} subValue="Genetic Purity Verified" />
          </div>
        </div>

        {/* Stages Detail */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] mb-2 px-2 flex items-center gap-3">
             <Layers className="text-primary" size={18} />
             Lifecycle Summary
          </h3>
          {inspection.stages?.map((stage, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-border shadow-sm p-6 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                      {stage.stageNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-lg">
                        {stage.stageNumber === 1 ? 'Vegetative' : stage.stageNumber === 2 ? 'Flowering' : 'Pre-Harvest'} Inspection
                      </h4>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Completed on {new Date(stage.timestamp).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-dashed border-border pt-6">
                {Object.entries(stage.data || {}).filter(([k,v]) => typeof v !== 'object').slice(0, 6).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm font-black text-text-primary mt-0.5">{value === true ? 'Yes' : value === false ? 'No' : value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          {inspection.status === 'In Progress' && (
             <button onClick={onResume} className="w-full sm:flex-1 bg-primary text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-primary-mid active:scale-95 transition-all shadow-lg glow-button">
                <Play fill="currentColor" size={20} />
                Resume Active Inspection
             </button>
          )}
          <button onClick={onDownload} className="w-full sm:flex-1 bg-white border-2 border-primary text-primary font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-primary-lighter active:scale-95 transition-all shadow-md">
            <Download size={24} />
            Archive PDF Report
          </button>
          <button onClick={onClose} className="w-full sm:flex-1 bg-gray-900 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-black active:scale-95 transition-all shadow-xl shadow-gray-200">
            Close Viewer
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

function InfoItem({ icon: Icon, label, value, subValue }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-mid shrink-0 border border-gray-100">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-2">{label}</p>
        <p className="text-lg font-black text-text-primary truncate">{value}</p>
        {subValue && <p className="text-xs font-bold text-primary truncate mt-0.5">{subValue}</p>}
      </div>
    </div>
  )
}
