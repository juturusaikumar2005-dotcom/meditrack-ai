import { runPrescriptionPipeline } from './prescriptionPipeline';
import { parsePrescriptionClientSide } from './prescriptionClientAnalyzer';

export { runPrescriptionPipeline, parsePrescriptionClientSide };

export const PrescriptionAnalyzer = {
  analyze: runPrescriptionPipeline,
  parseClientSide: parsePrescriptionClientSide,
};

export default PrescriptionAnalyzer;
