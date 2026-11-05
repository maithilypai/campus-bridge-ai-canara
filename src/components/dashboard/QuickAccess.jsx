import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Percent,
  BookMarked,
  HelpCircle,
  Users,
  Download,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function QuickAccess() {
  const { showToast, setActiveTab } = useApp();

  const quickLinks = [
    {
      title: 'VTU Academic Calendar',
      desc: 'Official 2024-25 VTU notification',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
      action: () => showToast("Academic Calendar", "Downloading VTU 2024-2025 Even Sem Calendar (PDF)", "purple")
    },
    {
      title: 'AIML 6th Sem Time Table',
      desc: 'Canara Engg Section A & B slots',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-100',
      action: () => showToast("Class Time Table", "Opening 6th Sem AIML Classroom Schedule", "purple")
    },
    {
      title: 'VTU % Formula Guide',
      desc: 'Percentage = (CGPA - 0.75) × 10',
      icon: Percent,
      color: 'text-fuchsia-600 bg-fuchsia-100',
      action: () => setActiveTab('calculator')
    },
    {
      title: 'Canara Digital Library',
      desc: 'IEEE Xplore & VTU Consortium',
      icon: BookMarked,
      color: 'text-violet-600 bg-violet-100',
      action: () => showToast("Library Portal", "Redirecting to Canara Engineering College Library E-Resources", "info")
    },
    {
      title: 'AIML Faculty Directory',
      desc: 'Mentors, Cabin Nos & Email IDs',
      icon: Users,
      color: 'text-sky-600 bg-sky-100',
      action: () => showToast("Faculty Contacts", "CEC AIML Department: 14 Faculty Members Listed", "info")
    },
    {
      title: 'VTU Question Bank',
      desc: 'Comprehensive 5-Year Solved Papers',
      icon: HelpCircle,
      color: 'text-amber-600 bg-amber-100',
      action: () => setActiveTab('resources')
    }
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80">
      <div className="flex items-center justify-between pb-4 border-b border-purple-50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>Quick-Access Shortcuts</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Campus Tools
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential Canara Engineering College & VTU links
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {quickLinks.map((item, idx) => {
          const Icon = item.icon;

          return (
            <button
              key={idx}
              onClick={item.action}
              className="p-3.5 rounded-2xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100/80 text-left transition-all hover:scale-[1.02] flex items-center space-x-3.5 group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm ${item.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
