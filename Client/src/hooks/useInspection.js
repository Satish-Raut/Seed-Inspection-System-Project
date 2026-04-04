import { useContext } from 'react'
import { InspectionContext } from '../context/InspectionContext'

/**
 * useInspection
 * Custom hook to manage the multi-stage seed inspection lifecycle.
 * Provides functions for crop selection, field registration, and stage form submission.
 * @returns {Object} - { current, setCropType, setFieldData, submitStage, etc }
 */
export const useInspection = () => {
  const context = useContext(InspectionContext)

  if (!context) {
    throw new Error('useInspection must be used within an InspectionProvider')
  }

  const {
    current,                // { id, cropType, productionType, field, stages, status, ... }
    startNewInspection,     // Function: Generates a NEW unique inspection ID
    setCropType,            // Function: setCropType('Wheat') -> sets selection
    setProductionType,      // Function: setProductionType('Hybrid', 4) -> sets method & stages
    setFieldData,           // Function: setFieldData({ farmerName, ... }) -> saves field info
    submitStage,            // Function: submitStage(1, { ...formData }) -> saves stage data
    completeInspection,     // Function: finalizes and moves to Completed status
    getInspectorInspections, // Function: getInspectorInspections(uID) -> fetches history
    isStageCompleted,       // Function: returns true if stage X is done
    completedCount          // Number: Returns count of stages done
  } = context

  return {
    current,
    status: current.status, // Quick access to 'In Progress', 'Completed', etc.
    startNewInspection,
    setCropType,
    setProductionType,
    setFieldData,
    submitStage,
    completeInspection,
    getInspectorInspections,
    isStageCompleted,
    completedCount
  }
}
