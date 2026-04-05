import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ClipboardCheck, Tractor, Droplets, 
  CheckCircle2, Info, TrendingUp, TrendingDown, Sparkles
} from 'lucide-react'
import AppLayout from '../../../../components/AppLayout'
import { useInspection } from '../../../../hooks/useInspection'
import { 
  Slider, Toggle, TextInput, SectionHeader, FormActions 
} from '../../../../components/FormComponents'

export default function WheatStage3({ stageNumber = 3 }) {
  const { current, submitStage } = useInspection()
  const navigate = useNavigate()

  const existingData = current?.stages?.find(s => s.stageNumber === stageNumber)?.formData || {}

  const [form, setForm] = useState({
    // Section A: Re-verification
    roguingDone: existingData.roguingDone || false,
    offTypesRemaining: existingData.offTypesRemaining || '',
    weedsRemoved: existingData.weedsRemoved || false,
    diseasedHeadsRemoved: existingData.diseasedHeadsRemoved || false,
    
    // Section B: Harvest Advisory
    maturityUniformity: existingData.maturityUniformity || 85,
    moistureEstimation: existingData.moistureEstimation || '12.5',
    equipmentCleaned: existingData.equipmentCleaned || false,
    separateThreshing: existingData.separateThreshing || false,
    yieldEstimation: existingData.yieldEstimation || '',
    notes: existingData.notes || current?.stages?.find(s => s.stageNumber === stageNumber)?.notes || '',
  })

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Since this is the final stage for some, we might navigate to report
    submitStage(stageNumber, form)
    navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)
  }

  return (
    <AppLayout title="Stage 3: Pre-Harvest Inspection" showBack>
      <div className="max-w-6xl mx-auto px-1">
        <p className="text-text-secondary text-sm mb-8">Post-flowering and pre-harvest assessment</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 items-start">
            
            {/* ── COLUMN 1: Re-verification ── */}
            <div className="flex flex-col gap-12">
              
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-6 transition-all">
                <SectionHeader title="Re-verification" />

                <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border border-gray-100">
                  <Toggle label="Roguing Done" name="roguingDone" checked={form.roguingDone} onChange={handleChange} />
                </div>

                <TextInput 
                  label="Off-Types Remaining" 
                  name="offTypesRemaining" 
                  value={form.offTypesRemaining} 
                  onChange={handleChange} 
                  placeholder="Count of remaining off-types" 
                  required
                />

                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Objectionable Weeds Removed" name="weedsRemoved" checked={form.weedsRemoved} onChange={handleChange} />
                  </div>
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Diseased Heads Removed" name="diseasedHeadsRemoved" checked={form.diseasedHeadsRemoved} onChange={handleChange} />
                  </div>
                </div>
              </div>

            </div>

            {/* ── COLUMN 2: Harvest Advisory ── */}
            <div className="flex flex-col gap-12">
              
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-6">
                <SectionHeader title="Harvest Advisory" />
                
                <Slider 
                  label="Maturity Uniformity" 
                  name="maturityUniformity" 
                  value={form.maturityUniformity} 
                  onChange={handleChange} 
                />

                {/* Moisture Info Box */}
                <div className="bg-blue-50/50 rounded-[1.5rem] p-6 border border-blue-100 flex flex-col gap-1 relative overflow-hidden">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-blue-700 font-bold text-[15px] flex items-center gap-2">
                           <Droplets size={16} className="text-blue-500" />
                           Moisture Estimation (Sensor)
                        </h4>
                        <p className="text-blue-500 text-xs font-semibold">Based on field moisture sensor readings</p>
                      </div>
                      <span className="text-blue-700 font-black text-2xl tracking-tighter">{form.moistureEstimation}%</span>
                   </div>
                </div>

                {/* Maturity Status */}
                {form.maturityUniformity >= 80 ? (
                  <div className="bg-emerald-50 rounded-2xl py-4 flex items-center justify-center gap-2 border border-emerald-100 text-emerald-600">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">Maturity level suitable for harvest</span>
                  </div>
                ) : (
                   <div className="bg-amber-50 rounded-2xl py-4 flex items-center justify-center gap-2 border border-amber-100 text-amber-700">
                    <TrendingDown size={20} />
                    <span className="font-bold">Maturity level nearing harvest</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Harvest Equipment Cleaned" name="equipmentCleaned" checked={form.equipmentCleaned} onChange={handleChange} />
                  </div>
                  <div className="bg-gray-50/30 rounded-2xl px-4 py-0.5 border border-gray-100/50">
                    <Toggle label="Separate Threshing Advised" name="separateThreshing" checked={form.separateThreshing} onChange={handleChange} />
                  </div>
                </div>

                <TextInput 
                  label="Yield Estimation (kg/hectare)" 
                  name="yieldEstimation" 
                  value={form.yieldEstimation} 
                  onChange={handleChange} 
                  placeholder="Estimated yield" 
                  required
                />
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm">
                <label className="block text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Info size={18} className="text-primary" />
                   Storage Recommendations
                </label>
                <textarea 
                  name="notes" 
                  value={form.notes} 
                  onChange={handleChange}
                  placeholder="Add specific instructions for harvesting, handling or storage conditions..."
                  rows={4}
                  className="w-full border border-border/80 rounded-2xl px-5 py-4 text-sm text-text-primary
                             placeholder:text-text-muted focus:outline-none focus:ring-2
                             focus:ring-primary-mid resize-none bg-gray-50/10 transition-all font-medium" 
                />
              </div>

            </div>

          </div>

          <FormActions 
            submitText="Complete Inspection & Generate Report" 
            onBack={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)} 
            stageNumber={stageNumber} 
          />
        </form>
      </div>
    </AppLayout>
  )
}
