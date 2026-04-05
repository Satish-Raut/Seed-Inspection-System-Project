import { jsPDF } from 'jspdf'
import { APP_NAME } from './constants'

/**
 * reportGenerator.js
 * 
 * Generates a professional PDF report for seed inspections.
 */
export const generateReport = async (current, stagesData, inspector = {}) => {
  const doc = new jsPDF()
  const margin = 20
  let y = 30

  // 1. Header
  doc.setFillColor(5, 150, 105) // Emerald-600
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(APP_NAME, margin, 25)
  
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

  // 3.5 Field Evidence Image
  if (fieldDetails.fieldImageUrl) {
    try {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(100, 116, 139)
      
      // Bypass Canvas pollution natively with a raw Blob pipeline!
      const response = await fetch(fieldDetails.fieldImageUrl)
      const blob = await response.blob()
      
      const base64Data = await new Promise((resolve) => {
         const reader = new FileReader()
         reader.onloadend = () => resolve(reader.result)
         reader.readAsDataURL(blob)
      })

      const localImg = new Image()
      await new Promise((resolve) => {
         localImg.onload = resolve
         localImg.src = base64Data
      })

      // Divider
      y += 20
      doc.text('Attached Field Evidence:', margin, y)
      
      y += 5
      
      const imgWidth = 170
      const imgHeight = (localImg.height * imgWidth) / localImg.width
      
      if (y + imgHeight > 270) {
        doc.addPage()
        y = 30
      }
      
      doc.addImage(base64Data, 'JPEG', margin, y, imgWidth, imgHeight)
      y += imgHeight + 10
    } catch (e) {
      console.warn("Failed to securely load or embed Certificate Field Image:", e)
    }
  }

  // 4. Inspection Stages Section
  y += 30
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Stage Inspection Summaries', margin, y)
  
  const safeStages = current.stages || stagesData || [];
  
  for (const [index, stage] of safeStages.entries()) {
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
    const data = stage.formData || stage.data || {}
    let flatItems = []
    let stagePhotos = []
    
    const flatten = (obj, prefix = '') => {
      Object.entries(obj).forEach(([key, val]) => {
        if (val === null || val === undefined) return
        
        // Identify images to render separately
        const imageKeys = ['tagImage', 'stageImage', 'evidenceImage', 'fieldImageUrl']
        if (imageKeys.includes(key) && (typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:image')))) {
          stagePhotos.push({ key, url: val })
          return
        }

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
    
    if (flatItems.length === 0 && stagePhotos.length === 0) {
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

      // Render Stage Images
      for (const photo of stagePhotos) {
        if (y > 220) {
          doc.addPage()
          y = 30
        }
        y += 5
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text(`${photo.key === 'tagImage' ? 'Seed Tag Evidence' : 'Stage Evidence'}:`, margin + 10, y)
        y += 5
        try {
          const imgBase64 = await getBase64Image(photo.url)
          doc.addImage(imgBase64, 'JPEG', margin + 10, y, 60, 45) // Smaller stage photos
          y += 50
        } catch (err) {
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(200, 0, 0)
          doc.text(`[Image attachment failed to load]`, margin + 10, y + 5)
          doc.setTextColor(0, 0, 0)
          y += 10
        }
      }
    }
    
    if (data.notes) {
       doc.setFont('helvetica', 'italic')
       doc.text('Notes:', margin + 10, y)
       doc.text(data.notes, margin + 25, y, { maxWidth: 150 })
       y += Math.ceil(data.notes.length / 80) * 8
    }
    
    y += 15
  }

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
    doc.text(`Page ${i} of ${pageCount} | ${APP_NAME} - Verification System`, 105, 290, { align: 'center' })
  }

  // Save
  const fileName = `${APP_NAME}-Report-${current.cropType || 'Crop'}-${new Date().getTime()}.pdf`
  doc.save(fileName)
}
