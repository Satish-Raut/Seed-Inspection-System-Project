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

  return context
}
