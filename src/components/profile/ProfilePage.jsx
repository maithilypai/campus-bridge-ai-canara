import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EditProfileModal from './EditProfileModal';
import {
  GraduationCap,
  Award,
  Building2,
  Mail,
  Phone,
  Edit3,
  Plus,
  ExternalLink,
  Code2,
  TrendingUp,
  FolderGit2,
  FileCheck,
  Calculator,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, addProject, addCertification, setActiveTab } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add project modal
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    tech: '',
    description: '',
    status: 'In Progress',
    link: ''
  });

  // Add certification modal
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    score: 'Verified Certificate',
    date: 'Current'
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    addProject(newProject);
    setNewProject({ title: '', tech: '', description: '', status: 'Completed', link: '' });
    setShowAddProject(false);
  };

  const handleCreateCert = (e) => {
    e.preventDefault();
    if (!newCert.title.trim()) return;
    addCertification(newCert);
    setNewCert({ title: '', issuer: '', score: 'Verified Certificate', date: 'Current' });
    setShowAddCert(false);
  };

  const studentName = currentUser?.name || 'Student';
  const initials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const semesters = currentUser?.semesterHistory || [];
  const projects = currentUser?.projects || [];
  const certs = currentUser?.certifications || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Hero Profile Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-purple-100/80 relative overflow-hidden">
        {/* Top decorative gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-700 via-indigo-700 to-fuchsia-700" />

        <div className="relative pt-8 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-5">
            {/* Student Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-purple-100">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#160c29] to-[#341b5a] text-purple-200 flex items-center justify-center font-extrabold text-2xl tracking-wider shadow-inner">
                  {initials}
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Student Identity */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {studentName}
                </h2>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  {currentUser?.usn}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Sec '{currentUser?.section || 'A'}'
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-purple-700 flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>{currentUser?.department}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-normal">{currentUser?.year} (Sem {currentUser?.semester})</span>
              </p>

              <p className="text-xs text-slate-500 flex items-center space-x-1.5 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Canara Engineering College, Mangaluru • VTU Affiliated</span>
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all flex-shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Student Bio */}
        <div className="mt-6 pt-5 border-t border-purple-50 text-xs text-slate-600 leading-relaxed max-w-3xl">
          <span className="font-bold text-slate-800">Bio: </span>
          {currentUser?.bio ? (
            <span>{currentUser.bio}</span>
          ) : (
            <span className="text-slate-400 italic">
              No bio added yet. Click 'Edit Profile' to add your interests and academic goals.
            </span>
          )}
        </div>

        {/* Contact info pills */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-mono text-[11px]">{currentUser?.email}</span>
          </div>
          {currentUser?.phone && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-[11px]">{currentUser.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Academic Standing & SGPA/CGPA Summary */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-700" />
              <span>Academic SGPA / CGPA Summary</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified transcripts record under Visvesvaraya Technological University (VTU)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree CGPA</span>
              {currentUser?.cgpa ? (
                <span className="text-lg font-black text-amber-500">★ {currentUser.cgpa.toFixed(2)}</span>
              ) : (
                <span className="text-xs text-slate-400 italic">Not calculated</span>
              )}
            </div>
            {currentUser?.cgpa && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {currentUser.cgpa >= 7.75 ? 'First Class with Distinction' : 'First Class'}
              </span>
            )}
          </div>
        </div>

        {/* Semester-by-Semester Cards or Empty State */}
        {semesters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {semesters.map((sem, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 text-center space-y-1 hover:border-purple-300 transition-colors"
              >
                <span className="text-xs font-bold text-slate-700 block">{sem.sem}</span>
                <span className="text-xl font-extrabold text-purple-900 block">{sem.sgpa.toFixed(2)}</span>
                <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-500">
                  <span>{sem.credits} Cr</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">{sem.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 rounded-2xl bg-purple-50/30 border border-dashed border-purple-200">
            <p className="text-xs text-slate-600 font-semibold">
              No academic records added yet.
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Calculate your semester SGPA using the SGPA Calculator to record your grade points.
            </p>
            <button
              onClick={() => setActiveTab('calculator')}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors inline-flex items-center space-x-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open SGPA Calculator</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-purple-700" />
              <span>Academic & Engineering Projects</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Course mini-projects, hackathons, and research prototypes
            </p>
          </div>

          <button
            onClick={() => setShowAddProject(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1 border border-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-purple-50/30 hover:bg-purple-50/70 border border-purple-100 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">
                      {proj.status}
                    </span>
                    <Code2 className="w-4 h-4 text-purple-400" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {proj.title}
                  </h4>

                  {proj.tech && (
                    <p className="text-[11px] font-mono text-purple-600 mt-1">
                      {proj.tech}
                    </p>
                  )}

                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 pt-2 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700 hover:text-purple-900"
                  >
                    <span>View Project Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 rounded-2xl bg-purple-50/30 border border-dashed border-purple-200">
            <p className="text-xs text-slate-600 font-semibold">
              No academic projects added yet.
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Document your coursework mini-projects and development repositories by clicking "Add Project".
            </p>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Certifications & Honors</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified certifications from NPTEL SWAYAM, Coursera, and college technical forums
            </p>
          </div>

          <button
            onClick={() => setShowAddCert(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1 border border-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
        </div>

        {certs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex items-start space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {cert.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {cert.issuer}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-amber-900 font-semibold mt-1">
                    <span>{cert.score}</span>
                    {cert.date && (
                      <>
                        <span>•</span>
                        <span>{cert.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 rounded-2xl bg-purple-50/30 border border-dashed border-purple-200">
            <p className="text-xs text-slate-600 font-semibold">
              No certifications added yet.
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Add your completed NPTEL, Coursera, or industry certificates by clicking "Add Certificate".
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 space-y-4 animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-slate-900">Add Academic Project</h4>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VTU Question Paper Summarizer"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Technologies Used</label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, React"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what your project does..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showAddCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 space-y-4 animate-in fade-in zoom-in-95">
            <h4 className="text-base font-bold text-slate-900">Add Certificate / Recognition</h4>
            <form onSubmit={handleCreateCert} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Certificate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NPTEL Deep Learning"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issuing Organization</label>
                <input
                  type="text"
                  placeholder="e.g. IIT Madras / SWAYAM"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/50 border border-purple-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCert(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
