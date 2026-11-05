import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  GraduationCap,
  LogOut,
  X,
  UserCircle
} from 'lucide-react';
import { quickNotices } from '../../data/mockData';

export default function Navbar({ setMobileOpen }) {
  const { activeTab, setActiveTab, currentUser, logout, showToast } = useApp();
  const [showNotices, setShowNotices] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const titles = {
    dashboard: { title: 'Student Dashboard', subtitle: 'Academic records, progress & quick tools' },
    resources: { title: 'Notes & Academic Resources', subtitle: 'VTU AIML Curriculum Syllabus & Question Papers' },
    calculator: { title: 'SGPA & CGPA Calculator', subtitle: 'VTU 2021/2022 Grading Scheme & Performance Analyzer' },
    skills: { title: 'AI Skill Analysis & Self-Check', subtitle: 'Competency Mapping & Personalized Roadmap' },
    profile: { title: 'Student Academic Profile', subtitle: 'Verified Profile, Semesters & Course Projects' }
  };

  const currentInfo = titles[activeTab] || titles.dashboard;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setActiveTab('resources');
    showToast("Searching Resources", `Filtered resources for "${searchTerm}"`, "purple");
  };

  const studentName = currentUser?.name || 'Student';
  const firstName = studentName.split(' ')[0];
  const initials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-purple-900 hover:bg-purple-50 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              VTU 2022 Scheme
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Search, Notifications, College Badge & Profile Pill */}
      <div className="flex items-center space-x-3">
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes, PYQs, subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-56 lg:w-72 pl-9 pr-3 py-1.5 text-xs rounded-full bg-purple-50/70 border border-purple-200/80 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
          />
        </form>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotices(!showNotices)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="VTU & College Circulars"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotices && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    VTU
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Academic Notice Board</h4>
                    <p className="text-[11px] text-slate-500">Canara Engineering College</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotices(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-purple-50 mt-2 max-h-72 overflow-y-auto space-y-2">
                {quickNotices.map((notice) => (
                  <div key={notice.id} className="pt-2 pb-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        notice.urgent
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {notice.urgent ? 'Important' : 'Academic'}
                      </span>
                      <span className="text-[10px] text-slate-400">{notice.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">{notice.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notice.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Canara College Quick Badge */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/70 text-xs">
          <GraduationCap className="w-4 h-4 text-purple-700" />
          <span className="font-semibold text-purple-900">{currentUser?.shortDept || 'AIML'}</span>
          <span className="text-purple-400">|</span>
          <span className="text-purple-700 font-mono text-[11px]">{currentUser?.usn}</span>
        </div>

        {/* Profile Pill with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {initials}
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                {firstName}
              </span>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 p-2 z-50 animate-in fade-in">
              <div className="p-2.5 border-b border-purple-50">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-purple-700 font-mono">{currentUser?.usn}</p>
                <p className="text-[10px] text-slate-500">{currentUser?.department}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 rounded-xl flex items-center space-x-2"
                >
                  <UserCircle className="w-4 h-4 text-purple-600" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
