import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isPurple = toast.type === 'purple';
        const isInfo = toast.type === 'info';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl bg-white shadow-2xl border border-purple-200/90 text-slate-800 transition-all transform translate-y-0 opacity-100"
            style={{
              boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isPurple ? (
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : isSuccess ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-slate-900 leading-tight">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
