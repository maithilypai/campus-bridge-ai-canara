import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Code2,
  Bookmark,
  ChevronRight
} from 'lucide-react';

export default function SubjectCard({ resource }) {
  const { bookmarks, toggleBookmark, setPreviewResource, showToast } = useApp();

  const isBookmarked = bookmarks.includes(resource.id);

  const handleQuickDownload = (e, typeName) => {
    e.stopPropagation();
    showToast("Curriculum Outline", `Loading ${resource.subjectName} ${typeName}`, "purple");
    setPreviewResource(resource);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft hover:shadow-soft-hover border border-purple-100/90 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
      <div>
        {/* Top Header: Subject Code, Category & Bookmark Button */}
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/20">
              {resource.subjectCode}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {resource.category}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {resource.credits} Credits
            </span>
          </div>

          <button
            onClick={() => toggleBookmark(resource.id)}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark subject'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Subject Title */}
        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors mt-3 leading-snug">
          {resource.subjectName}
        </h3>

        {/* Subject Short Description */}
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
          {resource.description}
        </p>

        {/* 4 Core Resource Indicators */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-purple-50">
          {/* Notes */}
          <button
            onClick={(e) => handleQuickDownload(e, 'Syllabus Notes')}
            className="p-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100 text-left transition-colors flex items-center space-x-2.5"
          >
            <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-800 block truncate">
                Notes
              </span>
              <span className="text-[10px] text-purple-700 font-semibold truncate block">
                Syllabus Guide
              </span>
            </div>
          </button>

          {/* VTU Syllabus */}
          <button
            onClick={(e) => handleQuickDownload(e, 'VTU Syllabus Modules')}
            className="p-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100 text-left transition-colors flex items-center space-x-2.5"
          >
            <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-800 block truncate">
                VTU Syllabus
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold truncate block">
                5 Modules
              </span>
            </div>
          </button>

          {/* PYQs */}
          <button
            onClick={(e) => handleQuickDownload(e, 'Examination Specimen Papers')}
            className="p-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100 text-left transition-colors flex items-center space-x-2.5"
          >
            <HelpCircle className="w-4 h-4 text-fuchsia-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-800 block truncate">
                PYQs
              </span>
              <span className="text-[10px] text-fuchsia-700 font-semibold truncate block">
                VTU Papers
              </span>
            </div>
          </button>

          {/* Lab Materials */}
          <button
            onClick={(e) => handleQuickDownload(e, 'Lab Problem Specifications')}
            className="p-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100 text-left transition-colors flex items-center space-x-2.5"
          >
            <Code2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-800 block truncate">
                Lab Materials
              </span>
              <span className="text-[10px] text-violet-700 font-semibold truncate block">
                Problem Lists
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Card Footer Button */}
      <div className="mt-5 pt-3 border-t border-purple-50 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          {resource.yearLabel}
        </span>

        <button
          onClick={() => setPreviewResource(resource)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <span>View Curriculum</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
