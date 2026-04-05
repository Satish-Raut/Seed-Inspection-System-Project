import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileUp, Camera, QrCode, Wifi, MapPin, 
  Ruler, Info, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react'
import AppLayout from '../../../../components/AppLayout'
import { useInspection } from '../../../../hooks/useInspection'
import { 
  Slider, Toggle, TextInput, Select, SectionHeader, FormActions 
} from '../../../../components/FormComponents'

export default function WheatStage1({ stageNumber = 1 }) {
  const { current, submitStage, persistStagePhoto } = useInspection()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const existingData = current?.stages?.find(s => s.stageNumber === stageNumber)?.formData || {}

  const [form, setForm] = useState({
    // Image
    tagImage: existingData.tagImage || null,
    
    // Section A
    tagNumber: existingData.tagNumber || '',
    classOfSeed: existingData.classOfSeed || '',
    lotNumber: existingData.lotNumber || '',
    producerName: existingData.producerName || '',
    varietyName: existingData.varietyName || '',
    
    // Section B
    appAcreage: existingData.appAcreage || '',
    actualAcreage: existingData.actualAcreage || '',
    previousCrop: existingData.previousCrop || '',
    season1History: existingData.season1History || '',
    season2History: existingData.season2History || '',
    volunteerPlants: existingData.volunteerPlants || false,
    
    // Section C
    requiredIsolation: existingData.requiredIsolation || '300',
    contaminatingCropPresent: existingData.contaminatingCropPresent || false,
    
    // Section D
    heightUniformity: existingData.heightUniformity || 75,
    colorUniformity: existingData.colorUniformity || 80,
    growthStageUniformity: existingData.growthStageUniformity || 70,
    tilleringPattern: existingData.tilleringPattern || '',
    aiOffTypePercent: existingData.aiOffTypePercent || '1.2',
    roguingAdvised: existingData.roguingAdvised || false,
    notes: existingData.notes || current?.stages?.find(s => s.stageNumber === stageNumber)?.notes || '',
  })

  const [imgProcessing, setImgProcessing] = useState(false)

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImgProcessing(true)
      try {
        const base64 = await persistStagePhoto(file)
        setForm((p) => ({ ...p, tagImage: base64 }))
      } catch (err) {
        console.error('Photo capture failed', err)
      } finally {
        setImgProcessing(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitStage(stageNumber, form)
    navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)
  }

  return (
    <AppLayout title="Stage 1: Vegetative Inspection" showBack>
      <div className="max-w-6xl mx-auto px-1">
        <p className="text-text-secondary text-sm mb-8">Pre-flowering stage assessment</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 items-start">
            
            {/* ── COLUMN 1: A. SEED SOURCE & B. LAND ── */}
            <div className="flex flex-col gap-12">
              
              {/* SECTION A: Seed Source Verification */}
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-8 transition-all">
                <SectionHeader title="A. Seed Source Verification" />
                
                {/* Image Actions */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      disabled={imgProcessing}
                      className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl border border-border hover:bg-gray-50 hover:border-primary transition-all font-bold text-text-primary text-sm group disabled:opacity-50">
                      <FileUp size={18} className="text-text-secondary group-hover:text-primary" />
                      {imgProcessing ? 'Processing...' : 'Upload Seed Tag'}
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      disabled={imgProcessing}
                      className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl border border-border hover:bg-gray-50 hover:border-primary transition-all font-bold text-text-primary text-sm group disabled:opacity-50">
                      <Camera size={18} className="text-text-secondary group-hover:text-primary" />
                      Capture Photo
                    </button>
                  </div>
                  
                  {form.tagImage && (
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border group">
                      <img src={form.tagImage} alt="Seed Tag" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm(p => ({ ...p, tagImage: null }))}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles size={14} /> {/* X icon replacement if lucide isn't here, but let's use check for now or just generic */}
                      </button>
                    </div>
                  )}
                </div>
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                {/* Info Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="Tag Number" name="tagNumber" value={form.tagNumber} onChange={handleChange} placeholder="Enter tag number" required />
                  <Select label="Class of Seed" name="classOfSeed" value={form.classOfSeed} onChange={handleChange} placeholder="Select class"
                    options={['Breeder', 'Foundation', 'Certified']} required />
                </div>

                <TextInput label="Seed Lot Number" name="lotNumber" value={form.lotNumber} onChange={handleChange} placeholder="Enter lot number" required />

                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="Seed Producer Name" name="producerName" value={form.producerName} onChange={handleChange} placeholder="Producer name" required />
                  <TextInput label="Variety Name" name="varietyName" value={form.varietyName} onChange={handleChange} placeholder="Variety" required />
                </div>
              </div>

              {/* SECTION B: Land & Acreage */}
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-6">
                <SectionHeader title="B. Land & Acreage" />
                
                <div className="grid grid-cols-2 gap-4 items-end">
                  <TextInput label="Application Acreage" name="appAcreage" value={form.appAcreage} onChange={handleChange} placeholder="Acres" type="number" required />
                  <TextInput label="Actual Acreage" name="actualAcreage" value={form.actualAcreage} onChange={handleChange} placeholder="Acres" type="number" required />
                </div>

                <Select label="Previous Crop" name="previousCrop" value={form.previousCrop} onChange={handleChange} placeholder="Select crop"
                  options={['Rice', 'Cotton', 'Sugarcane', 'Empty Fallow']} />

                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="Cropping History (S1)" name="season1History" value={form.season1History} onChange={handleChange} placeholder="Season 1" />
                  <TextInput label="Cropping History (S2)" name="season2History" value={form.season2History} onChange={handleChange} placeholder="Season 2" />
                </div>

                <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border border-gray-100">
                   <Toggle label="Volunteer Plants Present" name="volunteerPlants" checked={form.volunteerPlants} onChange={handleChange} />
                </div>
              </div>

            </div>

            {/* ── COLUMN 2: C. ISOLATION & D. MORPHOLOGY ── */}
            <div className="flex flex-col gap-12">
              
              {/* SECTION C: Isolation Distance */}
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-8">
                <SectionHeader title="C. Isolation Distance" />
                
                <TextInput label="Required Isolation Distance (m)" name="requiredIsolation" value={form.requiredIsolation} onChange={handleChange} placeholder="300" type="number" required />

                <button type="button" className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-border hover:bg-gray-50 transition-all font-bold text-text-primary text-sm">
                  <Ruler size={18} className="text-text-secondary" />
                  Measure Distance
                </button>

                <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border border-gray-100">
                  <Toggle label="Contaminating Crop Present" name="contaminatingCropPresent" checked={form.contaminatingCropPresent} onChange={handleChange} />
                </div>

                {!form.contaminatingCropPresent ? (
                  <div className="bg-emerald-50 rounded-2xl py-4 flex items-center justify-center gap-2 border border-emerald-100 text-emerald-600">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">Isolation Adequate</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-2xl py-4 flex items-center justify-center gap-2 border border-amber-100 text-amber-700">
                    <AlertCircle size={20} />
                    <span className="font-bold">Check Isolation Integrity</span>
                  </div>
                )}
              </div>

              {/* SECTION D: Morphological Verification */}
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-8">
                <SectionHeader title="D. Morphological Verification" />
                
                <div className="flex flex-col gap-10">
                  <Slider label="Plant Height Uniformity" name="heightUniformity" value={form.heightUniformity} onChange={handleChange} />
                  <Slider label="Leaf Color Uniformity" name="colorUniformity" value={form.colorUniformity} onChange={handleChange} />
                  <Slider label="Growth Stage Uniformity" name="growthStageUniformity" value={form.growthStageUniformity} onChange={handleChange} />
                </div>

                <Select label="Tillering Pattern" name="tilleringPattern" value={form.tilleringPattern} onChange={handleChange} placeholder="Select pattern"
                  options={['Erect', 'Semi-Erect', 'Spreading']} />

                {/* AI Detection Info Box */}
                <div className="bg-blue-50/50 rounded-[1.5rem] p-6 border border-blue-100 flex flex-col gap-1 relative overflow-hidden">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-blue-700 font-bold text-[15px] flex items-center gap-2">
                           <Sparkles size={16} className="text-blue-500" />
                           AI Detection - Off-Type %
                        </h4>
                        <p className="text-blue-500 text-xs font-semibold">AI analysis based on field images</p>
                      </div>
                      <span className="text-blue-700 font-black text-2xl tracking-tighter">{form.aiOffTypePercent}%</span>
                   </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl px-4 py-1 border border-gray-100">
                   <Toggle label="Roguing Advised" name="roguingAdvised" checked={form.roguingAdvised} onChange={handleChange} />
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm">
                <label className="block text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                   <Info size={18} className="text-primary" />
                   Inspector Observations
                </label>
                <textarea 
                  name="notes" 
                  value={form.notes} 
                  onChange={handleChange}
                  placeholder="Record any specific morphological variations or field observations..."
                  rows={4}
                  className="w-full border border-border/80 rounded-2xl px-5 py-4 text-sm text-text-primary
                             placeholder:text-text-muted focus:outline-none focus:ring-2
                             focus:ring-primary-mid resize-none bg-gray-50/10 transition-all" 
                />
              </div>

            </div>

          </div>

          <FormActions submitText="Submit Stage 1 & Continue" onBack={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)} stageNumber={stageNumber} />
        </form>
      </div>
    </AppLayout>
  )
}
