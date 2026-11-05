import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Save, User, Hash, GraduationCap, Mail, Phone, Calendar } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, updateCurrentUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: 'Artificial Intelligence & Machine Learning',
    year: '1st Year',
    semester: 1,
    section: 'A',
    bio: '',
    email: '',
    phone: '',
    attendance: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        usn: currentUser.usn || '',
        department: currentUser.department || 'Artificial Intelligence & Machine Learning',
        year: currentUser.year || '1st Year',
        semester: currentUser.semester || 1,
        section: currentUser.section || 'A',
        bio: currentUser.bio || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        attendance: currentUser.attendance !== null && currentUser.attendance !== undefined ? currentUser.attendance : ''
      });
    }
  }, [currentUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester'
        ? Number(value) || value
        : name === 'attendance'
        ? value === '' ? null : Number(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCurrentUser({
      ...formData,
      shortDept: formData.department.includes('Artificial') ? 'AIML' : 'CSE'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student Profile"
      subtitle="Update your personal details and academic status"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & USN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              VTU USN
            </label>
            <input
              type="text"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Department & Academic Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 focus:bg-white text-slate-800"
            >
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning (AIML)</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
              <option value="Information Science & Engineering">Information Science & Engineering (ISE)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Academic Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 focus:bg-white text-slate-800"
            >
              <option value="1st Year">1st Year (2024-2028)</option>
              <option value="2nd Year">2nd Year (2023-2027)</option>
              <option value="3rd Year">3rd Year (2022-2026)</option>
              <option value="4th Year">4th Year (2021-2025)</option>
            </select>
          </div>
        </div>

        {/* Semester & Section & Attendance */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 text-slate-800 text-center"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>{s}th Sem</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              maxLength={2}
              className="w-full px-3 py-2 text-xs uppercase text-center rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Attendance %
            </label>
            <input
              type="number"
              step="0.1"
              name="attendance"
              placeholder="Optional"
              value={formData.attendance !== null && formData.attendance !== undefined ? formData.attendance : ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs text-center rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 text-slate-800"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Student Bio & Academic Focus
          </label>
          <textarea
            rows={3}
            name="bio"
            placeholder="Tell us about your academic interests, subjects you enjoy, or focus areas..."
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 focus:bg-white text-slate-800 resize-none"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              College Email ID
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Optional"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 text-slate-800"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-purple-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
