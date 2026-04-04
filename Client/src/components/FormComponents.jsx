import { ArrowLeft } from 'lucide-react'

export function Slider({ label, name, value, onChange, unit = '%' }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-text-primary">{label}</label>
        <span className="text-primary font-bold text-sm bg-primary-lighter px-2.5 py-0.5 rounded-full">
          {value}{unit}
        </span>
      </div>
      <input 
        type="range" 
        name={name} 
        min="0" 
        max="100" 
        value={value} 
        onChange={onChange}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #059669 ${value}%, #E2E8F0 ${value}%)` }} 
      />
      <div className="flex justify-between text-text-muted text-[10px] mt-1 font-bold">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  )
}

export function Toggle({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-text-primary font-bold">{label}</span>
      <button 
        type="button" 
        role="switch" 
        aria-checked={checked} 
        id={`toggle-${name}`}
        onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          checked ? 'bg-primary-mid shadow-inner shadow-primary-dark/20' : 'bg-gray-200 shadow-inner'
        }`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
          checked ? 'left-6' : 'left-0.5'
        }`} />
      </button>
    </div>
  )
}

export function NumberInput({ id, label, name, value, onChange, placeholder, hint, min = "0", max = "100", step = "0.1", required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>
      <input 
        id={id} 
        type="number" 
        name={name} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder} 
        min={min} 
        max={max} 
        step={step}
        required={required}
        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary
                   placeholder:text-text-muted focus:outline-none focus:ring-2
                   focus:ring-primary-mid transition-all bg-white" 
      />
      {hint && <p className="text-text-muted text-[10px] mt-1 font-medium">{hint}</p>}
    </div>
  )
}

export function FormActions({ onBack, submitText, stageNumber, isSubmitting = false }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-dashed border-border/80">
      <button 
        type="button" 
        onClick={onBack}
        className="flex-1 md:flex-none md:px-12 py-4 rounded-2xl border-2 border-border text-text-secondary font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="flex-1 bg-primary text-white font-black py-4 rounded-2xl
                   flex items-center justify-center gap-3 shadow-lg shadow-primary/20
                   hover:bg-primary-mid active:scale-95 transition-all glow-button"
      >
        {submitText || `Complete Stage ${stageNumber} Inspection`}
      </button>
    </div>
  )
}
export function TextInput({ id, label, name, value, onChange, placeholder, required, type = 'text', className = '' }) {
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
                   focus:ring-primary-mid focus:border-transparent transition-all bg-gray-50/20" 
      />
    </div>
  )
}

export function Select({ label, name, value, onChange, options = [], placeholder = "Select option", required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>
      <div className="relative">
        <select 
          name={name} 
          value={value} 
          onChange={onChange}
          required={required}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary
                     appearance-none bg-gray-50/20 focus:outline-none focus:ring-2
                     focus:ring-primary-mid transition-all cursor-pointer"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function SectionHeader({ title, children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-8 w-1.5 bg-primary rounded-full" />
      <h3 className="font-black text-primary text-lg tracking-tight">{title}</h3>
      {children}
    </div>
  )
}
