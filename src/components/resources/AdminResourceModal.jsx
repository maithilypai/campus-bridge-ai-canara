import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { uploadResource, updateResource } from '../../services/api';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Hash
} from 'lucide-react';

export default function AdminResourceModal({ isOpen, onClose, resourceToEdit, onSuccess }) {
  const { showToast } = useApp();
  const isEditing = Boolean(resourceToEdit);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    academicYear: '1st Year',
    semester: 1,
    department: 'Artificial Intelligence & Machine Learning',
    subjectName: '',
    subjectCode: '',
    category: 'notes',
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resourceToEdit) {
      setFormData({
        title: resourceToEdit.title || '',
        description: resourceToEdit.description || '',
        academicYear: resourceToEdit.academicYear || '1st Year',
        semester: resourceToEdit.semester || 1,
        department: resourceToEdit.department || 'Artificial Intelligence & Machine Learning',
        subjectName: resourceToEdit.subjectName || '',
        subjectCode: resourceToEdit.subjectCode || '',
        category: resourceToEdit.category || 'notes',
      });
      setFile(null);
    } else {
      setFormData({
        title: '',
        description: '',
        academicYear: '1st Year',
        semester: 1,
        department: 'Artificial Intelligence & Machine Learning',
        subjectName: '',
        subjectCode: '',
        category: 'notes',
      });
      setFile(null);
    }
    setError('');
  }, [resourceToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value,
    }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file type. Only PDF documents (.pdf) are permitted.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 35 * 1024 * 1024) {
      setError('File size exceeds 35 MB limit. Please select a smaller PDF.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a resource title.');
      return;
    }
    if (!formData.subjectName.trim()) {
      setError('Please enter the subject name.');
      return;
    }
    if (!formData.subjectCode.trim()) {
      setError('Please enter the subject code (e.g. 22AIM11).');
      return;
    }

    if (!isEditing && !file) {
      setError('Please choose a PDF file to upload.');
      return;
    }

    setIsLoading(true);

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('academicYear', formData.academicYear);
    payload.append('semester', String(formData.semester));
    payload.append('department', formData.department);
    payload.append('subjectName', formData.subjectName.trim());
    payload.append('subjectCode', formData.subjectCode.trim().toUpperCase());
    payload.append('category', formData.category);

    if (file) {
      payload.append('file', file);
    }

    let result;
    if (isEditing) {
      result = await updateResource(resourceToEdit._id, payload);
    } else {
      result = await uploadResource(payload);
    }

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    showToast(
      isEditing ? 'Resource Updated' : 'Resource Published',
      `"${formData.title}" has been saved successfully.`,
      'purple'
    );

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Academic Resource' : 'Upload Academic Resource'}
      subtitle="Canara Engineering College Autonomous Academic Repository"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Resource Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Module 1 - Multivariable Calculus & Polar Curves Primer"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
          />
        </div>

        {/* Subject Name and Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="subjectName"
              required
              placeholder="e.g. Mathematics-I for AIML Stream"
              value={formData.subjectName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="subjectCode"
              required
              placeholder="e.g. 22MATS11"
              value={formData.subjectCode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Category & Academic Year & Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resource Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
            >
              <option value="notes">PDF Notes / Primer</option>
              <option value="syllabus">Autonomous Syllabus</option>
              <option value="question-papers">College Question Papers</option>
              <option value="lab-manuals">Lab Manuals & Specs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
            >
              <option value="1st Year">1st Year AIML</option>
              <option value="2nd Year">2nd Year AIML</option>
              <option value="3rd Year">3rd Year AIML</option>
              <option value="4th Year">4th Year AIML</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Semester <span className="text-rose-500">*</span>
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
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

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Description / Overview (Optional)
          </label>
          <textarea
            name="description"
            rows={2}
            placeholder="Brief overview of covered modules, units, or exam pattern..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white resize-none"
          />
        </div>

        {/* PDF File Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Attach PDF Document {isEditing ? '(Leave blank to retain current file)' : <span className="text-rose-500">*</span>}
          </label>

          <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-4 text-center transition-colors bg-purple-50/30">
            <input
              type="file"
              accept="application/pdf,.pdf"
              id="resource-pdf-input"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="resource-pdf-input"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs">
                {file ? (
                  <span className="font-bold text-purple-900">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                ) : (
                  <>
                    <span className="font-bold text-purple-700 hover:underline">
                      Click to choose PDF file
                    </span>{' '}
                    <span className="text-slate-500">or drag and drop</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400">PDF documents only • Max 35 MB</p>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-purple-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 flex items-center space-x-2 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Publish Resource'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
