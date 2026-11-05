import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { academicResources } from '../../data/mockData';
import SubjectCard from './SubjectCard';
import ResourcePreviewModal from './ResourcePreviewModal';
import {
  Search,
  Filter,
  BookOpen,
  Bookmark,
  Sparkles,
  Layers,
  GraduationCap,
  Download,
  FolderOpen
} from 'lucide-react';

export default function ResourcesPage() {
  const { bookmarks } = useApp();
  const [selectedYear, setSelectedYear] = useState('all'); // 'all', 1, 2, 3, 4
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

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

  const filteredResources = useMemo(() => {
    return academicResources.filter((res) => {
      // Year Filter
      if (selectedYear !== 'all' && res.year !== selectedYear) return false;

      // Category Filter
      if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;

      // Bookmark filter
      if (showBookmarksOnly && !bookmarks.includes(res.id)) return false;

      // Search Query
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#201040] via-[#2f1361] to-[#4c1d95] text-white p-6 sm:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
            <span>Canara Engineering College • AIML Academic Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Notes & Resources
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
            Curated 4-year AIML course materials aligned with Visvesvaraya Technological University (VTU) 2021/2022 Scheme.
          </p>
        </div>

        {/* Floating background decorative badge */}
        <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <BookOpen className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="rounded-3xl bg-white p-5 shadow-soft border border-purple-100/80 space-y-4">
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

          {/* Bookmarked quick filter */}
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
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by subject name, code (e.g., 21AI54), or module topic..."
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

          {/* Category Dropdown */}
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
        </div>
      </div>

      {/* Subject Count & Results Status */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-600">
          Showing <span className="text-purple-700">{filteredResources.length}</span> course modules
        </span>
        <span className="text-[11px] text-slate-500">
          Includes Notes, Syllabus, PYQs & Lab materials
        </span>
      </div>

      {/* Grid of Subject Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <SubjectCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-purple-100 shadow-soft">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Academic Resources Found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any subjects matching your filters. Try clearing your search query or selecting "All Years".
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

      {/* Interactive Resource Preview Modal */}
      <ResourcePreviewModal />
    </div>
  );
}
