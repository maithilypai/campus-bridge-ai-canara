import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { vtuSemesterPresets, gradePointsMap } from '../../data/mockData';
import {
  Calculator,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Award,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

export default function CalculatorPage() {
  const { currentUser, showToast, saveSemesterSgpa } = useApp();

  // Mode: 'sgpa' or 'cgpa'
  const [calculatorMode, setCalculatorMode] = useState('sgpa');

  // Selected semester name for saving
  const [saveSemesterName, setSaveSemesterName] = useState(`Sem ${currentUser?.semester || 1}`);

  // SGPA Subject state
  const [subjects, setSubjects] = useState(vtuSemesterPresets["6th Sem AIML"] || []);
  const [sgpaResult, setSgpaResult] = useState(null);

  // CGPA Semester state
  const [semesters, setSemesters] = useState(() => {
    if (currentUser?.semesterHistory && currentUser.semesterHistory.length > 0) {
      return currentUser.semesterHistory.map(s => ({ ...s }));
    }
    return [
      { sem: "Sem 1", sgpa: 8.50, credits: 20 },
      { sem: "Sem 2", sgpa: 8.75, credits: 20 },
      { sem: "Sem 3", sgpa: 8.60, credits: 24 }
    ];
  });
  const [cgpaResult, setCgpaResult] = useState(null);

  // Load preset for SGPA
  const handleLoadPreset = (presetKey) => {
    setSubjects(vtuSemesterPresets[presetKey]);
    setSgpaResult(null);
    setSaveSemesterName(presetKey.replace(' AIML', '').trim());
    showToast("Preset Loaded", `Loaded subjects for ${presetKey}`, "purple");
  };

  // Add Subject row
  const handleAddSubject = () => {
    const newId = Date.now();
    setSubjects(prev => [
      ...prev,
      { id: newId, name: `Elective / Course ${prev.length + 1}`, credits: 3, grade: "A+" }
    ]);
  };

  // Remove Subject row
  const handleRemoveSubject = (id) => {
    if (subjects.length <= 1) {
      showToast("Cannot Delete", "At least one subject is required to compute SGPA.", "info");
      return;
    }
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Update Subject row
  const handleUpdateSubject = (id, field, value) => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, [field]: field === 'credits' ? parseFloat(value) || 0 : value };
        }
        return s;
      })
    );
  };

  // Reset to default
  const handleResetSubjects = () => {
    setSubjects(vtuSemesterPresets["6th Sem AIML"]);
    setSgpaResult(null);
  };

  // Calculate SGPA
  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach(sub => {
      const cr = parseFloat(sub.credits) || 0;
      const gp = gradePointsMap[sub.grade] ?? 0;
      totalCredits += cr;
      totalPoints += (cr * gp);
    });

    if (totalCredits === 0) {
      showToast("Calculation Error", "Total credits cannot be zero.", "info");
      return;
    }

    const calculatedSGPA = totalPoints / totalCredits;
    const vtuPercentage = Math.max(0, (calculatedSGPA - 0.75) * 10);

    let classification = "Pass Class";
    if (calculatedSGPA >= 7.75) classification = "First Class with Distinction (FCD)";
    else if (calculatedSGPA >= 6.75) classification = "First Class (FC)";
    else if (calculatedSGPA >= 5.75) classification = "Second Class (SC)";
    else if (calculatedSGPA < 4.0) classification = "Fail / Needs Backlog Clearance";

    const gradeCounts = {};
    subjects.forEach(sub => {
      gradeCounts[sub.grade] = (gradeCounts[sub.grade] || 0) + 1;
    });

    setSgpaResult({
      sgpa: calculatedSGPA,
      percentage: vtuPercentage,
      totalCredits,
      totalPoints,
      classification,
      gradeCounts
    });

    showToast("SGPA Calculated", `Calculated SGPA: ${calculatedSGPA.toFixed(2)} (${classification})`, "purple");
  };

  // Save to profile
  const handleSaveToProfile = () => {
    if (!sgpaResult) return;
    saveSemesterSgpa(saveSemesterName, sgpaResult.sgpa, sgpaResult.totalCredits);
    showToast("Recorded in Profile", `${saveSemesterName} SGPA saved. Academic standing updated.`, "purple");
  };

  // Calculate CGPA
  const calculateCGPA = () => {
    let totalCreditPoints = 0;
    let totalCredits = 0;

    semesters.forEach(s => {
      const sg = parseFloat(s.sgpa) || 0;
      const cr = parseFloat(s.credits) || 0;
      if (sg > 0 && cr > 0) {
        totalCreditPoints += (sg * cr);
        totalCredits += cr;
      }
    });

    if (totalCredits === 0) {
      showToast("Calculation Error", "Please enter valid credits and SGPA.", "info");
      return;
    }

    const finalCGPA = totalCreditPoints / totalCredits;
    const finalPercentage = Math.max(0, (finalCGPA - 0.75) * 10);

    let classification = "Pass Class";
    if (finalCGPA >= 7.75) classification = "First Class with Distinction (FCD)";
    else if (finalCGPA >= 6.75) classification = "First Class (FC)";
    else if (finalCGPA >= 5.75) classification = "Second Class (SC)";
    else if (finalCGPA < 4.0) classification = "Needs Improvement";

    setCgpaResult({
      cgpa: finalCGPA,
      percentage: finalPercentage,
      totalCredits,
      classification
    });

    showToast("CGPA Calculated", `Cumulative CGPA: ${finalCGPA.toFixed(2)}`, "purple");
  };

  const handleUpdateSemester = (index, field, value) => {
    setSemesters(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: parseFloat(value) || 0
      };
      return updated;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#210f44] via-[#2f1361] to-[#4c1d95] text-white p-6 sm:p-8 shadow-xl border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-medium mb-2">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>VTU Official Grading System & Formula</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SGPA & CGPA Academic Calculator
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
            Accurate credit-weighted grade points calculator with instant percentage conversion: <code className="bg-purple-900/60 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">(CGPA - 0.75) × 10</code>.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex space-x-1 flex-shrink-0">
          <button
            onClick={() => setCalculatorMode('sgpa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              calculatorMode === 'sgpa'
                ? 'bg-white text-purple-950 shadow-md'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Semester SGPA
          </button>
          <button
            onClick={() => setCalculatorMode('cgpa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              calculatorMode === 'cgpa'
                ? 'bg-white text-purple-950 shadow-md'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Cumulative CGPA
          </button>
        </div>
      </div>

      {/* SGPA MODE */}
      {calculatorMode === 'sgpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table / Editor (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-5">
            {/* Presets and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-50">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">1-Click Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(vtuSemesterPresets).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleLoadPreset(preset)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleResetSubjects}
                className="text-xs font-semibold text-slate-400 hover:text-purple-700 flex items-center space-x-1"
                title="Reset table"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Subject List Header */}
            <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              <div className="col-span-6">Subject / Course Name</div>
              <div className="col-span-2 text-center">Credits</div>
              <div className="col-span-3 text-center">Grade Point</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Subject Rows */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {subjects.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-2xl bg-purple-50/40 hover:bg-purple-50/80 border border-purple-100/70 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center transition-all"
                >
                  {/* Subject Name Input */}
                  <div className="sm:col-span-6 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleUpdateSubject(sub.id, 'name', e.target.value)}
                      placeholder="Subject Name"
                      className="w-full text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-600 focus:outline-none px-1 py-1"
                    />
                  </div>

                  {/* Credits Selection */}
                  <div className="sm:col-span-2 flex items-center justify-center">
                    <select
                      value={sub.credits}
                      onChange={(e) => handleUpdateSubject(sub.id, 'credits', e.target.value)}
                      className="w-full sm:w-20 px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-center"
                    >
                      <option value={4}>4.0</option>
                      <option value={3}>3.0</option>
                      <option value={2}>2.0</option>
                      <option value={1.5}>1.5</option>
                      <option value={1}>1.0</option>
                    </select>
                  </div>

                  {/* Letter Grade Selection */}
                  <div className="sm:col-span-3 flex items-center justify-center">
                    <select
                      value={sub.grade}
                      onChange={(e) => handleUpdateSubject(sub.id, 'grade', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                    >
                      <option value="O">O (Outstanding - 10)</option>
                      <option value="A+">A+ (Excellent - 9)</option>
                      <option value="A">A (Very Good - 8)</option>
                      <option value="B+">B+ (Good - 7)</option>
                      <option value="B">B (Above Average - 6)</option>
                      <option value="C">C (Average - 5)</option>
                      <option value="P">P (Pass - 4)</option>
                      <option value="F">F (Fail - 0)</option>
                    </select>
                  </div>

                  {/* Delete Row Button */}
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row: Add Subject & Calculate Buttons */}
            <div className="pt-4 border-t border-purple-50 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleAddSubject}
                className="px-4 py-2.5 rounded-xl border border-dashed border-purple-300 hover:border-purple-600 text-purple-700 hover:bg-purple-50 font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Subject</span>
              </button>

              <button
                onClick={calculateSGPA}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate SGPA Now</span>
              </button>
            </div>
          </div>

          {/* Right Summary Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Calculation Summary
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  VTU Scheme
                </span>
              </div>

              {sgpaResult ? (
                <div className="mt-5 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  {/* Big SGPA Score Display */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white text-center shadow-lg shadow-purple-700/30">
                    <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">
                      Calculated Semester SGPA
                    </span>
                    <span className="text-5xl font-black tracking-tight text-white mt-1 block">
                      {sgpaResult.sgpa.toFixed(2)}
                    </span>
                    <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                      {sgpaResult.classification}
                    </span>
                  </div>

                  {/* VTU Percentage & Credits Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">VTU Percentage</span>
                      <span className="text-lg font-extrabold text-purple-900 mt-0.5 block">
                        {sgpaResult.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Credits</span>
                      <span className="text-lg font-extrabold text-purple-900 mt-0.5 block">
                        {sgpaResult.totalCredits} Cr
                      </span>
                    </div>
                  </div>

                  {/* Grade Breakdown Distribution */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 mb-2">Grade Breakdown:</h5>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {Object.entries(sgpaResult.gradeCounts).map(([grade, count]) => (
                        <div key={grade} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[11px] font-bold text-purple-700">{grade}</span>
                          <span className="text-xs font-extrabold text-slate-800 ml-1">× {count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save to Profile Selector & Button */}
                  <div className="pt-2 border-t border-purple-100 space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Save As:</label>
                      <select
                        value={saveSemesterName}
                        onChange={(e) => setSaveSemesterName(e.target.value)}
                        className="w-full text-xs font-bold px-2 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <option key={s} value={`Sem ${s}`}>Semester {s} Record</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSaveToProfile}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Save Result to My Profile</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial state before calculating */
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Ready to Compute</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Select your grades and credits on the left, then click <strong>"Calculate SGPA Now"</strong> to view your performance metrics.
                  </p>
                </div>
              )}
            </div>

            {/* VTU Official Reference Card */}
            <div className="p-4 rounded-2xl bg-lavender-100/70 border border-purple-200/80 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-purple-900 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                <span>VTU Grading Scheme Notes</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                <li>Letter 'O' confers 10 Grade Points (Marks &ge; 90).</li>
                <li>Letter 'A+' confers 9 Grade Points (Marks 80-89).</li>
                <li>Percentage = (SGPA - 0.75) × 10.</li>
                <li>FCD Awarded for CGPA &ge; 7.75.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CGPA MODE */}
      {calculatorMode === 'cgpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Semester-Wise Cumulative CGPA Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate cumulative grade points across all completed semesters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {semesters.map((sem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{sem.sem}</h5>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                      <span>Credits:</span>
                      <input
                        type="number"
                        value={sem.credits}
                        onChange={(e) => handleUpdateSemester(idx, 'credits', e.target.value)}
                        className="w-14 px-1.5 py-0.5 rounded bg-white border border-purple-200 text-xs font-semibold text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block text-right">SGPA</span>
                    <input
                      type="number"
                      step="0.01"
                      value={sem.sgpa}
                      onChange={(e) => handleUpdateSemester(idx, 'sgpa', e.target.value)}
                      className="w-20 px-2 py-1 rounded-xl bg-white border border-purple-200 text-sm font-extrabold text-purple-900 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-purple-50 flex justify-end">
              <button
                onClick={calculateCGPA}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Cumulative CGPA</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block pb-3 border-b border-purple-50">
                CGPA Result
              </span>

              {cgpaResult ? (
                <div className="mt-5 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white text-center shadow-lg shadow-purple-700/30">
                    <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">
                      Cumulative Degree CGPA
                    </span>
                    <span className="text-5xl font-black tracking-tight text-white mt-1 block">
                      {cgpaResult.cgpa.toFixed(2)}
                    </span>
                    <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                      {cgpaResult.classification}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">VTU %</span>
                      <span className="text-lg font-extrabold text-purple-900 mt-0.5 block">
                        {cgpaResult.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Credits</span>
                      <span className="text-lg font-extrabold text-purple-900 mt-0.5 block">
                        {cgpaResult.totalCredits} Cr
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Compute Degree CGPA</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Review your completed semester SGPAs on the left and click <strong>"Calculate Cumulative CGPA"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
