import { useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'

// Specialized Forms (Wheat)
import WheatStage1 from './forms/wheat/WheatStage1'
import WheatStage2 from './forms/wheat/WheatStage2'
import WheatStage3 from './forms/wheat/WheatStage3'
import WheatStage4 from './forms/wheat/WheatStage4'

/**
 * InspectionForm (Container)
 * 
 * Dynamically renders the correct specialized form based on URL parameters:
 * /inspection/:crop/:type/stage/:stageNumber
 */
export default function InspectionForm() {
  const { crop, type, stageNumber } = useParams()
  const stageNum = parseInt(stageNumber)

  // 1. Check for Wheat specialization
  if (crop?.toLowerCase() === 'wheat') {
    switch (stageNum) {
      case 1:  return <WheatStage1 stageNumber={1} />
      case 2:  return <WheatStage2 stageNumber={2} />
      case 3:  return <WheatStage3 stageNumber={3} />
      case 4:  return <WheatStage4 stageNumber={4} />
      default: return <DefaultFallback crop={crop} stage={stageNum} />
    }
  }

  // 2. Generic Fallback for other crops (Rice, Maize, etc.)
  return <DefaultFallback crop={crop} stage={stageNum} />
}

function DefaultFallback({ crop, stage }) {
  return (
    <AppLayout title={`Stage ${stage}: ${crop?.toUpperCase() || ''}`} showBack>
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <span className="text-4xl">🛠️</span>
        </div>
        <h2 className="text-2xl font-black text-text-primary mb-3">Specialized Form Coming Soon</h2>
        <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
          The specialized inspection fields for <strong>{crop || 'this crop'}</strong> are currently being developed. 
          Please check back later for the full data entry experience.
        </p>
      </div>
    </AppLayout>
  )
}
