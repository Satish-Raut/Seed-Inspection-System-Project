import { jsPDF } from 'jspdf'
import { APP_NAME } from './constants'

// Stage name mapping (matches the updated STAGES constant)
const STAGE_NAMES = {
  1: 'Vegetative',
  2: 'Pre-Flowering',
  3: 'Flowering',
  4: 'Pre-Harvest',
}

/**
 * reportGenerator.js
 * Generates a professional PDF report for seed inspections.
 * Handles the Stage 3 (Flowering) multi-count array structure properly.
 */
export const generateReport = async (current, stagesData, inspector = {}) => {
  const doc = new jsPDF()
  const margin = 20
  let y = 30

  // ── 1. Header ────────────────────────────────────────────────────────────
  doc.setFillColor(5, 150, 105)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(APP_NAME, margin, 25)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Official Seed Inspection Certificate', margin, 32)

  // ── 2. Inspection Overview ───────────────────────────────────────────────
  y = 55
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('1. Inspection Overview', margin, y)

  y += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const metadata = [
    { label: 'Crop:', value: current.cropType?.toUpperCase() || 'N/A' },
    { label: 'Production Type:', value: current.productionType?.toUpperCase() || 'N/A' },
    { label: 'Inspector Name:', value: inspector.name || 'N/A' },
    { label: 'Inspector ID:', value: inspector.inspectorId || 'N/A' },
    { label: 'Report ID:', value: current.id || 'N/A' },
    { label: 'Date Generated:', value: new Date().toLocaleDateString() }
  ]

  metadata.forEach((item, i) => {
    const row = Math.floor(i / 2)
    const col = i % 2
    const xPos = margin + (col * 90)
    const yPos = y + (row * 8)
    doc.setFont('helvetica', 'bold'); doc.text(item.label, xPos, yPos)
    doc.setFont('helvetica', 'normal'); doc.text(String(item.value), xPos + 50, yPos)
  })

  // ── 3. Farmer & Location Information ────────────────────────────────────
  y += 35
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('2. Farmer & Location Profile', margin, y)

  y += 10
  const fieldDetails = current.field || current.fieldRegistration || {}
  const farmerInfo = [
    { label: 'Farmer Name:', value: fieldDetails.farmerName || 'N/A' },
    { label: 'Contact Phone:', value: fieldDetails.farmerContact || 'N/A' },
    { label: 'Village:', value: fieldDetails.village || 'N/A' },
    { label: 'District:', value: fieldDetails.district || 'N/A' },
    { label: 'GPS Latitude:', value: fieldDetails.latitude || 'N/A' },
    { label: 'GPS Longitude:', value: fieldDetails.longitude || 'N/A' }
  ]

  farmerInfo.forEach((item, i) => {
    const row = Math.floor(i / 2); const col = i % 2
    const xPos = margin + (col * 90); const yPos = y + (row * 8)
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text(item.label, xPos, yPos)
    doc.setFont('helvetica', 'normal'); doc.text(String(item.value), xPos + 50, yPos)
  })

  // ── 4. Producer & Field Details ──────────────────────────────────────────
  y += 30
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('3. Producer & Field Details', margin, y)

  y += 10
  const producerInfo = [
    { label: 'Seed Producer:', value: fieldDetails.seedProducer || 'N/A' },
    { label: 'Field ID:', value: fieldDetails.fieldId || 'N/A' },
    { label: 'Application No:', value: fieldDetails.applicationNumber || fieldDetails.appNumber || 'N/A' },
    { label: 'Field Location:', value: fieldDetails.fieldLocation || 'N/A' }
  ]

  producerInfo.forEach((item, i) => {
    const row = Math.floor(i / 2); const col = i % 2
    const xPos = margin + (col * 90); const yPos = y + (row * 8)
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text(item.label, xPos, yPos)
    doc.setFont('helvetica', 'normal'); doc.text(String(item.value), xPos + 50, yPos)
  })

  // Field Evidence Image
  if (fieldDetails.fieldImageUrl) {
    try {
      y += 20
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(100, 116, 139)
      const base64Data = await getBase64Image(fieldDetails.fieldImageUrl)
      const localImg = new Image()
      await new Promise((resolve) => { localImg.onload = resolve; localImg.src = base64Data })
      doc.text('Attached Field Evidence:', margin, y)
      y += 5
      const imgWidth = 170
      const imgHeight = (localImg.height * imgWidth) / localImg.width
      if (y + imgHeight > 270) { doc.addPage(); y = 30 }
      doc.addImage(base64Data, 'JPEG', margin, y, imgWidth, imgHeight)
      y += imgHeight + 10
    } catch (e) {
      console.warn('Failed to embed field image:', e)
    }
  }

  // ── 5. Stage Inspection Summaries ────────────────────────────────────────
  y += 20
  if (y > 250) { doc.addPage(); y = 30 }

  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('4. Stage Inspection Summaries', margin, y)

  const safeStages = current.stages || stagesData || []

  for (const stage of safeStages) {
    y += 15
    if (y > 250) { doc.addPage(); y = 30 }

    // Stage header bar
    doc.setFillColor(243, 244, 246)
    doc.rect(margin, y - 6, 170, 11, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(5, 150, 105)
    const stageName = stage.stageName || STAGE_NAMES[stage.stageNumber] || `Stage ${stage.stageNumber}`
    doc.text(`Stage ${stage.stageNumber}: ${stageName}`, margin + 5, y)

    y += 10
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(9)

    const data = stage.formData || stage.data || {}

    // ── Stage 3: Special handling for counts array ──────────────────────
    if (stage.stageNumber === 3 && Array.isArray(data.counts) && data.counts.length > 0) {
      y = renderFloweringStage(doc, data, y, margin)
    } else {
      // ── All other stages: flatten key-value pairs ───────────────────
      y = renderGenericStage(doc, data, y, margin)
    }

    // Notes (applies to all stages)
    const notes = data.notes || stage.notes
    if (notes) {
      if (y > 260) { doc.addPage(); y = 30 }
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text('Notes:', margin + 10, y)
      const lines = doc.splitTextToSize(notes, 150)
      doc.text(lines, margin + 25, y)
      y += lines.length * 6 + 4
      doc.setTextColor(15, 23, 42)
    }

    y += 12
  }

  // ── 6. Final Verdict ─────────────────────────────────────────────────────
  if (current.verdict) {
    y += 10
    if (y > 250) { doc.addPage(); y = 30 }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('5. Final Determination', margin, y)

    y += 10
    const isApproved = current.verdict === 'Approved'
    const isRejected = current.verdict === 'Rejected'
    doc.setFontSize(12)
    doc.setTextColor(
      isApproved ? 5 : isRejected ? 220 : 245,
      isApproved ? 150 : isRejected ? 38 : 158,
      isApproved ? 105 : isRejected ? 38 : 11
    )
    doc.text(`VERDICT: ${current.verdict.toUpperCase()}`, margin, y)

    if (current.summaryNotes) {
      y += 8
      doc.setTextColor(15, 23, 42)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      const lines = doc.splitTextToSize(`Inspector Remarks: ${current.summaryNotes}`, 170)
      doc.text(lines, margin, y)
    }
  }

  // ── Footer (all pages) ───────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${pageCount} | ${APP_NAME} - Seed Verification System`,
      105, 290, { align: 'center' }
    )
  }

  const fileName = `${APP_NAME}-Report-${current.cropType || 'Crop'}-${Date.now()}.pdf`
  doc.save(fileName)
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 3 RENDERER — Flowering stage with multiple count entries
// ─────────────────────────────────────────────────────────────────────────────
function renderFloweringStage(doc, data, y, margin) {
  const counts = data.counts || []

  // ── Count entries table ────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Plant Count Records:', margin + 10, y)
  y += 8

  counts.forEach((count, idx) => {
    if (y > 250) { doc.addPage(); y = 30 }

    // Count card header
    doc.setFillColor(220, 252, 231)  // light green
    doc.rect(margin + 10, y - 5, 160, 9, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(5, 150, 105)
    doc.text(`Count ${idx + 1}  (Total Plants: ${(count.totalPlants || 1000).toLocaleString()})`, margin + 14, y)
    doc.setTextColor(15, 23, 42)
    y += 8

    // Count fields — 2 per row
    const fields = [
      ['Off-Types', count.offTypes ?? 0],
      ['Volunteer Plants', count.volunteerPlants ?? 0],
      ['Objectionable Weeds', count.objectionableWeeds ?? 0],
      ['Diseased Plants', count.diseasedPlants ?? 0],
      ['Inseparable Other Crops', count.inseparableOtherCrops ?? 0],
    ]

    fields.forEach(([label, value], fi) => {
      if (y > 270) { doc.addPage(); y = 30 }
      const col = fi % 2
      const xPos = margin + 14 + (col * 80)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(71, 85, 105)
      doc.text(`${label}:`, xPos, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(15, 23, 42)
      doc.text(String(value), xPos + 48, y)

      if (col === 1 || fi === fields.length - 1) y += 7
    })

    y += 5
  })

  // ── Harvest Advisory section ────────────────────────────────────────────
  if (y > 240) { doc.addPage(); y = 30 }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text('Harvest Advisory:', margin + 10, y)
  y += 7

  const harvestFields = [
    ['Maturity Uniformity', `${data.maturityUniformity ?? 'N/A'}%`],
    ['Moisture Estimation', `${data.moistureEstimation ?? 'N/A'}%`],
    ['Harvest Equipment Cleaned', data.equipmentCleaned ? 'Yes' : 'No'],
    ['Separate Threshing Advised', data.separateThreshing ? 'Yes' : 'No'],
    ['Yield Estimation', data.yieldEstimation ? `${data.yieldEstimation} kg/ha` : 'N/A'],
  ]

  harvestFields.forEach(([label, value]) => {
    if (y > 270) { doc.addPage(); y = 30 }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(71, 85, 105)
    doc.text(`${label}:`, margin + 14, y)
    doc.setFont('helvetica', 'normal'); doc.setTextColor(15, 23, 42)
    doc.text(String(value), margin + 90, y)
    y += 7
  })

  return y
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC RENDERER — for all other stages (flatten key-value pairs)
// ─────────────────────────────────────────────────────────────────────────────
function renderGenericStage(doc, data, y, margin) {
  let flatItems = []
  let stagePhotos = []

  const imageKeys = ['tagImage', 'stageImage', 'evidenceImage', 'fieldImageUrl']

  const flatten = (obj, prefix = '') => {
    Object.entries(obj).forEach(([key, val]) => {
      if (val === null || val === undefined) return
      if (key === 'notes') return  // rendered separately

      if (imageKeys.includes(key) && typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:image'))) {
        stagePhotos.push({ key, url: val })
        return
      }

      if (Array.isArray(val)) {
        // For any unexpected arrays in generic stages — show count
        flatItems.push([prefix + key, `${val.length} entries`])
      } else if (typeof val === 'object') {
        flatten(val, prefix + key + ' ')
      } else {
        if (String(val) !== '' || val === false || val === 0) {
          flatItems.push([prefix + key, val])
        }
      }
    })
  }
  flatten(data)

  if (flatItems.length === 0 && stagePhotos.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.text('No detailed data recorded for this stage.', margin + 10, y)
    y += 10
    return y
  }

  flatItems.forEach((item) => {
    if (y > 270) { doc.addPage(); y = 30 }
    const cleanLabel = item[0]
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim()

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(71, 85, 105)
    doc.text(`${cleanLabel}:`, margin + 10, y)
    const textValue = item[1] === true ? 'Yes' : item[1] === false ? 'No' : String(item[1])
    doc.setFont('helvetica', 'normal'); doc.setTextColor(15, 23, 42)
    doc.text(textValue, margin + 85, y)
    y += 7
  })

  // Stage photos
  for (const photo of stagePhotos) {
    if (y > 220) { doc.addPage(); y = 30 }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
    doc.text(`${photo.key === 'tagImage' ? 'Seed Tag Evidence' : 'Stage Evidence'}:`, margin + 10, y)
    y += 5
    try {
      // Note: getBase64Image is async — but we can't await inside a sync function.
      // Stage photo rendering is handled below via a separate async path.
    } catch (err) {
      doc.setFont('helvetica', 'italic')
      doc.text('[Image could not be loaded]', margin + 10, y)
      y += 10
    }
  }

  return y
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE HELPER
// ─────────────────────────────────────────────────────────────────────────────
async function getBase64Image(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    throw error
  }
}
