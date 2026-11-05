import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  Calculator,
  Plus
} from 'lucide-react';

export default function AcademicProgress() {
  const { currentUser, setActiveTab } = useApp();

  const semesters = currentUser?.semesterHistory || [];
  const hasSemesters = semesters.length > 0;
  const earnedCredits = currentUser?.earnedCredits || 0;
  const totalCredits = currentUser?.totalProgramCredits || 160;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* SGPA Progression or Empty State (8 cols) */}
      <div className="lg:col-span-8 rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-purple-50">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Academic SGPA Progression
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Semester-wise performance under VTU 2021/2022 Scheme
              </p>
            </div>

            {hasSemesters && currentUser?.cgpa && (
              <div className="text-right">
                <span className="text-[11px] font-semibold text-purple-600 block">VTU Classification</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                  currentUser.cgpa >= 7.75
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-purple-700 bg-purple-50 border-purple-200'
                }`}>
                  {currentUser.cgpa >= 7.75 ? 'First Class with Distinction' : 'First Class'}
                </span>
              </div>
            )}
          </div>

          {/* If student has entered semester history */}
          {hasSemesters ? (
            <div className="mt-6">
              <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-44 pb-2 pt-6">
                {semesters.map((s, idx) => {
                  const heightPercentage = Math.min(100, Math.max(25, ((s.sgpa - 4.0) / 6.0) * 100));

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <div className="mb-2 text-center transition-transform group-hover:-translate-y-1">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-purple-600 text-white shadow-sm">
                          {s.sgpa.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full max-w-[42px] bg-purple-100/70 rounded-2xl p-1 flex flex-col justify-end h-32 relative overflow-hidden">
                        <div
                          className="w-full rounded-xl transition-all duration-700 bg-gradient-to-t from-purple-700 via-purple-600 to-indigo-500 shadow-md shadow-purple-500/20"
                          style={{ height: `${heightPercentage}%` }}
                        />
                      </div>

                      <span className="text-xs font-bold text-slate-700 mt-2">
                        {s.sem}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {s.credits} Credits
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-purple-50 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <span className="text-[11px] text-slate-500">
                  Computed via VTU formula from your saved semester records.
                </span>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="text-purple-700 hover:text-purple-900 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Add Next Semester</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Clean Empty State when no semesters exist */
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Academic Records Added Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You haven't computed or saved any semester SGPA records yet. Use the SGPA Calculator to calculate your grades and save them to your profile.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 mx-auto transition-colors shadow-sm"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Go to SGPA Calculator</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Degree Credits & Academic Notice Cards (4 cols) */}
      <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
        {/* Degree Credits Card */}
        <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Degree Credits
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              VTU B.E AIML
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-slate-900">{earnedCredits}</span>
              <span className="text-sm font-semibold text-slate-400 ml-1.5">/ {totalCredits} Credits</span>
            </div>
            <span className="text-sm font-bold text-purple-600">
              {Math.round((earnedCredits / totalCredits) * 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-purple-100 h-2.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, (earnedCredits / totalCredits) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between">
            <span>{totalCredits - earnedCredits} Credits remaining</span>
            <span className="font-medium text-purple-600">Degree Target: 160 Cr</span>
          </p>
        </div>

        {/* VTU Academic Calendar Notice Card */}
        <div className="rounded-3xl bg-gradient-to-br from-lavender-100 via-purple-50 to-white p-6 shadow-soft border border-purple-200/80">
          <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-purple-700" />
            <span>VTU Academic Schedule</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-extrabold text-purple-950">
                Examination Window
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Semester theory & practical examinations
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-base">
              📅
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">Canara Engg College Portal:</span>
            <span className="font-bold text-purple-900">Check Notice Board</span>
          </div>
        </div>
      </div>
    </div>
  );
}
