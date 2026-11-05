import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import FeatureCards from './FeatureCards';
import AcademicProgress from './AcademicProgress';
import RecentActivities from './RecentActivities';
import QuickAccess from './QuickAccess';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <WelcomeBanner />

      {/* 3 Core Feature Cards: Notes & Resources, SGPA/CGPA, AI Skill Analysis */}
      <FeatureCards />

      {/* Academic Progress & Exam Tracker */}
      <AcademicProgress />

      {/* Two Column Section: Recent Activities & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentActivities />
        </div>
        <div className="lg:col-span-5">
          <QuickAccess />
        </div>
      </div>
    </div>
  );
}
