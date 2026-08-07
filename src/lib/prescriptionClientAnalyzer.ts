export function parsePrescriptionClientSide(fileName: string = 'prescription.jpg') {
  const today = new Date().toISOString().split('T')[0];

  return {
    report_name: fileName,
    prescription_date: today,
    ocr_confidence: 0.0,
    overall_confidence: 0.0,
    medicine_count: 0,
    doctor_notes: undefined,
    medicines: [],
    unreadable_text: ['Medicine could not be read clearly from this document.'],
    warnings: ['Medicine could not be read clearly. Please upload a clear doctor prescription image or PDF.'],
  };
}
