import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../services/api'
import { STAGES } from '../utils/constants'

const InspectionContext = createContext(null)

const INITIAL_STATE = {
  id:             'DRAFT', // 'DRAFT' indicates it's not yet synced to backend
  cropType:       null,
  productionType: null,
  totalStages:    3,
  status:         'In Progress',
  field:          null,
  stages:         [],
  createdAt:      null,
}

export function InspectionProvider({ children }) {
  // ── State ─────────────────────────────────────────────────────────
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem('si_active_inspection')
    return saved ? JSON.parse(saved) : INITIAL_STATE
  })
  
  const [inspections, setInspections] = useState([])
  const [loading, setLoading] = useState(false)

  // ── Persistence: Save active draft to localStorage ────────────────
  useEffect(() => {
    if (current) {
      localStorage.setItem('si_active_inspection', JSON.stringify(current))
    }
  }, [current])

  // ── Fetch all inspections ─────────────────────────────────────────
  const fetchInspections = async () => {
    setLoading(true)
    try {
      const { data } = await api.getMyInspections()
      // Map Drizzle backend keys to frontend state keys
      const mappedData = data.map(insp => ({
        ...insp,
        field: insp.fieldRegistration || null,
        stages: insp.stageData || []
      }))
      setInspections(mappedData)
    } catch (error) {
      console.error('Failed to fetch inspections:', error)
    } finally {
      setLoading(false)
    }
  }

  // ── Load specific inspection from DB (Rehydration) ────────────────
  const loadInspection = async (id) => {
    // If it's already a draft, don't ping the DB
    if (id === 'DRAFT' || id === 'NEW') return

    try {
      setLoading(true)
      const { data } = await api.getInspectionById(id)
      
      // Map backend structure to our context structure
      setCurrent({
        id: data.id,
        cropType: data.cropType,
        productionType: data.productionType,
        totalStages: data.totalStages,
        status: data.status,
        field: data.fieldRegistration || null,
        stages: data.stageData || [],
        createdAt: data.createdAt
      })
    } catch (error) {
       console.error('Failed to load inspection:', error)
    } finally {
      setLoading(false)
    }
  }

  // ── Restore Specific Inspection from Memory ─────────────────────
  const resumeInspection = (insp) => {
    setCurrent({
      id: insp.id,
      cropType: insp.cropType,
      productionType: insp.productionType,
      totalStages: insp.totalStages,
      status: insp.status,
      field: insp.field || insp.fieldRegistration || null,
      stages: insp.stages || insp.stageData || [],
      createdAt: insp.createdAt
    })
  }

  // ── 1. Start a New Draft (Now Real Database Shell) ──────────────
  const startNewInspection = async () => {
    try {
      setLoading(true)
      const { data } = await api.createInspection({})
      
      const newInsp = {
        ...INITIAL_STATE,
        id: data.inspectionId,
        createdAt: new Date().toISOString(),
      }
      setCurrent(newInsp)
      return data.inspectionId
    } catch (error) {
      console.error('Failed to create internal inspection shell:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ── 2. Local Setters (Building the Draft) ───────────────────────
  const setCropType = (cropType) => setCurrent((prev) => ({ ...prev, cropType }))
  const setProductionType = (productionType, totalStages) =>
    setCurrent((prev) => ({ ...prev, productionType, totalStages }))
  const setFieldData = (field) => setCurrent((prev) => ({ ...prev, field }))

  // ── Image Persistence Helpers (Local Base64 for now) ─────────────
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

  const persistStagePhoto = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result
        resolve(base64)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  // ── 3. SYNC DRAFT TO DATABASE ────────────────────────────────────
  // This is called at the end of the Wizard (ProductionType.jsx)
  const syncInspectionToDatabase = async (finalProdType, finalStages) => {
    try {
      setLoading(true);
      
      // 1. Update the existing Inspection Shell 
      await api.updateInspection(current.id, {
        cropType: current.cropType,
        productionType: finalProdType || current.productionType,
        totalStages: finalStages || current.totalStages
      });

      const DB_ID = current.id;

      // 2. Save Field Data with the new DB ID
      if (current.field) {
        const fieldPayload = {
          farmerName: current.field.farmerName,
          farmerContact: current.field.farmerContact || undefined,
          village: current.field.village || undefined,
          district: current.field.district || undefined,
          fieldId: current.field.fieldId || undefined,
          appNumber: current.field.applicationNumber || undefined,
          latitude: current.field.latitude || undefined, 
          longitude: current.field.longitude || undefined,
          fieldLocation: current.field.fieldLocation || undefined,
          fieldImageUrl: current.field.fieldImage || undefined
        };

        // Clean out undefined keys so JSON.stringify doesn't behave strangely
        Object.keys(fieldPayload).forEach(key => 
          fieldPayload[key] === undefined && delete fieldPayload[key]
        );

        await api.saveFieldRegistration(DB_ID, fieldPayload);
      }

      // 3. Update the Draft to become the Real Active DB Session
      setCurrent(prev => ({ 
        ...prev, 
        id: DB_ID,
        productionType: finalProdType || prev.productionType,
        totalStages: finalStages || prev.totalStages
      }));

      return DB_ID;
    } catch (error) {
      console.error("Failed to sync new inspection to database:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ── 4. Submit Stage Data (Real API) ──────────────────────────────
  const submitStage = async (stageNumber, data) => {
    try {
      setLoading(true);
      
      const stageDef = STAGES.find(s => s.number === stageNumber);

      const payload = {
        stageNumber,
        stageName: stageDef ? stageDef.name : `Stage ${stageNumber}`,
        notes: data.notes || '',
        formData: data
      }

      await api.submitStageData(current.id, payload);

      // Re-fetch the full inspection to update stages state accurately
      await loadInspection(current.id);

    } catch (error) {
      console.error("Submit stage error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ── 5. Complete Inspection (Real API) ────────────────────────────
  const completeInspection = async (verdict, summaryNotes) => {
    try {
      setLoading(true);

      const payload = {
        inspectionId: current.id,
        verdict,
        summaryNotes
      }

      await api.finalizeReport(payload);

      // Clear active inspection after completion
      setCurrent(INITIAL_STATE);
      localStorage.removeItem('si_active_inspection');

      return true;
    } catch (error) {
      console.error("Failed to finalize report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────
  const isStageCompleted = (stageNumber) =>
    current.stages.some((s) => s.stageNumber === stageNumber)

  const completedCount = current.stages.length

  return (
    <InspectionContext.Provider
      value={{
        current,
        inspections,
        loading,
        fetchInspections,
        loadInspection,
        resumeInspection,
        startNewInspection,
        syncInspectionToDatabase,
        setCropType,
        setProductionType,
        setFieldData,
        persistFieldImage,
        persistStagePhoto,
        submitStage,
        completeInspection,
        isStageCompleted,
        completedCount,
      }}
    >
      {children}
    </InspectionContext.Provider>
  )
}

export { InspectionContext }
