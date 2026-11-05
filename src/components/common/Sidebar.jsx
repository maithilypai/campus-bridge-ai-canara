import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  BrainCircuit,
  UserCircle,
  Building2,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { activeTab, setActiveTab, currentUser, logout } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Overview & Highlights'
    },
    {
      id: 'resources',
      label: 'Notes & Resources',
      icon: BookOpen,
      badge: '4 Years',
      desc: 'Autonomous Syllabus, PYQs & Labs'
    },
    {
      id: 'calculator',
      label: 'SGPA / CGPA Calculator',
      icon: Calculator,
      badge: 'VTU Scheme',
      desc: 'Grade & Credit Analytics'
    },
    {
      id: 'skills',
      label: 'AI Skill Analysis',
      icon: BrainCircuit,
      badge: 'Self-Check',
      desc: 'Readiness & Roadmaps'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: UserCircle,
      badge: null,
      desc: 'Academic & Projects'
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  const studentName = currentUser?.name || 'Student';
  const initials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#140c24] via-[#1a0f30] to-[#120a22] text-slate-200 border-r border-[#2d1b50] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#2d1b50]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              {/* Logo with Gear and Graduation Cap */}
              <div className="relative w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-fuchsia-500 p-0.5 shadow-purple-glow">
                <div className="w-full h-full bg-[#160c29] rounded-[10px] flex items-center justify-center overflow-hidden relative">
                  <img src="/logo.svg" alt="Campus Bridge AI Logo" className="w-9 h-9 object-contain" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center">
                    CAMPUS<span className="text-purple-400 ml-1">BRIDGE</span>
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80 font-medium tracking-wide">
                  Academic & Skill Platform
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-purple-300 hover:text-white p-1 rounded-lg hover:bg-purple-900/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* College Sub-Badge */}
          <div className="mt-3.5 px-3 py-2 rounded-lg bg-[#20133c]/80 border border-[#37235f] flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2 text-purple-200">
              <Building2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="font-medium truncate">Canara Engineering College</span>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-purple-600/30 text-purple-300 rounded border border-purple-500/40">
              VTU
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-purple-400/80 uppercase tracking-wider mb-2">
            Main Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 font-semibold'
                    : 'text-purple-200/80 hover:text-white hover:bg-[#251744]/70 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#251744] text-purple-300 group-hover:text-purple-200 group-hover:bg-[#341f5e]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm tracking-tight truncate leading-tight">
                      {item.label}
                    </div>
                    <div
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-purple-100/90' : 'text-purple-400/60'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-purple-900/50 text-purple-300 border border-purple-700/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Student Profile & Logout Footer */}
        <div className="p-3.5 m-3 rounded-xl bg-gradient-to-b from-[#21143d] to-[#1a0e33] border border-[#3b236b]/80 shadow-inner space-y-2.5">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('profile')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#180d2e] rounded-full flex items-center justify-center text-purple-200 font-bold text-sm">
                  {initials}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1a0e33] rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                  {currentUser?.name}
                </span>
                {currentUser?.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="text-[11px] text-purple-300 font-mono">
                {currentUser?.usn}
              </div>
              <div className="text-[10px] text-purple-400/80 truncate">
                {currentUser?.shortDept} • Sem {currentUser?.semester}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* CGPA Status */}
          <div className="pt-2 border-t border-[#341e5e] flex items-center justify-between text-[11px]">
            <span className="text-purple-300/70">Degree CGPA:</span>
            {currentUser?.cgpa ? (
              <span className="font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                ★ {currentUser.cgpa.toFixed(2)}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 italic">
                Not calculated
              </span>
            )}
          </div>

          {/* Logout Action Button */}
          <button
            onClick={logout}
            className="w-full mt-1 py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 flex items-center justify-center space-x-1.5 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
