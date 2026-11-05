import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Calculator,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export default function WelcomeBanner() {
  const { currentUser, setActiveTab } = useApp();

  const studentName = currentUser?.name || 'Student';
  const usn = currentUser?.usn || 'USN Not Provided';
  const dept = currentUser?.department || 'AIML';
  const year = currentUser?.year || '1st Year';
  const semester = currentUser?.semester || 1;
  const cgpaDisplay = currentUser?.cgpa ? `★ ${currentUser.cgpa.toFixed(2)}` : 'Not computed';
  const attendanceDisplay = currentUser?.attendance ? `${currentUser.attendance}%` : 'Not recorded';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e0f3d] via-[#2c1356] to-[#4c1d95] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-purple-950/20 border border-purple-500/20">
      {/* Background Decorative Rings & Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Welcome & Profile Overview */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top college badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-400/15 border border-purple-300/30 text-purple-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Canara Engineering College</span>
            <span className="text-purple-300">•</span>
            <span className="text-purple-100 font-semibold">{currentUser?.shortDept || 'AIML'}</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Hello, <span className="bg-gradient-to-r from-purple-200 via-fuchsia-200 to-white bg-clip-text text-transparent">{studentName}!</span>
            </h1>
            <p className="text-base sm:text-lg text-purple-200/90 font-medium mt-2">
              Your academics and skills, all in one place.
            </p>
          </div>

          {/* Student Profile Overview with Actual Entered Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[11px] text-purple-200/80 uppercase font-semibold tracking-wider block">Student Name</span>
              <span className="text-sm font-bold text-white truncate block mt-0.5" title={studentName}>
                {studentName}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[11px] text-purple-200/80 uppercase font-semibold tracking-wider block">VTU USN</span>
              <span className="text-sm font-bold font-mono text-purple-200 mt-0.5 block truncate">
                {usn}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[11px] text-purple-200/80 uppercase font-semibold tracking-wider block">Academic Year</span>
              <span className="text-sm font-bold text-white mt-0.5 block truncate">
                {year} (Sem {semester})
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[11px] text-purple-200/80 uppercase font-semibold tracking-wider block">Degree CGPA</span>
              <span className={`text-sm font-extrabold mt-0.5 block truncate ${
                currentUser?.cgpa ? 'text-amber-300' : 'text-purple-300 text-xs font-normal'
              }`}>
                {cgpaDisplay}
              </span>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('resources')}
              className="px-5 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs sm:text-sm hover:bg-purple-50 transition-all shadow-lg shadow-black/20 flex items-center space-x-2 group"
            >
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>Explore Notes & PYQs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className="px-5 py-2.5 rounded-xl bg-purple-700/60 hover:bg-purple-700/80 text-white font-semibold text-xs sm:text-sm border border-purple-400/30 transition-all flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4 text-purple-300" />
              <span>Calculate SGPA</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className="px-5 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 hover:text-white font-medium text-xs sm:text-sm border border-purple-500/20 transition-all flex items-center space-x-2"
            >
              <BrainCircuit className="w-4 h-4 text-fuchsia-300" />
              <span>AI Skill Analysis</span>
            </button>
          </div>
        </div>

        {/* Right Column: Custom Academic & Engineering Illustration */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-sm">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-fuchsia-600/30 to-indigo-600/40 rounded-3xl blur-2xl transform rotate-6 scale-95" />

            {/* Main Illustration Card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
              {/* Floating Engineering SVG Illustration */}
              <div className="flex justify-center items-center py-4">
                <svg viewBox="0 0 240 200" className="w-56 h-48 drop-shadow-2xl">
                  <defs>
                    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7e22ce" />
                    </linearGradient>
                    <linearGradient id="gearHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>

                  {/* Engineering Rotating Gear */}
                  <g transform="translate(120, 115) scale(0.9)">
                    <circle cx="0" cy="0" r="32" fill="#241242" stroke="url(#gearHeroGrad)" strokeWidth="3" strokeDasharray="6 3" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <rect
                        key={i}
                        x="-4"
                        y="-42"
                        width="8"
                        height="12"
                        rx="2"
                        fill="#818cf8"
                        transform={`rotate(${angle})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="16" fill="#7e22ce" />
                    <circle cx="0" cy="0" r="6" fill="#f472b6" />
                  </g>

                  {/* Books Platform */}
                  <g transform="translate(45, 142)">
                    <rect x="0" y="24" width="150" height="18" rx="4" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5" />
                    <rect x="14" y="27" width="132" height="12" rx="2" fill="#f3e8ff" />
                    <rect x="10" y="8" width="130" height="16" rx="4" fill="url(#bookGrad)" />
                    <rect x="22" y="11" width="114" height="10" rx="2" fill="#faf5ff" />
                    <line x1="28" y1="8" x2="28" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
                  </g>

                  {/* Graduation Cap (Mortarboard) Floating on Top */}
                  <g transform="translate(120, 50)">
                    <polygon points="0,-24 55,-4 0,16 -55,-4" fill="url(#capGrad)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M-30,4 C-30,18 30,18 30,4 L30,-2 C20,10 -20,10 -30,-2 Z" fill="#581c87" stroke="#c084fc" strokeWidth="1" />
                    <circle cx="0" cy="-4" r="4" fill="#ffffff" />
                    <path d="M0,-4 Q28,4 32,24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="32" cy="26" r="3" fill="#f59e0b" />
                  </g>

                  {/* Badges */}
                  <g transform="translate(30, 42)">
                    <circle cx="0" cy="0" r="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold">AI</text>
                  </g>

                  <g transform="translate(205, 55)">
                    <circle cx="0" cy="0" r="14" fill="#2e1065" stroke="#f472b6" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#fbcfe8" fontSize="8" fontWeight="bold">VTU</text>
                  </g>
                </svg>
              </div>

              {/* Bottom Tagline */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-purple-200">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>VTU Syllabus Aligned</span>
                </span>
                <span className="font-semibold text-white bg-purple-500/30 px-2 py-0.5 rounded-full border border-purple-400/40">
                  Canara AIML Portal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
