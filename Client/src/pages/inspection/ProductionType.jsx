import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import { useInspection } from '../../hooks/useInspection'
import { PRODUCTION_TYPES } from '../../utils/constants'

export default function ProductionType() {
  const { current, setProductionType, syncInspectionToDatabase } = useInspection()
  const navigate = useNavigate()

  const handleSelect = async (type) => {
    // 1. Update Context State
    setProductionType(type.id, type.stages)
    
    try {
      // 2. We now have all the required data! Sync it to the backend Database.
      // We pass overrides to ensure the backend gets the data exactly as clicked,
      // bypassing any React state batching delays.
      const dbId = await syncInspectionToDatabase(type.id, type.stages)

      const crop = current.cropType || 'wheat'
      
      // 3. Navigate to the dynamic Stages Overview using the REAL DB ID
      navigate(`/inspection/${dbId}/${crop}/${type.id}/stages`)
    } catch (error) {
      const backendMessage = error.response?.data?.error || error.message;
      alert(`Failed to create inspection: ${backendMessage}`);
      console.error("Full Error Output: ", error.response || error);
    }
  }

  return (
    <AppLayout title="Production Type" showBack>
      <p className="text-text-secondary text-sm mb-6">
        Select the seed production method to determine the number of inspection stages.
      </p>

      <div className="flex flex-col gap-4">
        {PRODUCTION_TYPES.map((type) => {
          const isSelected = current.productionType === type.id
          return (
            <button
              key={type.id}
              id={`production-${type.id}`}
              onClick={() => handleSelect(type)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
                          active:scale-98 flex items-center gap-4
                          ${isSelected
                            ? 'border-primary bg-primary-lighter shadow-lg shadow-primary/15'
                            : 'border-border bg-white hover:border-primary-mid hover:shadow-md'}`}
            >
              <div className="text-3xl">{type.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-base ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {type.label}
                  </h3>
                  {isSelected && <CheckCircle2 size={16} className="text-primary" />}
                </div>
                <p className="text-text-secondary text-sm mt-0.5">{type.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: type.stages }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${isSelected ? 'bg-primary' : 'bg-border'}`}
                    />
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info note */}
      <div className="mt-6 bg-accent-blue/10 border border-accent-blue/20 rounded-2xl p-4">
        <p className="text-accent-blue text-xs font-medium">
          ℹ️ <strong>Hybrid</strong> varieties require 4 inspection stages.{' '}
          <strong>Non-Hybrid</strong> requires 3 stages.
        </p>
      </div>
    </AppLayout>
  )
}
