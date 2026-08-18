'use client';

import React, { useState } from 'react';
import { DocumentItem } from '@/types';
import { useOperations } from '@/context/OperationsContext';
import { 
  X, CheckCircle2, AlertTriangle, ShieldCheck, 
  FileText, Download, User, Sparkles, ExternalLink, 
  Eye, Calendar, Hash, ShieldAlert, Check
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface DocumentInspectionModalProps {
  document: DocumentItem;
  onClose: () => void;
}

export const DocumentInspectionModal: React.FC<DocumentInspectionModalProps> = ({ document, onClose }) => {
  const { 
    updateDocumentStatus, 
    setCurrentTab, 
    setSelectedFighterId,
    escalateFighter
  } = useOperations();

  const [status, setStatus] = useState(document.verificationStatus);

  const handleStatusChange = (newStatus: DocumentItem['verificationStatus']) => {
    setStatus(newStatus);
    updateDocumentStatus(document.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-red-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">{document.title}</h2>
                <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                  {document.fileSize}
                </span>
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Fighter: <strong className="text-white">{document.fighterName}</strong> • {document.fileName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={status} size="md" />
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Split Left Preview & Right OCR breakdown */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 custom-scrollbar">
          {/* Left Column: Visual Document Mock Preview */}
          <div className="p-6 bg-neutral-100/70 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                <span>Document Visual Canvas</span>
                <span className="text-[10px] font-mono text-neutral-400">PDF / 300 DPI Rendering</span>
              </div>

              {/* Stylized Document Mock Sheet */}
              <div className="bg-white border border-neutral-300 rounded-xl p-6 shadow-md space-y-4 text-xs font-mono text-neutral-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rotate-45 transform translate-x-8 -translate-y-8" />
                
                <div className="flex items-center justify-between border-b pb-3 border-neutral-200">
                  <div className="font-bold font-sans text-neutral-900 text-xs uppercase tracking-wider">
                    {document.category === 'passport' ? 'PASSPORT / TRAVEL IDENTIFICATION' : 
                     document.category === 'medical' ? 'OFFICIAL MEDICAL & DIAGNOSTIC CLEARANCE' :
                     'BOUT AGREEMENT & LEGAL ATTESTATION'}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center font-black">
                    CW
                  </div>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div><strong className="text-neutral-500 font-sans">SUBJECT ATHLETE:</strong> {document.fighterName.toUpperCase()}</div>
                  <div><strong className="text-neutral-500 font-sans">CATEGORY:</strong> {document.category.toUpperCase()}</div>
                  <div><strong className="text-neutral-500 font-sans">UPLOAD RECORD:</strong> {document.uploadDate}</div>
                  <div><strong className="text-neutral-500 font-sans">SECURITY HASH:</strong> SHA256:{document.id.toUpperCase()}</div>
                </div>

                {document.extractedFields && Object.keys(document.extractedFields).length > 0 && (
                  <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-[10px] space-y-1">
                    <div className="font-bold text-neutral-600 font-sans uppercase">OCR Field Dump:</div>
                    {Object.entries(document.extractedFields).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-neutral-500">{k}:</span>
                        <span className="font-bold text-neutral-900">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Cage Warriors Regulatory Operations</span>
                  <span className="text-emerald-700 font-bold">DIGITALLY WATERMARKED</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-3">
              <span>File format: PDF / Image</span>
              <button 
                onClick={() => alert(`Simulated downloading ${document.fileName}`)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Extraction & Verification controls */}
          <div className="p-6 bg-white space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    AI OCR Key-Value Breakdown
                  </h3>
                </div>
                {document.aiConfidence && (
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    Confidence: {document.aiConfidence}%
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                Structured fields parsed and mapped to compliance requirements.
              </p>
            </div>

            {/* Extracted Fields Table */}
            {document.extractedFields && Object.keys(document.extractedFields).length > 0 ? (
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-xs">
                {Object.entries(document.extractedFields).map(([key, val]) => (
                  <div key={key} className="p-2.5 flex items-center justify-between hover:bg-neutral-50">
                    <span className="text-neutral-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono font-bold text-neutral-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-xl text-xs text-neutral-500 text-center">
                No OCR fields detected for this file.
              </div>
            )}

            {/* Manual Verification Status Selector */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Staff Verification Override:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusChange('Verified')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === 'Verified'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 border border-neutral-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Verified</span>
                </button>

                <button
                  onClick={() => handleStatusChange('Needs Review')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === 'Needs Review'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-800 border border-neutral-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Needs Review</span>
                </button>
              </div>
            </div>

            {/* Quick Navigation to Fighter */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  setSelectedFighterId(document.fighterId);
                  setCurrentTab('fighters');
                }}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Open {document.fighterName}&apos;s Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-mono">Document Record: {document.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
