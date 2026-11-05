import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import { getResourceDownloadUrl, getResourceViewUrl } from '../../services/api';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Code2,
  Download,
  Eye,
  Info,
  CheckCircle2,
  FolderOpen,
  Plus
} from 'lucide-react';

export default function ResourcePreviewModal({ uploadedResources = [], isAdmin = false, onUploadForSubject }) {
  const { previewResource, setPreviewResource, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('notes');

  if (!previewResource) return null;

  // Filter uploaded backend resources for this subject
  const subjectUploadedFiles = uploadedResources.filter(
    (r) => r.subjectCode?.toUpperCase() === previewResource.subjectCode?.toUpperCase()
  );

  const uploadedNotes = subjectUploadedFiles.filter((r) => r.category === 'notes');
  const uploadedSyllabus = subjectUploadedFiles.filter((r) => r.category === 'syllabus');
  const uploadedPapers = subjectUploadedFiles.filter((r) => r.category === 'question-papers');
  const uploadedLabs = subjectUploadedFiles.filter((r) => r.category === 'lab-manuals');

  const handleOpenPdf = (resourceId, title) => {
    window.open(getResourceViewUrl(resourceId), '_blank', 'noopener,noreferrer');
    showToast('Viewing Document', `Opening ${title} in new tab.`, 'purple');
  };

  const handleDownloadPdf = (resourceId, title) => {
    window.location.href = getResourceDownloadUrl(resourceId);
    showToast('Downloading', `Downloading official PDF: ${title}`, 'purple');
  };

  return (
    <Modal
      isOpen={!!previewResource}
      onClose={() => setPreviewResource(null)}
      title={previewResource.subjectName}
      subtitle={`${previewResource.subjectCode} • ${previewResource.yearLabel} • ${previewResource.credits} Credits • College Autonomous Curriculum`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Admin Quick Upload Banner inside subject modal */}
        {isAdmin && (
          <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-purple-950">
                Admin Mode: Upload official autonomous PDF for {previewResource.subjectName} ({previewResource.subjectCode})
              </span>
            </div>
            <button
              onClick={() => onUploadForSubject?.(previewResource)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload PDF for this Subject</span>
            </button>
          </div>
        )}

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
            <span>Syllabus Notes ({uploadedNotes.length || previewResource.notes?.length || 0})</span>
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
            <span>Autonomous Syllabus Modules ({previewResource.syllabus?.length || 0})</span>
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
            <span>College Question Papers ({uploadedPapers.length})</span>
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
            <span>Lab Specifications & Manuals ({uploadedLabs.length || previewResource.labs?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Syllabus Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/70 flex items-center justify-between text-xs">
              <span className="text-purple-900 font-semibold">
                Canara Engineering College Autonomous Course Notes
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                Official Autonomous Scheme
              </span>
            </div>

            {/* Display real uploaded notes if available */}
            {uploadedNotes.length > 0 ? (
              <div className="space-y-3">
                {uploadedNotes.map((file) => (
                  <div
                    key={file._id}
                    className="p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        PDF
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{file.title}</h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                          <span>{file.originalFilename}</span>
                          <span>•</span>
                          <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenPdf(file._id, file.title)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center space-x-1"
                        title="View PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(file._id, file.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : previewResource.notes && previewResource.notes.length > 0 ? (
              <div className="space-y-3">
                {previewResource.notes.map((note, idx) => (
                  <div
                    key={note.id || idx}
                    className="p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        DOC
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                          <span>Source: College Autonomous Syllabus Guide</span>
                          <span>•</span>
                          <span>{note.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-purple-700 px-3 py-1 bg-purple-50 rounded-lg">
                      Curriculum Guide
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No notes uploaded yet for this subject.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Autonomous Syllabus Breakdown */}
        {activeTab === 'syllabus' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Official module breakdown approved by Academic Council, Canara Engineering College (Autonomous) for{' '}
              <strong className="text-purple-900">{previewResource.subjectCode}</strong>.
            </p>

            {uploadedSyllabus.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <span className="text-xs font-bold text-indigo-900 block">Uploaded Official Syllabus Copy:</span>
                {uploadedSyllabus.map((f) => (
                  <div key={f._id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{f.title}</span>
                    <button
                      onClick={() => handleDownloadPdf(f._id, f.title)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {previewResource.syllabus?.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                      {mod.module}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {mod.hours} Teaching Hours • {mod.weightage} Marks Weightage
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{mod.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: College Examination Question Papers */}
        {activeTab === 'pyqs' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 text-xs text-indigo-900">
              Canara Engineering College Autonomous Semester Examination Question Papers.
            </div>

            {uploadedPapers.length > 0 ? (
              <div className="space-y-3">
                {uploadedPapers.map((paper) => (
                  <div
                    key={paper._id}
                    className="p-4 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        CEC
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{paper.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Autonomous Exam Paper • {(paper.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenPdf(paper._id, paper.title)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(paper._id, paper.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-2 rounded-2xl bg-indigo-50/30 border border-dashed border-indigo-200">
                <FolderOpen className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">No College Question Papers Uploaded Yet</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Official autonomous semester question papers for this course will appear here once published by the academic department.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Lab Specifications & Manuals */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            {uploadedLabs.length > 0 ? (
              <div className="space-y-3">
                {uploadedLabs.map((lab) => (
                  <div
                    key={lab._id}
                    className="p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{lab.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Autonomous Lab Manual • {(lab.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenPdf(lab._id, lab.title)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(lab._id, lab.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : previewResource.labs && previewResource.labs.length > 0 ? (
              <div className="space-y-3">
                {previewResource.labs.map((lab, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{lab.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Format: {lab.format} • Status: Autonomous Course Outline
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-purple-700 px-3 py-1 bg-purple-50 rounded-lg">
                      Lab Outline
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No lab manuals uploaded yet for this subject.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
