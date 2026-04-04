import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Microscope, Award, FileCheck } from 'lucide-react'
import AppLayout from '../../../../components/AppLayout'
import { useInspection } from '../../../../hooks/useInspection'
import { Slider, Toggle, NumberInput, FormActions } from '../../../../components/FormComponents'

export default function WheatStage4({ stageNumber = 4 }) {
  const { current, submitStage } = useInspection()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    seedUniformity: 90,
    germinationEstimation: 92,
    inertMatter: 0.5,
    finalMoisture: 12.0,
    purityCertified: true,
    lotIntegrityChecked: true,
    notes: '',
  })

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitStage(stageNumber, form)
    navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)
  }

  return (
    <AppLayout title={`Stage ${stageNumber}: Final Seed Quality`} showBack>
      <div className="max-w-6xl mx-auto">
         <form onSubmit={handleSubmit} className="flex flex-col gap-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
             
             {/* Left Column: Quality & Viability */}
             <div className="flex flex-col gap-6">
               <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
                 <div className="flex items-center gap-2 mb-2 text-primary">
                    <Microscope size={20} />
                    <h3 className="font-bold text-text-primary text-base uppercase tracking-tight">Seed Laboratory Metrics</h3>
                 </div>
                 <Slider label="Physical Seed Uniformity" name="seedUniformity" value={form.seedUniformity} onChange={handleChange} />
                 <Slider label="Germination Potential" name="germinationEstimation" value={form.germinationEstimation} onChange={handleChange} />
               </div>

               <div className="bg-success-bg border border-emerald-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <Award size={24} />
                    <h4 className="font-black text-sm uppercase tracking-wider">Quality Milestone</h4>
                  </div>
                  <p className="text-emerald-700/80 text-xs mt-2 leading-relaxed">
                    This final stage confirms that the harvested grain meets the genetic and physical requirements of the hybrid variety before lot certification.
                  </p>
               </div>
             </div>

             {/* Right Column: Physical Purity */}
             <div className="flex flex-col gap-6">
               <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
                 <h3 className="font-bold text-text-primary text-base mb-4 uppercase tracking-wider">Physical Analysis</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <NumberInput 
                     id="inert" 
                     label="Inert Matter (%)" 
                     name="inertMatter" 
                     value={form.inertMatter} 
                     onChange={handleChange} 
                     placeholder="e.g. 0.2" 
                     required
                   />
                   <NumberInput 
                     id="finalMoisture" 
                     label="Final Grain Moisture (%)" 
                     name="finalMoisture" 
                     value={form.finalMoisture} 
                     onChange={handleChange} 
                     placeholder="e.g. 12.0" 
                     required
                   />
                 </div>
               </div>

               <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <FileCheck size={20} />
                    <h3 className="font-bold text-text-primary text-base tracking-tight uppercase">Certification Check</h3>
                  </div>
                  <div className="divide-y divide-border border-t border-border mt-2">
                    <Toggle label="Genetic Purity Certified" name="purityCertified" checked={form.purityCertified} onChange={handleChange} />
                    <Toggle label="Lot Integrity Verified" name="lotIntegrityChecked" checked={form.lotIntegrityChecked} onChange={handleChange} />
                  </div>
               </div>

               <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
                 <label className="block text-sm font-bold text-text-primary mb-3">Final Certification Remarks</label>
                 <textarea 
                   name="notes" 
                   value={form.notes} 
                   onChange={handleChange}
                   placeholder="Add any final certification notes..."
                   rows={4}
                   className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm text-text-primary
                              placeholder:text-text-muted focus:outline-none focus:ring-2
                              focus:ring-primary-mid resize-none bg-gray-50/10" 
                 />
               </div>
             </div>
           </div>

           <FormActions onBack={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)} stageNumber={stageNumber} />
         </form>
      </div>
    </AppLayout>
  )
}
