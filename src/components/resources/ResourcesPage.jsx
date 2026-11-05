import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { academicResources } from '../../data/mockData';
import SubjectCard from './SubjectCard';
import ResourcePreviewModal from './ResourcePreviewModal';
import AdminResourceModal from './AdminResourceModal';
import {
  fetchResources,
  deleteResource,
  getResourceViewUrl,
  getResourceDownloadUrl
} from '../../services/api';
import {
  Search,
  Filter,
  BookOpen,
  Bookmark,
  Sparkles,
  Layers,
  GraduationCap,
  Download,
  FolderOpen,
  Plus,
  Eye,
  Trash2,
  Edit3,
  FileText,
  Calendar,
  Code2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function ResourcesPage() {
  const { bookmarks, currentUser, showToast } = useApp();
  const isAdmin = String(currentUser?.role || '').toLowerCase().trim() === 'admin';

  // Active view: 'subjects' (4-year course subjects) or 'uploads' (real PDF documents uploaded)
  const [activeView, setActiveView] = useState('subjects');

  // Filters
  const [selectedYear, setSelectedYear] = useState('all'); // 'all', 1, 2, 3, 4
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Backend uploaded resources state
  const [uploadedResources, setUploadedResources] = useState([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  // Admin Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);

  // Fetch live resources from backend
  const loadUploadedResources = useCallback(async () => {
    setIsLoadingUploads(true);
    const { data, error } = await fetchResources();
    setIsLoadingUploads(false);
    if (!error && data?.data?.resources) {
      setUploadedResources(data.data.resources);
    }
  }, []);

  useEffect(() => {
    loadUploadedResources();
  }, [loadUploadedResources]);

  const years = [
    { id: 'all', label: 'All Years' },
    { id: 1, label: '1st Year AIML' },
    { id: 2, label: '2nd Year AIML' },
    { id: 3, label: '3rd Year AIML' },
    { id: 4, label: '4th Year AIML' }
  ];

  const categories = [
    'all',
    'Core Theory',
    'Math / Allied',
    'Professional Elective'
  ];

  // Filter Curriculum Subjects
  const filteredSubjects = useMemo(() => {
    return academicResources.filter((res) => {
      if (selectedYear !== 'all' && res.year !== selectedYear) return false;
      if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;
      if (showBookmarksOnly && !bookmarks.includes(res.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = res.subjectName.toLowerCase().includes(query);
        const matchesCode = res.subjectCode.toLowerCase().includes(query);
        const matchesDesc = res.description.toLowerCase().includes(query);
        const matchesSyllabus = res.syllabus?.some(s => s.title.toLowerCase().includes(query));
        return matchesName || matchesCode || matchesDesc || matchesSyllabus;
      }
      return true;
    });
  }, [selectedYear, selectedCategory, searchQuery, showBookmarksOnly, bookmarks]);

  // Filter Live Uploaded PDF Resources
  const filteredUploads = useMemo(() => {
    return uploadedResources.filter((res) => {
      // Year filter (matches e.g. "1st Year" or semester)
      if (selectedYear !== 'all') {
        const yearMatch = res.academicYear?.includes(String(selectedYear));
        const semMatch = res.semester === selectedYear * 2 || res.semester === selectedYear * 2 - 1;
        if (!yearMatch && !semMatch) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = res.title?.toLowerCase().includes(q);
        const mSubj = res.subjectName?.toLowerCase().includes(q);
        const mCode = res.subjectCode?.toLowerCase().includes(q);
        const mDesc = res.description?.toLowerCase().includes(q);
        return mTitle || mSubj || mCode || mDesc;
      }

      return true;
    });
  }, [uploadedResources, selectedYear, searchQuery]);

  // Admin delete handler
  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }
    const { error } = await deleteResource(id);
    if (error) {
      showToast('Deletion Failed', error, 'rose');
    } else {
      showToast('Resource Deleted', `"${title}" has been removed.`, 'purple');
      loadUploadedResources();
    }
  };

  const handleOpenPdf = (id, title) => {
    window.open(getResourceViewUrl(id), '_blank', 'noopener,noreferrer');
    showToast('Viewing PDF', `Opening ${title}`, 'purple');
  };

  const handleDownloadPdf = (id, title) => {
    window.location.href = getResourceDownloadUrl(id);
    showToast('Downloading PDF', `Downloading ${title}`, 'purple');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#201040] via-[#2f1361] to-[#4c1d95] text-white p-6 sm:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
              <span>Canara Engineering College • AIML Autonomous Repository</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Academic Notes & Resources
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Curated 4-year AIML course materials aligned with Canara Engineering College Autonomous Curriculum (Autonomous Scheme).
            </p>
          </div>

          {/* Admin Upload Trigger Button */}
          {isAdmin && (
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setResourceToEdit(null);
                  setIsModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xl shadow-black/20 transition-all transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 text-purple-700" />
                <span>Upload Academic PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating background decorative badge */}
        <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <BookOpen className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Admin Action Bar (Prominently rendered when user has admin role) */}
      {isAdmin && (
        <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-[#2c1356] text-white p-4 sm:p-5 shadow-lg border border-purple-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-extrabold text-white">
                  Administrator Resource Management Mode
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 font-black text-[10px] uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5">
                You have authorized permissions to publish official autonomous PDFs, edit metadata, and delete resources.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setResourceToEdit(null);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-purple-950 hover:bg-purple-50 font-extrabold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-purple-700" />
              <span>Upload Academic PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Filter and Controls Card */}
      <div className="rounded-3xl bg-white p-5 shadow-soft border border-purple-100/80 space-y-4">
        {/* View Switcher: Curriculum Subjects vs Uploaded PDFs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-50">
          <div className="flex rounded-2xl bg-purple-50 p-1 border border-purple-100">
            <button
              onClick={() => setActiveView('subjects')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
                activeView === 'subjects'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Curriculum</span>
            </button>
            <button
              onClick={() => setActiveView('uploads')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
                activeView === 'uploads'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Uploaded PDF Repository ({uploadedResources.length})</span>
            </button>
          </div>

          {isAdmin && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Administrator Portal Active</span>
            </div>
          )}
        </div>

        {/* Year Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-purple-50">
          {years.map((y) => (
            <button
              key={y.id}
              onClick={() => setSelectedYear(y.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedYear === y.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-purple-50/70 text-slate-600 hover:bg-purple-100 hover:text-purple-800'
              }`}
            >
              {y.label}
            </button>
          ))}

          {activeView === 'subjects' && (
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ml-auto ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
              <span>Saved ({bookmarks.length})</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by subject name, code (e.g., 22POP12), or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/70 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {activeView === 'subjects' && (
            <div className="md:col-span-4 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/70 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white"
              >
                <option value="all">All Subject Categories</option>
                <option value="Core Theory">Core Theory</option>
                <option value="Math / Allied">Math / Allied</option>
                <option value="Professional Elective">Professional Elective</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 1: Course Curriculum Subjects */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeView === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600">
              Showing <span className="text-purple-700">{filteredSubjects.length}</span> autonomous course modules
            </span>
            <span className="text-[11px] text-slate-500">
              Includes Syllabus, Notes, College Question Papers & Labs
            </span>
          </div>

          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((resource) => (
                <SubjectCard
                  key={resource.id}
                  resource={resource}
                  isAdmin={isAdmin}
                  onUploadForSubject={(sub) => {
                    setResourceToEdit({
                      subjectName: sub.subjectName,
                      subjectCode: sub.subjectCode,
                      academicYear: sub.yearLabel || `${sub.year}st Year`,
                      semester: sub.semester || 1,
                    });
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-purple-100 shadow-soft">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Academic Resources Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No subjects matching your criteria. Try resetting filters.
              </p>
              <button
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setShowBookmarksOnly(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 2: Uploaded PDF Repository */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeView === 'uploads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600">
              Published PDFs: <span className="text-purple-700">{filteredUploads.length}</span> documents
            </span>
            <span className="text-[11px] text-slate-500">
              Verified Canara Engineering College Autonomous Resources
            </span>
          </div>

          {isLoadingUploads ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Loading published resources...</p>
            </div>
          ) : filteredUploads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUploads.map((item) => {
                const categoryBadge = {
                  notes: { label: 'PDF Notes', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                  syllabus: { label: 'Autonomous Syllabus', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
                  'question-papers': { label: 'College Question Paper', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200' },
                  'lab-manuals': { label: 'Lab Manual', color: 'bg-violet-100 text-violet-800 border-violet-200' },
                }[item.category] || { label: item.category, color: 'bg-slate-100 text-slate-800 border-slate-200' };

                return (
                  <div
                    key={item._id}
                    className="rounded-3xl bg-white p-6 shadow-soft hover:shadow-soft-hover border border-purple-100 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-xl bg-purple-600 text-white shadow-sm">
                          {item.subjectCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadge.color}`}>
                          {categoryBadge.label}
                        </span>
                      </div>

                      {/* Title & Subject */}
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors mt-3">
                        {item.title}
                      </h4>
                      <p className="text-xs font-semibold text-purple-700 mt-0.5">
                        {item.subjectName}
                      </p>

                      {item.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Meta Pills */}
                      <div className="mt-4 pt-3 border-t border-purple-50 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                          {item.academicYear} (Sem {item.semester})
                        </span>
                        <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                          {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-3 border-t border-purple-50 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenPdf(item._id, item.title)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                          title="Preview PDF in new tab"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(item._id, item.title)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1 transition-colors shadow-sm"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>

                      {/* Admin-only controls */}
                      {isAdmin && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setResourceToEdit(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Edit Resource"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteResource(item._id, item.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Academic PDFs Uploaded Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {isAdmin
                  ? 'As an administrator, you can upload official autonomous syllabus PDFs, notes, question papers, and lab manuals using the upload button above.'
                  : 'Faculty and academic administrators have not yet published PDF files matching your current filters. Please check back soon or browse the Course Curriculum tab.'}
              </p>
              {isAdmin && (
                <button
                  onClick={() => {
                    setResourceToEdit(null);
                    setIsModalOpen(true);
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload First PDF</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Curriculum Detail Preview Modal */}
      <ResourcePreviewModal
        uploadedResources={uploadedResources}
        isAdmin={isAdmin}
        onUploadForSubject={(sub) => {
          setResourceToEdit({
            subjectName: sub.subjectName,
            subjectCode: sub.subjectCode,
            academicYear: sub.yearLabel || `${sub.year}st Year`,
            semester: sub.semester || 1,
          });
          setIsModalOpen(true);
        }}
      />

      {/* Admin Upload / Edit Modal */}
      {isAdmin && (
        <AdminResourceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setResourceToEdit(null);
          }}
          resourceToEdit={resourceToEdit}
          onSuccess={loadUploadedResources}
        />
      )}
    </div>
  );
}
