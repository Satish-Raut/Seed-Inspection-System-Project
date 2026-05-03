import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Droplets, CheckCircle2, TrendingDown, Info,
  Plus, Trash2, ChevronDown, ChevronUp, ClipboardList
} from 'lucide-react'
import AppLayout from '../../../../components/AppLayout'
import { useInspection } from '../../../../hooks/useInspection'
import {
  Slider, Toggle, TextInput, SectionHeader, FormActions
} from '../../../../components/FormComponents'

// ── Default shape for one count entry ──────────────────────────────────────
const EMPTY_COUNT = {
  totalPlants:           1000,   // Fixed reference count
  offTypes:              0,
  volunteerPlants:       0,
  objectionableWeeds:    0,
  diseasedPlants:        0,
  inseparableOtherCrops: 0,
}

export default function WheatStage3({ stageNumber = 3 }) {
  const { current, submitStage } = useInspection()
  const navigate = useNavigate()

  const existingData = current?.stages?.find(s => s.stageNumber === stageNumber)?.formData || {}

  // ── Count entries state ──────────────────────────────────────────────────
  const [counts, setCounts] = useState(
    existingData.counts?.length > 0
      ? existingData.counts
      : []                        // Start empty; user adds via button
  )
  const [openIndex, setOpenIndex] = useState(null)  // Which accordion is expanded

  // ── Harvest Advisory state ───────────────────────────────────────────────
  const [form, setForm] = useState({
    maturityUniformity: existingData.maturityUniformity || 85,
    moistureEstimation: existingData.moistureEstimation || '12.5',
    equipmentCleaned:   existingData.equipmentCleaned   || false,
    separateThreshing:  existingData.separateThreshing  || false,
    yieldEstimation:    existingData.yieldEstimation    || '',
    notes:              existingData.notes || current?.stages?.find(s => s.stageNumber === stageNumber)?.notes || '',
  })

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  // ── Count entry handlers ─────────────────────────────────────────────────
  const addCount = () => {
    const newIndex = counts.length
    setCounts(prev => [...prev, { ...EMPTY_COUNT }])
    setOpenIndex(newIndex)  // Auto-open the new card
  }

  const removeCount = (idx) => {
    setCounts(prev => prev.filter((_, i) => i !== idx))
    setOpenIndex(null)
  }

  const updateCount = (idx, field, value) => {
    setCounts(prev => prev.map((c, i) =>
      i === idx ? { ...c, [field]: value === '' ? '' : Number(value) } : c
    ))
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      counts,
    }
    await submitStage(stageNumber, payload)
    navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)
  }

  return (
    <AppLayout title="Stage 3: Flowering Inspection" showBack>
      <div className="max-w-6xl mx-auto px-1">
        <p className="text-text-secondary text-sm mb-8">
          Flowering stage — record plant counts and harvest readiness
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 items-start">

            {/* ── COLUMN 1: Plant Count Entries ── */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col gap-6">

                {/* Header + Add Button */}
                <div className="flex items-center justify-between">
                  <SectionHeader title="Plant Count Entries" />
                  <button
                    type="button"
                    onClick={addCount}
                    className="flex items-center gap-2 bg-primary text-white text-xs font-black
                               px-4 py-2.5 rounded-xl hover:bg-primary-mid active:scale-95
                               transition-all shadow-sm shadow-primary/20"
                  >
                    <Plus size={15} />
                    Add Count
                  </button>
                </div>

                {/* Empty State */}
                {counts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 gap-3
                                  border-2 border-dashed border-border rounded-2xl text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <ClipboardList size={22} className="text-text-muted" />
                    </div>
                    <p className="text-text-muted text-sm font-semibold">No counts recorded yet</p>
                    <p className="text-text-muted text-xs">Click <span className="font-bold text-primary">Add Count</span> to start a new plant count entry</p>
                  </div>
                )}

                {/* Count Cards (Accordion) */}
                <div className="flex flex-col gap-3">
                  {counts.map((count, idx) => (
                    <div
                      key={idx}
                      className="border border-border rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between px-5 py-4
                                   bg-gray-50/70 hover:bg-gray-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-primary text-white text-xs font-black
                                           rounded-lg flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-text-primary text-sm">Count {idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeCount(idx) }}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100
                                       hover:text-red-600 flex items-center justify-center transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                          {openIndex === idx
                            ? <ChevronUp size={16} className="text-text-muted" />
                            : <ChevronDown size={16} className="text-text-muted" />
                          }
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {openIndex === idx && (
                        <div className="px-5 py-5 bg-white flex flex-col gap-5 border-t border-border/50">

                          {/* Total Plants — fixed display */}
                          <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                              Total Plants (Fixed)
                            </p>
                            <p className="text-2xl font-black text-text-primary">
                              {count.totalPlants.toLocaleString()}
                            </p>
                          </div>

                          {/* 2-column grid of count inputs */}
                          <div className="grid grid-cols-2 gap-4">
                            <CountField
                              label="Off-types"
                              value={count.offTypes}
                              onChange={(v) => updateCount(idx, 'offTypes', v)}
                            />
                            <CountField
                              label="Volunteer Plants"
                              value={count.volunteerPlants}
                              onChange={(v) => updateCount(idx, 'volunteerPlants', v)}
                            />
                            <CountField
                              label="Objectionable Weeds"
                              value={count.objectionableWeeds}
                              onChange={(v) => updateCount(idx, 'objectionableWeeds', v)}
                            />
                            <CountField
                              label="Diseased Plants"
                              value={count.diseasedPlants}
                              onChange={(v) => updateCount(idx, 'diseasedPlants', v)}
                            />
                          </div>

                          {/* Full-width — Inseparable Other Crops */}
                          <CountField
                            label="Inseparable Other Crops"
                            value={count.inseparableOtherCrops}
                            onChange={(v) => updateCount(idx, 'inseparableOtherCrops', v)}
                            fullWidth
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── COLUMN 2: Harvest Advisory (unchanged) ── */}
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

                {/* Maturity Status Badge */}
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

              {/* Storage Recommendations notes */}
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
            submitText="Submit Stage 3 & Continue"
            onBack={() => navigate(`/inspection/${current.id}/${current.cropType || 'wheat'}/${current.productionType || 'hybrid'}/stages`)}
            stageNumber={stageNumber}
          />
        </form>
      </div>
    </AppLayout>
  )
}

// ── Reusable count number input field ──────────────────────────────────────
function CountField({ label, value, onChange, fullWidth = false }) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-bold
                   text-text-primary bg-gray-50/30
                   focus:outline-none focus:ring-2 focus:ring-primary-mid
                   focus:border-transparent transition-all"
      />
    </div>
  )
}
