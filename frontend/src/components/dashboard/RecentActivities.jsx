import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileDown,
  Calculator,
  Bookmark,
  Brain,
  Award,
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react';

export default function RecentActivities() {
  const { activities, setActiveTab } = useApp();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80">
      <div className="flex items-center justify-between pb-4 border-b border-purple-50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>Recent Activities</span>
            {activities.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your recent downloads, calculations and learning interactions
          </p>
        </div>

        <button
          onClick={() => setActiveTab('resources')}
          className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center space-x-1"
        >
          <span>Explore Resources</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {activities.length > 0 ? (
        <div className="divide-y divide-purple-50 mt-2 max-h-72 overflow-y-auto">
          {activities.map((act) => (
            <div
              key={act.id}
              className="py-3 flex items-start justify-between space-x-4 hover:bg-purple-50/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="text-xs font-bold text-slate-900">
                      {act.title}
                    </h5>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-[11px] text-slate-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span>{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-10 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-700">No Recent Activities Yet</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Your SGPA calculations, bookmarked resources, and profile changes will be tracked here.
          </p>
        </div>
      )}
    </div>
  );
}
