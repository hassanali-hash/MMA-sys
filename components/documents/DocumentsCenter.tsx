'use client';

import React, { useState, useMemo } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { DocumentItem } from '@/types';
import { 
  FileText, Search, Filter, Upload, Download, 
  Eye, CheckCircle2, Clock, AlertTriangle, 
  ShieldCheck, User, Sparkles, LayoutGrid, List
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DocumentInspectionModal } from '@/components/documents/DocumentInspectionModal';

export const DocumentsCenter: React.FC = () => {
  const { 
    documents, 
    selectedDocumentId, 
    setSelectedDocumentId, 
    setIsUploadModalOpen,
    setCurrentTab,
    setSelectedFighterId
  } = useOperations();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | DocumentItem['category']>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DocumentItem['verificationStatus']>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('TABLE');
  const [inspectDoc, setInspectDoc] = useState<DocumentItem | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fighterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (categoryFilter !== 'ALL' && doc.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && doc.verificationStatus !== statusFilter) return false;

      return true;
    });
  }, [documents, searchQuery, categoryFilter, statusFilter]);

  const handleOpenInspect = (doc: DocumentItem) => {
    setInspectDoc(doc);
    setSelectedDocumentId(doc.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <span>Documents & Compliance Repository</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
              {filteredDocs.length} Files
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Contracts, medical certificates, brain MRIs, passports, and travel confirmations with AI OCR metadata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by fighter or file name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 font-semibold text-neutral-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="contract">Contracts</option>
            <option value="passport">Passport / Identity</option>
            <option value="medical">Medical / Lab Panels</option>
            <option value="travel">Travel & Hotel</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 font-semibold text-neutral-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Processing">Processing</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-white border border-neutral-200 p-1 rounded-lg self-end sm:self-auto">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`p-1 rounded ${viewMode === 'TABLE' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('GRID')}
            className={`p-1 rounded ${viewMode === 'GRID' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Documents View: Table or Grid */}
      {viewMode === 'TABLE' ? (
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Fighter</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Uploaded At</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    No documents matching current filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    onClick={() => handleOpenInspect(doc)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-red-50 group-hover:text-red-600 transition-colors shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                            {doc.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {doc.fileName} • {doc.fileSize}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900">{doc.fighterName}</span>
                    </td>

                    <td className="py-3 px-4 capitalize text-neutral-600">
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {doc.aiConfidence ? (
                        <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                          {doc.aiConfidence}%
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">N/A</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={doc.verificationStatus} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {doc.uploadDate}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenInspect(doc)}
                        className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-red-600 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => handleOpenInspect(doc)}
              className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs hover:border-neutral-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <StatusBadge status={doc.verificationStatus} size="sm" />
                </div>

                <h3 className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                  {doc.title}
                </h3>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Athlete: <strong className="text-neutral-800">{doc.fighterName}</strong>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-1 truncate">
                  {doc.fileName} ({doc.fileSize})
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 font-mono">{doc.uploadDate}</span>
                <span className="text-red-600 font-bold group-hover:underline">Inspect OCR</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Inspection Modal */}
      {inspectDoc && (
        <DocumentInspectionModal
          document={inspectDoc}
          onClose={() => setInspectDoc(null)}
        />
      )}
    </div>
  );
};
