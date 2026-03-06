import React, { useState, useEffect } from 'react';
import { UserRole, Language, PatientRecord, DRGrade } from './types';
import { TRANSLATIONS, Icons } from './constants';
import { preprocessFundusImage, runViTInference, loadModel, loadModelFromBuffer } from './services/inferenceService';
import { getMedicalExplanation, speakText } from './services/geminiService';
import GradeMeter from './components/GradeMeter';

const App: React.FC = () => {
  // --- States ---
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [lang, setLang] = useState<Language>('en'); 
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [currentExplanation, setCurrentExplanation] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});

  const t = TRANSLATIONS[lang];

  // --- Engine Initialization ---
  useEffect(() => {
    const initializeEngine = async () => {
      setModelStatus('loading');
      try {
        await loadModel();
        setModelStatus('ready');
      } catch (err: any) {
        console.error("Engine failure:", err);
        setModelStatus('missing');
        setError("Diagnostic Engine Offline");
      }
    };
    initializeEngine();
  }, []);

  // --- Core Processing Logic ---
  const processFile = async (file: File) => {
    if (modelStatus !== 'ready') {
      setError("Model not initialized.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      setAnalysisStep(lang === 'hi' ? "प्रसंस्करण..." : "Preprocessing...");
      const floatData = await preprocessFundusImage(file);
      
      setAnalysisStep(lang === 'hi' ? "विश्लेषण..." : "Analyzing...");
      const aiGrade = await runViTInference(floatData);
      
      setAnalysisStep(lang === 'hi' ? "रिपोर्ट तैयार की जा रही है..." : "Generating Report...");
      const rawExplanation = await getMedicalExplanation(aiGrade);
      
      const parsedExplanation = typeof rawExplanation === 'string' ? JSON.parse(rawExplanation) : rawExplanation;
      setCurrentExplanation(parsedExplanation);
      
      const newRecord: PatientRecord = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        patientName: "Patient_Alpha",
        image: URL.createObjectURL(file),
        aiGrade: aiGrade,
        doctorGrade: aiGrade,
        status: 'PENDING',
        timestamp: new Date().toLocaleString(),
        aiExplanation: parsedExplanation 
      };
      setRecords([newRecord, ...records]);
    } catch (err: any) {
      setError("Analysis Failed: Check Connection");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  // --- Clinician Actions ---
  const handleApproveRecord = (id: string) => {
    const doctorNotes = feedbackText[id] || "Clinically validated based on AI analysis.";
    setRecords(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'APPROVED', 
      doctorSignature: "Verified by Clinical Terminal " + new Date().toLocaleDateString(),
      rejectionReason: doctorNotes // Syncing notes to record
    } : r));
  };

  const handleRejectRecord = (id: string) => {
    const reason = feedbackText[id] || "Insufficient image clarity.";
    setRecords(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'REJECTED',
      rejectionReason: reason
    } : r));
  };

  // --- Audio Logic ---
  const handleSpeak = async (record: PatientRecord) => {
    if (speakingId === record.id) return;
    const reportData = record.aiExplanation?.[lang];
    if (!reportData) return;

    const text = `${reportData.explanation}. ${reportData.recommendations || ""}`.replace(/[\{\}\"\[\]]/g, "");
    setSpeakingId(record.id);
    try {
      await speakText(text, lang); 
    } catch (err) {
      setError("Audio engine error");
    } finally {
      setSpeakingId(null);
    }
  };

  // --- PDF Generator (Detailed) ---
  const generatePDF = (record: PatientRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const reportData = record.aiExplanation?.[lang];
    const precautionsHtml = reportData?.precautions?.map((p: string) => `<li>${p}</li>`).join('') || '<li>Standard diabetic care.</li>';

    const html = `
      <html>
        <body style="font-family:sans-serif; padding:40px; color:#1e293b; line-height:1.6;">
          <div style="text-align:center; border-bottom:4px solid #000; padding-bottom:10px; margin-bottom:20px;">
            <h1 style="margin:0; letter-spacing:-1px;">DIABETIC RETINOPATHY DIAGNOSTIC REPORT</h1>
            <p style="font-weight:bold; margin:5px; color:#64748b;">Retino AI Clinical Terminal V2.0</p>
          </div>
          <div style="display:flex; gap:40px; margin-bottom:30px; align-items:center;">
            <div style="flex:1;">
              <p><b>Scan ID:</b> ${record.id}</p>
              <p><b>Analysis Date:</b> ${record.timestamp}</p>
              <p><b>AI Severity Level:</b> <span style="font-size:18px; color:#2563eb;">${t.severityLabels[record.aiGrade]} (Grade ${record.aiGrade})</span></p>
              <p><b>Current Status:</b> ${record.status}</p>
            </div>
            <div style="flex:1; text-align:right;">
              <img src="${record.image}" style="width:220px; border-radius:15px; border:5px solid #fff; box-shadow:0 10px 15px rgba(0,0,0,0.1);" />
            </div>
          </div>
          <div style="background:#f8fafc; padding:25px; border-radius:15px; border:1px solid #e2e8f0; margin-bottom:20px;">
            <h3 style="margin-top:0; color:#2563eb; border-bottom:1px solid #cbd5e1; padding-bottom:5px;">Clinician Observations</h3>
            <p>${record.rejectionReason || 'No additional notes provided by the reviewer.'}</p>
          </div>
          <div style="background:#f8fafc; padding:25px; border-radius:15px; border:1px solid #e2e8f0;">
            <h3 style="margin-top:0; color:#2563eb; border-bottom:1px solid #cbd5e1; padding-bottom:5px;">Medical Findings & Precautions</h3>
            <p><b>Explanation:</b> ${reportData?.explanation || 'Data unavailable.'}</p>
            <p><b>Care Precautions:</b></p>
            <ul>${precautionsHtml}</ul>
          </div>
          <div style="margin-top:60px; border-top:2px dashed #cbd5e1; padding-top:20px; display:flex; justify-content:space-between;">
            <p><b>System ID:</b> AI_FL-2026</p>
            <p><b>Digital Signature:</b> ${record.doctorSignature || 'Verified Digitally'}</p>
          </div>
        </body>
      </html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 bg-[#f8fafc]">
      {/* --- HEADER --- */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl text-slate-900"><Icons.Eye /></div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter uppercase">RETINO <span className="text-blue-400">AI</span></h1>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{t.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              {(['en', 'hi'] as Language[]).map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{l}</button>
              ))}
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button onClick={() => setRole(UserRole.PATIENT)} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${role === UserRole.PATIENT ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>{t.rolePatient}</button>
              <button onClick={() => setRole(UserRole.DOCTOR)} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${role === UserRole.DOCTOR ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>{t.roleDoctor}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-10 space-y-10">
        {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex justify-between items-center shadow-sm">
          <span className="text-xs font-black uppercase flex items-center gap-2">⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>}

        {/* --- PATIENT VIEW --- */}
        {role === UserRole.PATIENT ? (
          <div className="animate-fadeIn space-y-12">
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl -mr-48 -mt-48"></div>
               <div className="flex-grow space-y-8 z-10 text-center md:text-left">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">{t.upload}</h2>
                    <p className="text-slate-500 text-lg font-medium max-w-xl">{t.disclaimer}</p>
                  </div>
                  <label className={`inline-flex bg-blue-600 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/30 cursor-pointer hover:bg-blue-700 transition-all gap-4 items-center ${isAnalyzing ? 'opacity-50' : ''}`}>
                    <Icons.Upload /> 
                    <span>{isAnalyzing ? analysisStep : t.upload}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) processFile(file); }} disabled={isAnalyzing} />
                  </label>
               </div>
               <div className="w-64 h-64 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative shadow-inner">
                 {isAnalyzing ? (
                   <div className="text-center space-y-6">
                     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-lg"></div>
                     <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest animate-pulse">{analysisStep}</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center opacity-40">
                    <div className="scale-[2.5] mb-8"><Icons.Eye /></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Scanner Ready</span>
                   </div>
                 )}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-blue-600 pl-6">Patient Dashboard</h3>
                 <div className="space-y-10">
                    {records.map(record => (
                       <div key={record.id} className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10">
                         <div className="w-full md:w-72 h-72 shrink-0 overflow-hidden rounded-[2.5rem] shadow-2xl"><img src={record.image} className="w-full h-full object-cover" /></div>
                         <div className="flex-grow space-y-6">
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${record.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{record.status}</span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">SCAN_ID: {record.id}</span>
                            </div>
                            <h4 className="text-3xl font-black text-slate-900">{t.severityLabels[record.doctorGrade ?? record.aiGrade]}</h4>
                            <GradeMeter grade={record.doctorGrade ?? record.aiGrade} />
                            
                            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-lg">
                               <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2">AI Diagnostic Summary</p>
                               <p className="text-sm italic">"{record.aiExplanation?.[lang]?.explanation || "Analyzing scan..."}"</p>
                            </div>

                            {record.status === 'APPROVED' && record.rejectionReason && (
                              <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] animate-fadeIn">
                                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Icons.Eye /> Clinician Remarks</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{record.rejectionReason}</p>
                              </div>
                            )}

                            <div className="flex gap-3 pt-2">
                              <button onClick={() => handleSpeak(record)} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black uppercase text-[10px] hover:bg-blue-50 border border-slate-200">
                                <Icons.Speaker /> {speakingId === record.id ? "Playing..." : t.readAloud}
                              </button>
                              {record.status === 'APPROVED' && (
                                <button onClick={() => generatePDF(record)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-500/20">Download Report</button>
                              )}
                            </div>
                         </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="space-y-10">
                 {currentExplanation?.[lang] && (
                   <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 animate-fadeIn">
                      <h4 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4"><Icons.Eye /> Care Precautions</h4>
                      <ul className="space-y-4">
                        {currentExplanation[lang].precautions.map((p: string, i: number) => (
                          <li key={i} className="text-sm font-bold flex gap-3"><span className="opacity-50">#0{i+1}</span> {p}</li>
                        ))}
                      </ul>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ) : (
          /* --- CLINICIAN TERMINAL VIEW --- */
          <div className="animate-fadeIn space-y-10">
            <div className="flex items-center justify-between border-b-4 border-slate-900 pb-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{t.roleDoctor} <span className="text-blue-600">Terminal</span></h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pending Review Queue: {records.filter(r => r.status === 'PENDING').length}</p>
              </div>
            </div>

            <div className="space-y-10">
                {records.map(record => (
                  <div key={record.id} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-12 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-8 py-2 font-black text-[10px] uppercase tracking-widest ${record.status === 'APPROVED' ? 'bg-green-500 text-white' : record.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>{record.status}</div>
                    
                    <div className="md:col-span-4 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
                      <img src={record.image} className="w-full h-full object-cover" />
                    </div>

                    <div className="md:col-span-5 space-y-8">
                      <div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">AI Inference Logic Output</span>
                        <h4 className="text-3xl font-black text-slate-900">{t.severityLabels[record.aiGrade]}</h4>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">AI Predicted Scale (Locked)</span>
                        <div className="grid grid-cols-5 gap-3">
                          {[0, 1, 2, 3, 4].map(g => (
                            <div 
                              key={g} 
                              className={`py-4 rounded-2xl text-[11px] font-black border text-center transition-all ${record.aiGrade === g ? 'bg-slate-900 text-white shadow-xl scale-105 border-slate-900' : 'bg-slate-50 text-slate-300 border-slate-100 opacity-50'}`}
                            >
                              {g}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Medical Feedback & Instructions</span>
                        <textarea 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="Type specific guidance for the patient here. These notes will appear on their dashboard once signed."
                          rows={3}
                          value={feedbackText[record.id] || ""}
                          onChange={(e) => setFeedbackText({...feedbackText, [record.id]: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col justify-end gap-3 border-l border-slate-100 pl-8">
                      <button onClick={() => handleApproveRecord(record.id)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">Confirm & Sign</button>
                      <button onClick={() => handleRejectRecord(record.id)} className="w-full bg-white text-red-600 border-2 border-red-100 py-5 rounded-2xl font-black uppercase text-[11px] hover:bg-red-50">Reject Diagnostic</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
      <footer className="p-10 text-center border-t border-slate-100 opacity-40">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Retino AI Terminal • {t.title}</p>
      </footer>
    </div>
  );
};

export default App;