import React from 'react';

export const Icons = {
  Eye: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Microphone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Speaker: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  )
};

export const TRANSLATIONS: any = {
  en: {
    upload: "Upload Fundus Scan",
    dashboard: "Patient Dashboard",
    preliminaryReport: "Medical Guidance",
    verifiedReport: "Verified Report",
    rolePatient: "Patient",
    roleDoctor: "Clinician",
    severityLabels: {
      0: "No Diabetic Retinopathy",
      1: "Mild NPDR",
      2: "Moderate NPDR",
      3: "Severe NPDR",
      4: "Proliferative DR"
    },
    precautions: "Precautions",
    recommendations: "Professional Recommendation",
    disclaimer: "AI-generated results for screening only. Consult a specialist for final diagnosis."
  },
  hi: {
    upload: "फंडस स्कैन अपलोड करें",
    dashboard: "रोगी डैशबोर्ड",
    preliminaryReport: "चिकित्सा मार्गदर्शन",
    verifiedReport: "सत्यापित रिपोर्ट",
    rolePatient: "मरीज",
    roleDoctor: "डॉक्टर",
    severityLabels: {
      0: "कोई डायबिटिक रेटिनोपैथी नहीं",
      1: "हल्का NPDR",
      2: "मध्यम NPDR",
      3: "गंभीर NPDR",
      4: "प्रोलिफेरेटिव DR"
    },
    precautions: "सावधानियां",
    recommendations: "पेशेवर सिफारिश",
    disclaimer: "AI द्वारा उत्पन्न परिणाम केवल स्क्रीनिंग के लिए हैं। अंतिम निदान के लिए विशेषज्ञ से परामर्श लें।"
  },
  te: {
    upload: "ఫండస్ స్కాన్ అప్‌లోడ్ చేయండి",
    dashboard: "రోగి డాష్‌బోర్డ్",
    preliminaryReport: "వైద్య మార్గదర్శకత్వం",
    verifiedReport: "ధృవీకరించబడిన నివేదిక",
    rolePatient: "రోగి",
    roleDoctor: "వైద్యుడు",
    severityLabels: {
      0: "డయాబెటిక్ రెటినోపతి లేదు",
      1: "మైల్డ్ NPDR",
      2: "మోడరేట్ NPDR",
      3: "సివియర్ NPDR",
      4: "ప్రొలిఫెరేటివ్ DR"
    },
    precautions: "ముందుజాగ్రత్తలు",
    recommendations: "వృత్తిపరమైన సిఫార్సు",
    disclaimer: "AI ద్వారా రూపొందించబడిన ఫలితాలు స్క్రీనింగ్ కోసం మాత్రమే. తుది నిర్ధారణ కోసం నిపుణుడిని సంప్రదించండి."
  }
};