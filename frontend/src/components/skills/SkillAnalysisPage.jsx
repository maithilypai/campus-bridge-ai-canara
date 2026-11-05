import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  skillImprovementAreas,
  personalizedRoadmap,
  recommendedResources
} from '../../data/mockData';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ExternalLink,
  BookOpen,
  Play
} from 'lucide-react';

export default function SkillAnalysisPage() {
  const { skills, updateSkillLevel, showToast } = useApp();
  const [activeRoadmapWeek, setActiveRoadmapWeek] = useState(1);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showSimModal, setShowSimModal] = useState(false);
  const [simQuestionIdx, setSimQuestionIdx] = useState(0);

  // Overall readiness average
  const overallScore = Math.round(
    skills.reduce((acc, curr) => acc + curr.level, 0) / skills.length
  );

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const exists = prev.includes(taskId);
      if (exists) {
        return prev.filter(t => t !== taskId);
      } else {
        showToast("Milestone Completed", "Checklist item marked as complete.", "purple");
        return [...prev, taskId];
      }
    });
  };

  const sampleDiagnosticQuestions = [
    {
      q: "Which loss function is optimal for multi-class classification with one-hot encoded labels?",
      options: ["Categorical Cross-Entropy", "Binary Cross-Entropy", "Mean Squared Error", "Hinge Loss"],
      answer: 0
    },
    {
      q: "What is the primary benefit of Residual Connections (Skip Connections) in ResNet?",
      options: ["Mitigate vanishing gradient problem in deep layers", "Reduce number of parameters", "Increase inference latency", "Prevent data loading bottlenecks"],
      answer: 0
    },
    {
      q: "In VTU DAA, what is the worst-case time complexity of Merge Sort?",
      options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"],
      answer: 0
    }
  ];

  const handleDiagnosticAnswer = () => {
    if (simQuestionIdx < sampleDiagnosticQuestions.length - 1) {
      setSimQuestionIdx(prev => prev + 1);
    } else {
      setShowSimModal(false);
      setSimQuestionIdx(0);
      showToast("Diagnostic Complete", "Your AI Skill Readiness score updated!", "purple");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-lavender-100/90 border border-purple-200/90 flex items-start space-x-3 text-xs text-purple-950">
        <Sparkles className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demonstration Notice: </span>
          <span>
            This AI Skill Analysis module demonstrates the proposed intelligent competency evaluation engine for Campus Bridge AI. It illustrates how student self-evaluations, coursework benchmarks, and personalized sprint roadmaps will function once AI inference models are connected.
          </span>
        </div>
      </div>

      {/* Top Banner & Readiness Score */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1f0f3e] via-[#2f1361] to-[#4c1d95] text-white p-6 sm:p-8 shadow-xl border border-purple-500/20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-medium">
            <BrainCircuit className="w-3.5 h-3.5 text-fuchsia-300" />
            <span>AI Competency Diagnostic Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Technical Skill Analysis & Readiness Roadmap
          </h2>

          <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl leading-relaxed">
            Evaluate your technical proficiencies across Python, Machine Learning, DAA, and MLOps to guide your self-study roadmap.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowSimModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Take Quick Self-Assessment</span>
            </button>
            <span className="text-[11px] text-purple-300 self-center">
              Benchmarked against VTU AIML Curriculum Guidelines
            </span>
          </div>
        </div>

        {/* Readiness Gauge (4 cols) */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-center w-full max-w-xs shadow-2xl">
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">
              Self-Assessment Score
            </span>
            <div className="mt-2 flex items-baseline justify-center space-x-1">
              <span className="text-5xl font-black text-amber-300 tracking-tight">
                {overallScore}
              </span>
              <span className="text-lg font-bold text-purple-200">/ 100</span>
            </div>

            <div className="w-full bg-white/20 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-fuchsia-400 to-purple-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${overallScore}%` }}
              />
            </div>

            <span className="inline-block mt-3 text-xs font-bold text-purple-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              Proficiency Benchmark
            </span>
          </div>
        </div>
      </div>

      {/* Technical Skills Overview & Progress Bars */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Technical Domains Self-Check</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proficiency ratings across core computer science and AI subjects
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Target Benchmark: 70%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skills.map((skill, idx) => {
            const isAboveBenchmark = skill.level >= skill.benchmark;

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-purple-50/40 hover:bg-purple-50/70 border border-purple-100/70 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {skill.category} • {skill.details}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-purple-900">
                      {skill.level}%
                    </span>
                    <span className={`block text-[10px] font-bold ${
                      isAboveBenchmark ? 'text-emerald-600' : 'text-purple-600'
                    }`}>
                      {skill.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar with benchmark marker */}
                <div className="relative pt-1">
                  <div className="w-full bg-purple-200/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${skill.color}`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>

                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-700 pointer-events-none"
                    style={{ left: `${skill.benchmark}%` }}
                    title={`Benchmark: ${skill.benchmark}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Target: {skill.benchmark}%</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateSkillLevel(skill.name, Math.min(100, skill.level + 5))}
                      className="text-purple-700 font-bold hover:underline px-1"
                    >
                      + Update Rating
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Focus Areas */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-4">
        <div className="flex items-center space-x-2 text-purple-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <h3 className="text-base font-bold text-slate-900">
            Suggested Skill Development Areas
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Recommended focus areas to complement VTU classroom learning
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {skillImprovementAreas.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-left space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    {item.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.estimatedWeeks}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Learning Suggestions (4-Week Sprint Roadmap) */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-700" />
              <span>Demonstration 4-Week AI Growth Roadmap</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured learning suggestions to help bridge theory with implementation
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Progress: {completedTasks.length} Completed
          </span>
        </div>

        {/* 4 Week Timeline Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {personalizedRoadmap.map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveRoadmapWeek(item.step)}
              className={`p-3 rounded-2xl text-left transition-all border ${
                activeRoadmapWeek === item.step
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                  : 'bg-purple-50/50 hover:bg-purple-100/60 text-slate-700 border-purple-100'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                activeRoadmapWeek === item.step ? 'text-purple-200' : 'text-purple-600'
              }`}>
                {item.week}
              </span>
              <h5 className="text-xs font-bold truncate mt-0.5">{item.title}</h5>
            </button>
          ))}
        </div>

        {/* Selected Week Tasks Breakdown */}
        {(() => {
          const currentSprint = personalizedRoadmap.find(r => r.step === activeRoadmapWeek) || personalizedRoadmap[0];

          return (
            <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    {currentSprint.week} Focus
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {currentSprint.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    {currentSprint.description}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-purple-100">
                  Reference: {currentSprint.platform}
                </span>
              </div>

              {/* Task Checklist */}
              <div className="space-y-2 pt-2 border-t border-purple-100">
                <span className="text-xs font-bold text-slate-700 block">Weekly Action Items:</span>
                {currentSprint.tasks.map((task, tIdx) => {
                  const taskId = `task-${currentSprint.step}-${tIdx}`;
                  const isDone = completedTasks.includes(taskId);

                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleTask(taskId)}
                      className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-500 line-through'
                          : 'bg-white hover:bg-purple-50 border-purple-100 text-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-purple-300'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium">{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Recommended Resources */}
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-purple-100/80 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-700" />
            <span>Recommended Learning Resources</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Open educational resources and official documentation for engineering students
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {recommendedResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100/80 flex flex-col justify-between transition-all group"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">
                  {res.tag}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors mt-2">
                  {res.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Provider: {res.instructor}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Type: {res.type} • {res.duration}
                </p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 pt-2 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700 hover:text-purple-900"
              >
                <span>Access Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Diagnostic Modal */}
      {showSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Question {simQuestionIdx + 1} of {sampleDiagnosticQuestions.length}
              </span>
              <button
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {sampleDiagnosticQuestions[simQuestionIdx].q}
              </h4>
            </div>

            <div className="space-y-2 pt-2">
              {sampleDiagnosticQuestions[simQuestionIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={handleDiagnosticAnswer}
                  className="w-full text-left p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100 text-xs font-semibold text-slate-800 border border-purple-100 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
