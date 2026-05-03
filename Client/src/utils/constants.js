export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AgriInspect'

// ─── Crop Types ───────────────────────────────────────────────────────────────
export const CROP_TYPES = [
  { id: 'wheat',     label: 'Wheat',     emoji: '🌾', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'rice',      label: 'Rice',      emoji: '🌿', color: '#10B981', bg: '#ECFDF5' },
  { id: 'maize',     label: 'Maize',     emoji: '🌽', color: '#F97316', bg: '#FFF7ED' },
  { id: 'sorghum',   label: 'Sorghum',   emoji: '🌱', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'sunflower', label: 'Sunflower', emoji: '🌻', color: '#EAB308', bg: '#FEFCE8' },
]

// ─── Production Types ─────────────────────────────────────────────────────────
export const PRODUCTION_TYPES = [
  {
    id: 'hybrid',
    label: 'Hybrid',
    description: '4 inspection stages required',
    stages: 4,
    icon: '🔬',
  },
  {
    id: 'non-hybrid',
    label: 'Non-Hybrid',
    description: '3 inspection stages required',
    stages: 3,
    icon: '🌿',
  },
]

// ─── Stage Definitions ────────────────────────────────────────────────────────
export const STAGES = [
  {
    number: 1,
    name: 'Vegetative',
    description: 'Assess plant stand uniformity and disease checks',
    icon: '🌱',
  },
  {
    number: 2,
    name: 'Pre-Flowering',
    description: 'Monitor early reproductive growth before anthesis begins',
    icon: '🌿',
  },
  {
    number: 3,
    name: 'Flowering',
    description: 'Monitor anthesis uniformity and cross-pollination risk',
    icon: '🌸',
  },
  {
    number: 4,
    name: 'Pre-Harvest',
    description: 'Evaluate maturity, moisture and harvest readiness',
    icon: '🌾',
  },
]

// ─── Disease Checks (universal for now) ──────────────────────────────────────
export const DISEASE_CHECKS = [
  { id: 'rust',   label: 'Rust Disease' },
  { id: 'smut',   label: 'Smut Disease' },
  { id: 'blight', label: 'Blight Disease' },
]

// ─── Inspection Status ────────────────────────────────────────────────────────
export const STATUS = {
  NOT_STARTED:  'Not Started',
  IN_PROGRESS:  'In Progress',
  COMPLETED:    'Completed',
  REJECTED:     'Rejected',
}

// ─── Verdict Options ──────────────────────────────────────────────────────────
export const VERDICTS = {
  APPROVED:             'Approved',
  PROVISIONAL_APPROVAL: 'Provisional Approval',
  REJECTED:             'Rejected',
}
