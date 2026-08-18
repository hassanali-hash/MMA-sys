'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  X, Upload, Sparkles, CheckCircle2, Loader2, 
  FileText, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SampleDocPreset {
  title: string;
  category: 'passport' | 'medical' | 'contract' | 'travel';
  fileName: string;
  fileSize: string;
  ocrData: Record<string, string>;
  confidence: number;
}

export const UploadModal: React.FC = () => {
  const { 
    isUploadModalOpen, 
    setIsUploadModalOpen, 
    uploadTargetFighterId, 
    fighters, 
    addDocument,
    updateFighterRequirement
  } = useOperations();

  const [selectedPreset, setSelectedPreset] = useState<SampleDocPreset | null>(null);
  const [targetFighterId, setTargetFighterId] = useState<string>(uploadTargetFighterId || fighters[0]?.id || '');
  const [stage, setStage] = useState<'IDLE' | 'UPLOADING' | 'CLASSIFYING' | 'EXTRACTING' | 'MATCHING' | 'COMPLETE'>('IDLE');
  const [progress, setProgress] = useState(0);

  if (!isUploadModalOpen) return null;

  const currentFighter = fighters.find(f => f.id === (uploadTargetFighterId || targetFighterId)) || fighters[0];

  const presets: SampleDocPreset[] = [
    {
      title: 'Valid Passport (Biometric MRZ)',
      category: 'passport',
      fileName: `${currentFighter.name.replace(/\s+/g, '_')}_Passport_2026.pdf`,
      fileSize: '3.4 MB',
      confidence: 99,
      ocrData: {
        documentType: 'Passport',
        fullName: currentFighter.name,
        nationality: currentFighter.country,
        expiryDate: '2032-11-20',
        mrzChecksum: 'VALID'
      }
    },
    {
      title: 'Blood Serology Lab Panel (UKAD)',
      category: 'medical',
      fileName: `${currentFighter.name.replace(/\s+/g, '_')}_Blood_Serology_Lab.pdf`,
      fileSize: '2.1 MB',
      confidence: 97,
      ocrData: {
        testType: 'Blood Serology (HIV/HepB/HepC)',
        result: 'ALL NEGATIVE / NON-REACTIVE',
        labName: 'Quest Diagnostics / UKAD Accredited',
        testDate: '2026-08-14'
      }
    },
    {
      title: 'Brain MRI Diagnostic Radiology Report',
      category: 'medical',
      fileName: `${currentFighter.name.replace(/\s+/g, '_')}_MRI_Brain_Scan.pdf`,
      fileSize: '5.8 MB',
      confidence: 98,
      ocrData: {
        modality: 'MRI Brain & MRA Intracranial',
        finding: 'No acute intracranial pathology or hemorrhage',
        radiologist: 'Dr. Sarah Jenkins, MD',
        date: '2026-07-28'
      }
    },
    {
      title: 'Signed Official Bout Contract',
      category: 'contract',
      fileName: `${currentFighter.name.replace(/\s+/g, '_')}_CW198_Signed_Agreement.pdf`,
      fileSize: '1.9 MB',
      confidence: 100,
      ocrData: {
        event: 'Cage Warriors 198',
        opponent: currentFighter.opponentName,
        weightClass: currentFighter.weightClass,
        signatureStatus: 'VERIFIED DIGITAL SIGNATURE'
      }
    },
    {
      title: 'Confirmed Flight Travel Itinerary',
      category: 'travel',
      fileName: `${currentFighter.name.replace(/\s+/g, '_')}_Flight_MAN_Itinerary.pdf`,
      fileSize: '890 KB',
      confidence: 96,
      ocrData: {
        destination: 'Manchester (MAN)',
        departureCity: currentFighter.country === 'Portugal' ? 'Lisbon (LIS)' : 'Rome (FCO)',
        arrivalDate: '2026-10-22 14:15',
        airline: 'British Airways BA-1442'
      }
    }
  ];

  const handleStartUpload = (preset: SampleDocPreset) => {
    setSelectedPreset(preset);
    setStage('UPLOADING');
    setProgress(20);

    setTimeout(() => {
      setStage('CLASSIFYING');
      setProgress(50);
    }, 600);

    setTimeout(() => {
      setStage('EXTRACTING');
      setProgress(80);
    }, 1200);

    setTimeout(() => {
      setStage('MATCHING');
      setProgress(95);
    }, 1800);

    setTimeout(async () => {
      setStage('COMPLETE');
      setProgress(100);

      await addDocument({
        fighterId: currentFighter.id,
        fighterName: currentFighter.name,
        title: preset.title,
        fileName: preset.fileName,
        fileSize: preset.fileSize,
        fileType: 'pdf',
        category: preset.category,
        uploadedBy: currentFighter.managerName,
        uploaderRole: 'Manager',
        aiConfidence: preset.confidence,
        verificationStatus: 'Verified',
        extractedFields: preset.ocrData,
        ocrSnippet: JSON.stringify(preset.ocrData)
      });

      // Match corresponding requirement and mark complete
      const matchingReq = currentFighter.requirements.find(r => 
        (preset.category === 'passport' && r.category === 'identity') ||
        (preset.category === 'medical' && r.category === 'medical') ||
        (preset.category === 'contract' && r.category === 'contract') ||
        (preset.category === 'travel' && r.category === 'travel')
      );

      if (matchingReq) {
        updateFighterRequirement(currentFighter.id, matchingReq.id, 'COMPLETE', 'Auto-verified by AI OCR vision model');
      }

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 2400);
  };

  const handleClose = () => {
    setStage('IDLE');
    setProgress(0);
    setSelectedPreset(null);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Upload & AI OCR Pipeline Simulator</h2>
              <div className="text-xs text-neutral-400 mt-0.5">
                Target Fighter: <strong className="text-white">{currentFighter.name}</strong> ({currentFighter.weightClass})
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {stage === 'IDLE' ? (
            <>
              {/* Fighter Selector if opened generally */}
              {!uploadTargetFighterId && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                    Select Target Fighter Roster:
                  </label>
                  <select
                    value={targetFighterId}
                    onChange={e => setTargetFighterId(e.target.value)}
                    className="w-full text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-800"
                  >
                    {fighters.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.weightClass} • {f.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Presets List */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Select a Sample Document to Run Through AI Engine:
                </div>
                <div className="space-y-2">
                  {presets.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleStartUpload(preset)}
                      className="p-3.5 bg-neutral-50 hover:bg-red-50/50 border border-neutral-200 hover:border-red-300 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:text-red-600 group-hover:border-red-200 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                            {preset.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            {preset.fileName} ({preset.fileSize})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-neutral-100 group-hover:bg-red-100 text-neutral-700 group-hover:text-red-800 px-2 py-0.5 rounded">
                          Simulate
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Multi-stage Progress View */
            <div className="py-6 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
                {stage === 'COMPLETE' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-neutral-900">
                  {stage === 'UPLOADING' && 'Step 1/4: Ingesting Binary Document Stream...'}
                  {stage === 'CLASSIFYING' && 'Step 2/4: Classifying Document Category & Layout...'}
                  {stage === 'EXTRACTING' && 'Step 3/4: Executing High-Precision OCR & Key Extraction...'}
                  {stage === 'MATCHING' && 'Step 4/4: Matching Against Event Compliance Checklist...'}
                  {stage === 'COMPLETE' && 'Document Cleared & Fighter Readiness Updated!'}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  {selectedPreset?.title} • {selectedPreset?.fileName}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-700">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* OCR Dump during or after */}
              {selectedPreset && (
                <div className="max-w-md mx-auto p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left text-xs space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                    <span>Parsed OCR Fields</span>
                    <span className="text-emerald-700 font-mono font-bold">Confidence: {selectedPreset.confidence}%</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {Object.entries(selectedPreset.ocrData).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-neutral-500">{k}:</span>
                        <span className="font-bold text-neutral-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage === 'COMPLETE' && (
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
