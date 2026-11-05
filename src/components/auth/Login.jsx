import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Login() {
  const { login, setAuthView } = useApp();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your College Email or USN, along with your password.');
      return;
    }

    setIsLoading(true);
    const res = await login(identifier.trim(), password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Portal Sign In
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your personalized academic records, resources & skill roadmap
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifier Field: Email or USN */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            College Email or VTU USN
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="e.g. 4CB23AI015 or your college email"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign Up */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-600">
          First time here?{' '}
          <button
            onClick={() => setAuthView('signup')}
            className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
          >
            Create an Account / Sign Up
          </button>
        </p>
      </div>

      {/* Helpful First-Time Demo Note */}
      <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-[11px] text-slate-600 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">New Student?</strong> Click <span className="font-bold text-purple-700">"Create an Account"</span> to register your profile. Your information will be displayed dynamically across the academic dashboard.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-50">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>Password Recovery Notice</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Password Recovery:</strong>
              </p>
              <p>
                Automated email-based password reset will be available in a future update.
              </p>
              <p className="p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
                Please log in using the exact credentials you registered with. If you've forgotten your password, create a new account with a different USN or contact your college administrator.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
