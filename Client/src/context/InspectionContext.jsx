import { createContext, useContext, useState, useEffect } from 'react'

const InspectionContext = createContext(null)

const getInspections = () => JSON.parse(localStorage.getItem('si_inspections') || '[]')
const saveInspections = (list) => localStorage.setItem('si_inspections', JSON.stringify(list))

const INITIAL_STATE = {
  id:             null,
  cropType:       null,
  productionType: null,
  totalStages:    3,
  status:         'In Progress',
  field:          null,
  stages:         [],
  createdAt:      null,
}

export function InspectionProvider({ children }) {
  // ── Persistence: Load from localStorage on init ──────────────────────────
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem('si_active_inspection')
    return saved ? JSON.parse(saved) : INITIAL_STATE
  })

  // ── Persistence: Save to localStorage on change ──────────────────────────
  useEffect(() => {
    localStorage.setItem('si_active_inspection', JSON.stringify(current))
  }, [current])

  // ── ID Generation Helper ──────────────────────────────────────────────────
  const generateId = () => {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `INS-${Date.now().toString().slice(-4)}-${random}`
  }

  // ── Reset for a new inspection ────────────────────────────────────────────
  const startNewInspection = () => {
    const newInsp = {
      ...INITIAL_STATE,
      id:             generateId(),
      createdAt:      new Date().toISOString(),
    }
    setCurrent(newInsp)
    return newInsp
  }

  // ── Image Persistence Helper ─────────────────────────────────────────────
  const persistFieldImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result
        setCurrent((prev) => ({
          ...prev,
          field: { ...prev.field, fieldImage: base64, imageFileName: file.name }
        }))
        resolve(base64)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  // ── Step setters ──────────────────────────────────────────────────────────
  const setCropType = (cropType) => setCurrent((prev) => ({ ...prev, cropType }))

  const setProductionType = (productionType, totalStages) =>
    setCurrent((prev) => ({ ...prev, productionType, totalStages }))

  const setFieldData = (field) => setCurrent((prev) => ({ ...prev, field }))

  const submitStage = (stageNumber, data) => {
    setCurrent((prev) => {
      const stages = prev.stages.filter((s) => s.stageNumber !== stageNumber)
      return {
        ...prev,
        stages: [...stages, { stageNumber, ...data, timestamp: new Date().toISOString() }],
      }
    })
  }

  // ── Save completed inspection to localStorage ─────────────────────────────
  const completeInspection = (verdict, summaryNotes, inspectorId) => {
    const completed = {
      ...current,
      status: verdict === 'Rejected' ? 'Rejected' : 'Completed',
      verdict,
      summaryNotes,
      inspectorId,
      completedAt: new Date().toISOString(),
    }
    const all = getInspections()
    saveInspections([completed, ...all])
    
    // Clear active inspection after completion
    setCurrent(INITIAL_STATE)
    localStorage.removeItem('si_active_inspection')
    
    return completed
  }

  // ── Load all inspections for an inspector ─────────────────────────────────
  const getInspectorInspections = (inspectorId) => {
    return getInspections().filter((i) => i.inspectorId === inspectorId)
  }

  // ── Check if a stage is done ──────────────────────────────────────────────
  const isStageCompleted = (stageNumber) =>
    current.stages.some((s) => s.stageNumber === stageNumber)

  const completedCount = current.stages.length

  return (
    <InspectionContext.Provider
      value={{
        current,
        startNewInspection,
        setCropType,
        setProductionType,
        setFieldData,
        submitStage,
        completeInspection,
        getInspectorInspections,
        isStageCompleted,
        completedCount,
      }}
    >
      {children}
    </InspectionContext.Provider>
  )
}

export { InspectionContext }
