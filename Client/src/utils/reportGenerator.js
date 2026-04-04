import { jsPDF } from 'jspdf'

/**
 * reportGenerator.js
 * 
 * Generates a professional PDF report for seed inspections.
 */
export const generateReport = (current, stagesData, inspector = {}) => {
  const doc = new jsPDF()
  const margin = 20
  let y = 30

  // 1. Header
  doc.setFillColor(5, 150, 105) // Emerald-600
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('SeedInspect Pro', margin, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Official Seed Inspection Certificate', margin, 32)
  
  // 2. Metadata Section (Horizontal Divider Row)
  y = 55
  doc.setTextColor(15, 23, 42) // Slate-900
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

  // 3. Farmer & Location Information
  y += 25
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('2. Farmer & Location Profile', margin, y)
  
  y += 10
  const fieldDetails = current.field || {}
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

  // 4. Seed Producer & Field ID
  y += 30
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('3. Producer & Field Details', margin, y)
  
  y += 10
  const producerInfo = [
    { label: 'Seed Producer:', value: fieldDetails.seedProducer || 'N/A' },
    { label: 'Field ID:', value: fieldDetails.fieldId || 'N/A' },
    { label: 'Application No:', value: fieldDetails.applicationNumber || 'N/A' },
    { label: 'Field Location:', value: fieldDetails.fieldLocation || 'N/A' }
  ]
  
  producerInfo.forEach((item, i) => {
     const row = Math.floor(i / 2); const col = i % 2
     const xPos = margin + (col * 90); const yPos = y + (row * 8)
     doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text(item.label, xPos, yPos)
     doc.setFont('helvetica', 'normal'); doc.text(String(item.value), xPos + 50, yPos)
  })

  // 4. Inspection Stages Section
  y += 30
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Stage Inspection Summaries', margin, y)
  
  current.stages.forEach((stage, index) => {
    y += 15
    if (y > 250) {
      doc.addPage()
      y = 30
    }
    
    // Stage Header
    doc.setFillColor(243, 244, 246)
    doc.rect(margin, y - 5, 170, 10, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(5, 150, 105)
    doc.text(`Stage ${stage.stageNumber}: ${stage.stageNumber === 1 ? 'Vegetative' : stage.stageNumber === 2 ? 'Flowering' : 'Pre-Harvest'}`, margin + 5, y)
    
    y += 10
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    // Dynamically list stage values (flattened)
    const data = stage.data || {}
    let flatItems = []
    
    const flatten = (obj, prefix = '') => {
      Object.entries(obj).forEach(([key, val]) => {
        if (val === null || val === undefined) return
        
        if (typeof val === 'object' && !Array.isArray(val)) {
          flatten(val, prefix + key + ' ')
        } else {
          // Add item if value is present or specifically boolean false/number 0
          if (String(val) !== '' || val === false || val === 0) {
            flatItems.push([prefix + key, val])
          }
        }
      })
    }
    flatten(data)
    
    if (flatItems.length === 0) {
       doc.setFont('helvetica', 'italic')
       doc.text('No detailed data recorded for this stage.', margin + 10, y)
       y += 10
    } else {
      flatItems.forEach((item) => {
         if (y > 270) {
            doc.addPage()
            y = 30
         }
         // Format label: camelCase/nested to Title Case
         const rawLabel = item[0]
         const cleanLabel = rawLabel
           .replace(/([A-Z])/g, ' $1')
           .replace(/^./, str => str.toUpperCase())
           .trim()

         doc.setFont('helvetica', 'bold')
         doc.text(`${cleanLabel}:`, margin + 10, y)
         
         const textValue = item[1] === true ? 'Yes' : item[1] === false ? 'No' : String(item[1])
         doc.setFont('helvetica', 'normal')
         doc.text(textValue, margin + 85, y) // Increased offset to 85 for clearer separation
         y += 8
      })
    }
    
    if (data.notes) {
       doc.setFont('helvetica', 'italic')
       doc.text('Notes:', margin + 10, y)
       doc.text(data.notes, margin + 25, y, { maxWidth: 150 })
       y += Math.ceil(data.notes.length / 80) * 8
    }
  })

  // 5. Final Verdict (if applicable)
  if (current.verdict) {
    y += 15
    if (y > 250) {
      doc.addPage()
      y = 30
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Final Determination', margin, y)
    
    y += 10
    doc.setFontSize(12)
    doc.setTextColor(current.verdict === 'Approved' ? 5 : 220, current.verdict === 'Approved' ? 150 : 38, current.verdict === 'Approved' ? 105 : 38)
    doc.text(`VERDICT: ${current.verdict.toUpperCase()}`, margin, y)
    
    if (current.summaryNotes) {
      y += 8
      doc.setTextColor(15, 23, 42)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.text(`Inspector Remarks: ${current.summaryNotes}`, margin, y, { maxWidth: 170 })
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount} | SeedInspect Pro - Verification System`, 105, 290, { align: 'center' })
  }

  // Save
  const fileName = `SeedInspect-Report-${current.cropType || 'Crop'}-${new Date().getTime()}.pdf`
  doc.save(fileName)
}
