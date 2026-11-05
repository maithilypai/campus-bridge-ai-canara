import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Calculator,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export default function FeatureCards() {
  const { setActiveTab } = useApp();

  const features = [
    {
      id: 'resources',
      title: 'Notes & Resources',
      subtitle: 'Academic Curriculum Archive',
      badge: '1st - 4th Year AIML',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: BookOpen,
      iconBg: 'bg-purple-600 text-white shadow-purple-600/30',
      gradientBorder: 'hover:border-purple-300',
      description: 'Access official VTU syllabus, module study guides, question paper pattern references, and lab problem statements.',
      highlights: [
        'Module 1 to 5 Syllabus Outlines',
        'VTU Examination Specimen Papers',
        'Lab Problem Specifications'
      ],
      actionText: 'Browse 4-Year Resources',
      targetTab: 'resources'
    },
    {
      id: 'calculator',
      title: 'SGPA / CGPA Calculator',
      subtitle: 'VTU Grading Formula',
      badge: '2021 / 2022 Scheme',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Calculator,
      iconBg: 'bg-indigo-600 text-white shadow-indigo-600/30',
      gradientBorder: 'hover:border-indigo-300',
      description: 'Calculate semester SGPA and cumulative CGPA instantly with pre-loaded AIML course credits, letter grade conversions, and distinction metrics.',
      highlights: [
        '1-Click AIML Semester Preloads',
        'VTU % Converter: (CGPA - 0.75) × 10',
        'Academic Standing & Profile Save'
      ],
      actionText: 'Launch Calculator',
      targetTab: 'calculator'
    },
    {
      id: 'skills',
      title: 'AI Skill Analysis',
      subtitle: 'Competency Self-Check',
      badge: 'Self-Check',
      badgeColor: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
      icon: BrainCircuit,
      iconBg: 'bg-fuchsia-600 text-white shadow-fuchsia-600/30',
      gradientBorder: 'hover:border-fuchsia-300',
      description: 'Self-evaluate technical proficiencies across Python, Machine Learning, DAA, and MLOps. Identify focus areas and follow a tailored 4-week roadmap.',
      highlights: [
        'Technical Domain Self-Check',
        'Target Focus Areas',
        'Structured 4-Week Learning Roadmap'
      ],
      actionText: 'Analyze My Skills',
      targetTab: 'skills'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Core Academic Modules</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Campus Bridge Core
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key tools designed for Canara Engineering College undergraduates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.targetTab)}
              className={`group relative rounded-3xl bg-white p-6 shadow-soft hover:shadow-soft-hover border border-purple-100/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${card.gradientBorder}`}
            >
              {/* Top Row: Icon & Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${card.iconBg}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Subtitle & Title */}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 block mb-1">
                  {card.subtitle}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {card.description}
                </p>

                {/* Highlights List */}
                <div className="mt-4 pt-3 border-t border-purple-50 space-y-1.5">
                  {card.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-6 pt-3 border-t border-purple-50 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900">
                <span>{card.actionText}</span>
                <div className="w-7 h-7 rounded-full bg-purple-50 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
