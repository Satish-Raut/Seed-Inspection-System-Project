import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Loader2, Upload, Camera, FileText, ArrowLeft } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import { useInspection } from '../../hooks/useInspection'
import { useGeolocation } from '../../hooks/useGeolocation'

export default function FieldRegistration() {
  const { current, setFieldData, persistFieldImage } = useInspection()
  const navigate = useNavigate()
  const [imgProcessing, setImgProcessing] = useState(false)

  // Initialize form with existing context data for persistence (Rehydration)
  const [form, setForm] = useState({
    farmerName:         current.field?.farmerName || '', 
    farmerContact:      current.field?.farmerContact || '', 
    seedProducer:       current.field?.seedProducer || '',
    village:            current.field?.village || '',
    district:           current.field?.district || '',
    fieldId:            current.field?.fieldId || '',
    applicationNumber:  current.field?.applicationNumber || '',
    fieldLocation:      current.field?.fieldLocation || '',
    latitude:           current.field?.latitude || '', 
    longitude:          current.field?.longitude || '', 
    notes:              current.field?.notes || '',
    fieldImage:         current.field?.fieldImage || null,
    imageFileName:      current.field?.imageFileName || ''
  })

  const fileInputRef = useRef(null)
  const { getLocation, loading: gpsLoading, error: gpsError } = useGeolocation()
  const [gpsStatus, setGpsStatus]   = useState('')

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const captureGPS = async () => {
    setGpsStatus('')
    const pos = await getLocation()
    if (pos) {
       setForm((p) => ({
         ...p,
         latitude:  pos.latitude.toFixed(6),
         longitude: pos.longitude.toFixed(6),
       }))
       setGpsStatus(`✅ Location captured! (±${Math.round(pos.accuracy)}m accuracy)`)
    } else {
       // gpsError state is already set inside the hook with a friendly message
       setGpsStatus(`❌ ${gpsError || 'Could not get location. Please try again.'}`)
    }
  }

  const handleFileClick = () => fileInputRef.current?.click()
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImgProcessing(true)
      try {
        const base64 = await persistFieldImage(file)
        setForm((p) => ({ ...p, fieldImage: base64, imageFileName: file.name }))
      } catch (err) {
        console.error('Image capture failed', err)
      } finally {
        setImgProcessing(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFieldData(form)
    
    // Redirect to crop selection as the next step
    navigate(`/inspection/${current.id || 'NEW'}/crop`)
  }

  return (
    <AppLayout title="Field Registration" showBack>
      <div className="max-w-6xl mx-auto px-1 md:px-0">
        <p className="text-text-secondary text-sm mb-6 px-1 lg:px-0">
          Register the farmer and field details before beginning the inspection.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Column 1: Basic Information (Lefthand Column on Desktop) */}
          <div className="bg-white rounded-3xl p-6 border border-border/60 shadow-sm flex flex-col gap-5">
            <h3 className="font-bold text-text-primary text-base">Basic Information</h3>
            
            <div className="flex flex-col gap-4">
              <Field id="field-farmer-name" label="Farmer Name" name="farmerName" value={form.farmerName} onChange={handleChange} placeholder="Enter farmer name" required />
              <Field id="field-seed-producer" label="Seed Producer" name="seedProducer" value={form.seedProducer} onChange={handleChange} placeholder="Enter seed producer name" required />
              
              <div className="grid grid-cols-2 gap-4">
                <Field id="field-village" label="Village" name="village" value={form.village} onChange={handleChange} placeholder="Village" required />
                <Field id="field-district" label="District" name="district" value={form.district} onChange={handleChange} placeholder="District" required />
              </div>

              <Field id="field-id" label="Field ID" name="fieldId" value={form.fieldId} onChange={handleChange} placeholder="Enter field ID" required />
              <Field id="field-app-num" label="Application Number" name="applicationNumber" value={form.applicationNumber} onChange={handleChange} placeholder="Enter application number" required />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-border pt-4 mt-1">
                <Field id="field-farmer-contact" label="Contact Number" name="farmerContact" value={form.farmerContact} onChange={handleChange} type="tel" placeholder="+91 00000 00000" required />
                <Field id="field-location" label="Location Detail" name="fieldLocation" value={form.fieldLocation} onChange={handleChange} placeholder="Additional location info" />
              </div>
            </div>
          </div>

          {/* Column 2: Documentation, GPS, and Submission (Righthand Column on Desktop) */}
          <div className="flex flex-col gap-6">
            {/* Card: Field Documentation */}
            <div className="bg-white rounded-3xl p-6 border border-border/60 shadow-sm flex flex-col gap-5">
              <h3 className="font-bold text-text-primary text-base">Field Documentation</h3>
              
              <div className="flex flex-col gap-3">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <button type="button" onClick={handleFileClick} disabled={imgProcessing}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-border/80 hover:bg-gray-50 transition-all text-text-primary font-bold group">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-primary-lighter transition-all">
                    {imgProcessing ? <Loader2 size={20} className="animate-spin text-primary" /> : <Camera size={20} className="text-text-secondary group-hover:text-primary" />}
                  </div>
                  <span className="flex-1 text-left">
                    {imgProcessing ? 'Processing Image...' : form.fieldImage ? 'Change Field Image' : 'Upload Field Image'}
                  </span>
                </button>

                {form.fieldImage && !imgProcessing && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-200">
                       <img src={form.fieldImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-emerald-800 truncate max-w-[200px]">
                        {form.imageFileName || 'Field Photo Captured'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Saved to session storage</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Box: GPS Coordinates */}
            <div className="bg-app-bg/50 rounded-3xl p-6 border border-primary/10 flex flex-col gap-5">
               <div className="flex items-center gap-4 text-primary">
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <MapPin size={22} />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm">GPS Coordinates</h4>
                     <p className="text-[11px] text-text-secondary font-medium tracking-tight">Field boundary will be recorded using device GPS</p>
                  </div>
               </div>

               <button type="button" id="btn-capture-gps" onClick={captureGPS} disabled={gpsLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary
                             text-white font-black py-3.5 rounded-xl
                             hover:bg-primary-mid transition-all disabled:opacity-60 shadow-sm text-sm">
                  {gpsLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                  {gpsLoading ? 'Capturing location...' : 'Capture GPS Location'}
               </button>

               {(form.latitude || gpsStatus) && (
                 <div className="grid grid-cols-2 gap-4 mt-1">
                    <div className="bg-white/60 p-3 rounded-xl border border-white/40 text-center">
                      <span className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Lat</span>
                      <span className="text-xs font-bold text-text-primary uppercase tracking-tighter">{form.latitude || '--'}</span>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-white/40 text-center">
                      <span className="block text-[10px] uppercase tracking-wider text-text-muted font-bold mb-1">Long</span>
                      <span className="text-xs font-bold text-text-primary uppercase tracking-tighter">{form.longitude || '--'}</span>
                    </div>
                 </div>
               )}
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-3xl p-6 border border-border/60 shadow-sm">
              <label className="block text-sm font-bold text-text-primary mb-3">Additional Notes</label>
              <textarea id="field-notes" name="notes" value={form.notes} onChange={handleChange}
                placeholder="Describe field conditions, accessibility, or any other relevant information..." rows={3}
                className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm text-text-primary
                           placeholder:text-text-muted focus:outline-none focus:ring-2
                           focus:ring-primary-mid resize-none transition-all bg-gray-50/10" />
            </div>

            <button type="submit" id="btn-continue-stages"
              className="w-full bg-primary text-white font-black py-4 rounded-2xl
                         flex items-center justify-center gap-2 mt-2
                         hover:bg-primary-mid active:scale-[0.98] transition-all glow-button shadow-lg">
              Continue to Stage Selection
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

function Field({ id, label, name, value, onChange, type = 'text', placeholder, required, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>
      <input 
        id={id} 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder} 
        required={required}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary
                   placeholder:text-text-muted focus:outline-none focus:ring-2
                   focus:ring-primary-mid focus:border-transparent transition-all bg-gray-50/20" />
    </div>
  )
}
