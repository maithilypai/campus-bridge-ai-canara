import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Hash,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function SignUp() {
  const { signup, setAuthView } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    department: 'Artificial Intelligence & Machine Learning',
    year: '3rd Year',
    semester: 6,
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.usn.trim()) {
      setError('Please enter your VTU USN (e.g. 4CB23AI015).');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid college email address.');
      return;
    }

    if (!formData.password) {
      setError('Please provide a password.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password should be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-check your password confirmation.');
      return;
    }

    setIsLoading(true);
    const res = await signup(formData);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Student Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Register your official profile for Canara Engineering College
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

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Student Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              name="name"
              placeholder="e.g. Ananya Rao"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* USN & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              VTU USN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                name="usn"
                placeholder="4CB23AI015"
                value={formData.usn}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              College Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                name="email"
                placeholder="name.4cb23ai@canaraengineering.in"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Department (AIML) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
            >
              <option value="Artificial Intelligence & Machine Learning">
                Artificial Intelligence & Machine Learning (AIML)
              </option>
              <option value="Computer Science & Engineering">
                Computer Science & Engineering (CSE)
              </option>
              <option value="Information Science & Engineering">
                Information Science & Engineering (ISE)
              </option>
            </select>
          </div>
        </div>

        {/* Academic Year & Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
              >
                <option value="1st Year">1st Year (2024-2028)</option>
                <option value="2nd Year">2nd Year (2023-2027)</option>
                <option value="3rd Year">3rd Year (2022-2026)</option>
                <option value="4th Year">4th Year (2021-2025)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Semester <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>{s}th Semester</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="confirmPassword"
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Complete Registration & Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-1">
        <p className="text-xs text-slate-600">
          Already registered?{' '}
          <button
            onClick={() => setAuthView('login')}
            className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
}
