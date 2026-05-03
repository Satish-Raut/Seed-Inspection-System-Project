import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Flower, 
  Info
} from 'lucide-react'
import AppLayout from '../../../../components/AppLayout'
import { useInspection } from '../../../../hooks/useInspection'
import { 
  Slider, Toggle, TextInput, NumberInput, SectionHeader, FormActions 
} from '../../../../components/FormComponents'

export default function WheatStage2({ stageNumber = 2 }) {
  const { current, submitStage } = useInspection()
  const navigate = useNavigate()

  const existingData = current?.stages?.find(s => s.stageNumber === stageNumber)?.formData || {}

  const [form, setForm] = useState({
    morphologicalDeviationCount: existingData.morphologicalDeviationCount || '',
    awnLengthVariation: existingData.awnLengthVariation || '',
    spikeDensityVariation: existingData.spikeDensityVariation || '',
    floweringSynchrony: existingData.floweringSynchrony || 85,
    objectionableWeeds: existingData.objectionableWeeds || false,
    pollenShedding: existingData.pollenShedding || '',
    offTypesCount: existingData.offTypesCount || '',
    rustSymptoms: existingData.rustSymptoms || false,
    smutSymptoms: existingData.smutSymptoms || false,
    blightPresence: existingData.blightPresence || false,
    infectionSeverity: existingData.infectionSeverity || 5,
    notes: existingData.notes || current?.stages?.find(s => s.stageNumber === stageNumber)?.notes || '',
  })

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submitStage(stageNumber, form)
    navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)
  }

  const getRecommendation = () => {
    if (form.infectionSeverity <= 10) return {
      label: 'Low: Continue standard monitoring protocol.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100'
    }
    if (form.infectionSeverity <= 30) return {
      label: 'Moderate: Increase inspection frequency.',
      color: 'text-amber-600',
      bg: 'bg-amber-50/50',
      border: 'border-amber-100'
    }
    return {
      label: 'Critical: Remedial action required immediately.',
      color: 'text-red-600',
      bg: 'bg-red-50/50',
      border: 'border-red-100'
    }
  }

  const recommendation = getRecommendation()

  return (
    <AppLayout title="Stage 2: Flowering Inspection" showBack>
      <div className="max-w-6xl mx-auto px-1">
        <p className="text-text-secondary text-sm mb-8">Flowering stage assessment</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 items-start">
            
            {/* Column 1: Off-Types */}
            <div className="flex flex-col gap-12">
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-8 transition-all">
                <SectionHeader title="Off-Types & Roguing" />

                <TextInput 
                  label="Morphological Deviation Count" 
                  name="morphologicalDeviationCount" 
                  value={form.morphologicalDeviationCount} 
                  onChange={handleChange} 
                  placeholder="Number of off-type plants" 
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="Awn Length Var." name="awnLengthVariation" value={form.awnLengthVariation} onChange={handleChange} placeholder="Count" />
                  <TextInput label="Spike Density Var." name="spikeDensityVariation" value={form.spikeDensityVariation} onChange={handleChange} placeholder="Count" />
                </div>

                <NumberInput label="Flowering Synchrony (%)" name="floweringSynchrony" value={form.floweringSynchrony} onChange={handleChange} placeholder="Percentage" max="100" />

                <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border border-gray-100">
                  <Toggle label="Objectionable Weeds Present" name="objectionableWeeds" checked={form.objectionableWeeds} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <NumberInput label="Pollen Shedding (%)" name="pollenShedding" value={form.pollenShedding} onChange={handleChange} placeholder="e.g. 0.05" required />
                  <NumberInput label="Off-Types Count" name="offTypesCount" value={form.offTypesCount} onChange={handleChange} placeholder="e.g. 2" required />
                </div>
              </div>
            </div>

            {/* Column 2: Diseases */}
            <div className="flex flex-col gap-12">
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-8">
                <SectionHeader title="Disease Monitoring" />
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Rust Symptoms" name="rustSymptoms" checked={form.rustSymptoms} onChange={handleChange} />
                  </div>
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Smut Symptoms" name="smutSymptoms" checked={form.smutSymptoms} onChange={handleChange} />
                  </div>
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Blight Presence" name="blightPresence" checked={form.blightPresence} onChange={handleChange} />
                  </div>
                </div>
                <Slider label="Infection Severity" name="infectionSeverity" value={form.infectionSeverity} onChange={handleChange} />
                <div className={`mt-2 rounded-[1.5rem] p-6 border ${recommendation.border} ${recommendation.bg} flex flex-col gap-1 transition-all duration-500`}>
                  <h4 className={`font-bold text-[15px] ${recommendation.color}`}>Recommendation Issued</h4>
                  <p className={`${recommendation.color} opacity-80 text-xs font-semibold`}>{recommendation.label}</p>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm">
                <label className="block text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Info size={18} className="text-primary" />
                   Field Observations
                </label>
                <textarea 
                  name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Record flowering pattern details or specific pest/disease observations..."
                  rows={4}
                  className="w-full border border-border/80 rounded-2xl px-5 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-mid resize-none bg-gray-50/10 transition-all" 
                />
              </div>
            </div>
          </div>

          <FormActions submitText="Submit Stage 2 & Continue" onBack={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)} stageNumber={stageNumber} />
        </form>
      </div>
    </AppLayout>
  )
}
