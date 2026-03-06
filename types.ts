export enum DRGrade {
  NO_DR = 0,
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  PROLIFERATIVE = 4
}

export interface PatientRecord {
  id: string;
  patientName: string;
  image: string;
  aiGrade: DRGrade;
  doctorGrade?: DRGrade;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
  // 🚨 UPDATED: Changed from string to 'any' to support our 3-language JSON object
  aiExplanation?: any; 
  doctorSignature?: string;
  rejectionReason?: string;
}

export type Language = 'en' | 'hi' | 'te';

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR'
}

export interface TranslationSet {
  title: string;
  upload: string;
  dashboard: string;
  preliminaryReport: string;
  verifiedReport: string;
  rolePatient: string;
  roleDoctor: string;
  severityLabels: Record<DRGrade, string>;
  precautions: string;
  recommendations: string;
  explainBtn: string;
  readAloud: string;
  approve: string;
  correction: string;
  disclaimer: string;
}