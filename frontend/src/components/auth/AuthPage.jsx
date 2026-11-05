import React from 'react';
import { useApp } from '../../context/AppContext';
import Login from './Login';
import SignUp from './SignUp';
import {
  GraduationCap,
  Sparkles,
  Building2,
  ShieldAlert,
  BookOpen,
  Calculator,
  BrainCircuit,
  Lock
} from 'lucide-react';

export default function AuthPage() {
  const { authView, setAuthView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#160c29] via-[#21113c] to-[#3b176f] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-purple-glow">
            <div className="w-full h-full bg-[#160c29] rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="Campus Bridge AI Logo" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                CAMPUS<span className="text-purple-400 ml-1">BRIDGE</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-purple-300/80 font-medium tracking-wide">
              Canara Engineering College • Mangaluru
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-purple-200">
          <Building2 className="w-3.5 h-3.5 text-purple-300" />
          <span>Affiliated to VTU Belagavi</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
        {/* Left Column: Platform Branding & Highlights */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Academic & Skill Development Platform</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              One platform for your <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-200 bg-clip-text text-transparent">academics & skills</span>.
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Designed specifically for Canara Engineering College undergraduates to manage VTU coursework, analyze SGPA/CGPA, and track career readiness.
            </p>
          </div>

          {/* 3 Pillars List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-left">
              <BookOpen className="w-5 h-5 text-purple-300 mb-2" />
              <h4 className="text-xs font-bold text-white">VTU Notes & PYQs</h4>
              <p className="text-[11px] text-purple-300/70 mt-0.5">4-Year AIML Curriculum</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-left">
              <Calculator className="w-5 h-5 text-indigo-300 mb-2" />
              <h4 className="text-xs font-bold text-white">SGPA Calculator</h4>
              <p className="text-[11px] text-purple-300/70 mt-0.5">2021/2022 Scheme</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-left">
              <BrainCircuit className="w-5 h-5 text-fuchsia-300 mb-2" />
              <h4 className="text-xs font-bold text-white">Skill Analysis</h4>
              <p className="text-[11px] text-purple-300/70 mt-0.5">Competency Roadmap</p>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="rounded-3xl bg-white text-slate-800 p-6 sm:p-8 shadow-2xl border border-purple-100 relative">
            {/* Top switcher tabs */}
            <div className="flex rounded-2xl bg-purple-50 p-1 mb-6 border border-purple-100">
              <button
                onClick={() => setAuthView('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authView === 'login'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-500 hover:text-purple-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthView('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authView === 'signup'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-500 hover:text-purple-700'
                }`}
              >
                Register Account
              </button>
            </div>

            {/* Form View */}
            {authView === 'login' ? <Login /> : <SignUp />}
          </div>
        </div>
      </main>

      {/* Security Disclaimer Footer */}
      <footer className="relative z-10 max-w-4xl w-full mx-auto pt-6 text-center text-[11px] text-purple-300/70">
        <div className="flex items-center justify-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-purple-400" />
          <span>
            <strong>Frontend Demonstration Mode:</strong> Student profiles are securely stored in your browser's local storage for evaluation. Backend integration and encrypted authentication will be connected in the next phase.
          </span>
        </div>
      </footer>
    </div>
  );
}
