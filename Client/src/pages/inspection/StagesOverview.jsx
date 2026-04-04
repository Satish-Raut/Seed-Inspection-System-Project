import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Circle, ArrowLeft, Download } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../hooks/useAuth'
import { useInspection } from '../../hooks/useInspection'
import { STAGES } from '../../utils/constants'
import { generateReport } from '../../utils/reportGenerator'

export default function StagesOverview() {
  const { crop: cropParam, type: typeParam } = useParams()
  const { user } = useAuth()
  const { current, isStageCompleted } = useInspection()
  const navigate = useNavigate()

  const displayCrop = cropParam || current.cropType || 'Not Set'
  const displayType = typeParam || current.productionType || ''

  const handleDownload = (e, stageNum) => {
    e.stopPropagation() // Prevent navigation
    generateReport(current, current.stages, user)
  }

  const stages = STAGES.slice(0, current.totalStages)
  const allDone = stages.every((s) => isStageCompleted(s.number))

  return (
    <AppLayout title="Inspection Stages" showBack>
      <div className="max-w-5xl mx-auto">
        {/* Crop + type info */}
        <div className="bg-primary rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-primary/20 gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Current Inspection</p>
            <p className="text-white font-black text-xl md:text-2xl capitalize mt-1">
              {displayCrop} · {displayType}
            </p>
          </div>
          <div className="text-center md:text-right bg-white/10 px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest">Overall Progress</p>
            <p className="text-white font-black text-2xl tracking-tighter">{current.stages.length} / {current.totalStages}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out border-r border-white/20 shadow-lg ${
                current.stages.length === current.totalStages ? 'bg-emerald-500' : 'bg-primary-mid'
              }`}
              style={{ width: `${(current.stages.length / current.totalStages) * 100}%` }}
            />
          </div>
          <p className="text-text-muted text-xs font-bold mt-3 text-right uppercase tracking-wider">
            {current.stages.length === current.totalStages ? '✅ All stages completed!' : `${current.totalStages - current.stages.length} stages remaining`}
          </p>
        </div>

        {/* Stage list */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-black text-text-primary uppercase tracking-widest">
            Select a stage to inspect
          </p>
          <span className="text-[10px] text-text-muted font-bold uppercase py-1 px-3 bg-gray-100 rounded-lg">
            {stages.length} Stages Total
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((stage) => {
            const done = isStageCompleted(stage.number)
            const isNext = !done && current.stages.length === stage.number - 1

            return (
              <div
                key={stage.number}
                id={`stage-${stage.number}`}
                onClick={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stage/${stage.number}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stage/${stage.number}`)
                  }
                }}
                role="button"
                tabIndex={0}
                className={`w-full text-left p-6 rounded-3xl border-2 flex items-center gap-5
                            transition-all duration-300 active:scale-[0.98] group cursor-pointer
                            ${done
                              ? 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50'
                              : isNext
                              ? 'border-primary bg-primary-lighter shadow-xl shadow-primary/10 hover:shadow-primary/20'
                              : 'border-border bg-white hover:border-primary-mid hover:shadow-lg'}`}
              >
                {/* Status icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-sm transform group-hover:rotate-6 transition-transform ${
                  done ? 'bg-emerald-500 text-white shadow-emerald-200' : isNext ? 'bg-primary text-white shadow-primary-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  {done ? <CheckCircle2 size={24} /> : stage.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      done ? 'bg-emerald-500 text-white' : 'bg-primary-mid text-white'
                    }`}>
                      Stage {stage.number}
                    </span>
                    {isNext && <span className="text-[10px] text-primary font-black uppercase tracking-widest animate-pulse">← Start Next</span>}
                  </div>
                  <h3 className={`font-black text-base tracking-tight ${done ? 'text-emerald-700' : isNext ? 'text-primary' : 'text-text-primary'}`}>
                    {stage.name}
                  </h3>
                  <p className="text-text-muted text-xs font-medium leading-relaxed mt-1">{done ? 'Completed Successfully ✓' : stage.description}</p>
                </div>

                <ChevronRight size={20} className={`shrink-0 transition-transform group-hover:translate-x-1 ${done ? 'text-emerald-400' : 'text-text-muted'}`} />

                {done && (
                  <button 
                    onClick={(e) => handleDownload(e, stage.number)}
                    className="ml-2 w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-600 
                               flex items-center justify-center hover:bg-emerald-50 transition-all active:scale-90"
                    title="Download Stage Report"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Form Actions */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(`/inspection/${current.id}/field`)}
            className="w-full md:w-auto md:px-10 px-10 py-5 rounded-3xl border-2 border-border text-text-secondary font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Farmer Registration
          </button>

          {allDone && (
            <button
              id="btn-generate-report"
              onClick={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/report`)}
              className="flex-1 w-full bg-emerald-600 text-white font-black py-5 rounded-3xl
                         flex items-center justify-center gap-3 text-lg
                         hover:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-200"
            >
              <CheckCircle2 size={24} />
              Finalize & Generate Report
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
