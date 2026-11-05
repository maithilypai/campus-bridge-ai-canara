import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Code2,
  Download,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function ResourcePreviewModal() {
  const { previewResource, setPreviewResource, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('notes');

  if (!previewResource) return null;

  const handleDownload = (itemTitle) => {
    showToast("Curriculum Resource", `Opening ${itemTitle} (VTU 2021/2022 Scheme Guide)`, "purple");
  };

  return (
    <Modal
      isOpen={!!previewResource}
      onClose={() => setPreviewResource(null)}
      title={previewResource.subjectName}
      subtitle={`${previewResource.subjectCode} • ${previewResource.yearLabel} • ${previewResource.credits} Credits • VTU Curriculum`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-purple-100 overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-3.5 text-xs font-bold transition-colors border-b-2 flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'notes'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus Notes ({previewResource.notes?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`pb-3 px-3.5 text-xs font-bold transition-colors border-b-2 flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'syllabus'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>VTU Syllabus Modules ({previewResource.syllabus?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('pyqs')}
            className={`pb-3 px-3.5 text-xs font-bold transition-colors border-b-2 flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'pyqs'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Question Papers ({previewResource.pyqs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`pb-3 px-3.5 text-xs font-bold transition-colors border-b-2 flex items-center space-x-1.5 flex-shrink-0 ${
              activeTab === 'labs'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Lab Specifications ({previewResource.labs?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Syllabus Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/70 flex items-center justify-between text-xs">
              <span className="text-purple-900 font-semibold">
                VTU AIML Curriculum Reference Modules
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                Official Scheme Breakdown
              </span>
            </div>

            <div className="space-y-3">
              {previewResource.notes?.map((note, idx) => (
                <div
                  key={note.id || idx}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      DOC
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {note.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                        <span>Source: {note.source || 'VTU Curriculum Outline'}</span>
                        <span>•</span>
                        <span>{note.pages} pages</span>
                        <span>•</span>
                        <span>{note.type}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(note.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Reference</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: VTU Syllabus Breakdown */}
        {activeTab === 'syllabus' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Official module breakdown prescribed by Visvesvaraya Technological University (VTU) for {previewResource.subjectCode}.
            </p>

            <div className="space-y-3">
              {previewResource.syllabus?.map((mod, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                      {mod.module}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {mod.hours} Teaching Hours • {mod.weightage} Marks Weightage
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    {mod.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Previous Year Question Papers (PYQs) */}
        {activeTab === 'pyqs' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 text-xs text-indigo-900">
              VTU Examination paper format reference and question patterns.
            </div>

            <div className="space-y-3">
              {previewResource.pyqs?.map((pyq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      VTU
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {pyq.year} - {pyq.exam}
                        </h4>
                        {pyq.solved && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            Model Format
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Type: {pyq.format} • VTU Scheme Exam Outline
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(`${previewResource.subjectCode} PYQ ${pyq.year}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Specimen</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Lab Specifications */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {previewResource.labs?.map((lab, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {lab.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Format: {lab.format} • Status: {lab.status}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(lab.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Outline</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
