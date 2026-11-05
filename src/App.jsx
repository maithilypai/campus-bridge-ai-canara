import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import DashboardPage from './components/dashboard/DashboardPage';
import ResourcesPage from './components/resources/ResourcesPage';
import CalculatorPage from './components/calculator/CalculatorPage';
import SkillAnalysisPage from './components/skills/SkillAnalysisPage';
import ProfilePage from './components/profile/ProfilePage';
import { Heart, Building2 } from 'lucide-react';

function AppContent() {
  const { currentUser, activeTab, authLoading } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Show a minimal loading screen while restoring session from JWT
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#160c29] via-[#21113c] to-[#3b176f] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          <p className="text-purple-300 text-sm font-medium">Restoring your session…</p>
        </div>
      </div>
    );
  }

  // If not logged in, show Auth Page first (Login / Sign Up)
  if (!currentUser) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex">
      {/* Dark Purple Sidebar with Logout */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar setMobileOpen={setMobileOpen} />

        {/* Dynamic Page Views */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'resources' && <ResourcesPage />}
          {activeTab === 'calculator' && <CalculatorPage />}
          {activeTab === 'skills' && <SkillAnalysisPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </main>

        {/* Professional Academic Platform Footer */}
        <footer className="mt-auto border-t border-purple-100 bg-white/70 py-6 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">CAMPUS BRIDGE AI</span>
              <span className="text-purple-300">•</span>
              <span>Canara Engineering College (VTU)</span>
              <span className="text-purple-300">•</span>
              <span className="text-purple-600 font-semibold">{currentUser.shortDept || 'AIML'}</span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
              <span>Signed in as <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.usn})</span>
              <span className="mx-1">•</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
