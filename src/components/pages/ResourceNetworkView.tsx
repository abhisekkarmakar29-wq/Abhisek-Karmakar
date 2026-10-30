import React, { useState } from 'react';
import {
  Layers,
  FileText,
  Users,
  Video,
  ExternalLink,
  Download,
  BookOpen,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const ResourceNetworkView: React.FC = () => {
  const [bookedMentor, setBookedMentor] = useState<string | null>(null);

  const frameworks = [
    {
      title: 'Lean Canvas 1-Page Blueprint',
      description: 'Ash Maurya’s 9-block business model canvas optimized for pre-revenue startups.',
      tag: 'Core Template',
      format: 'Google Docs / Notion / PDF'
    },
    {
      title: 'Wadhwani 10-Slide Investor Deck',
      description: 'The proven narrative structure: Problem, Solution, Market Size, Traction, Team, Ask.',
      tag: 'Pitch Asset',
      format: 'Google Slides / Figma'
    },
    {
      title: 'Customer Discovery Interview Script',
      description: 'The Mom Test question bank to avoid false positives and unearth genuine customer willingness to pay.',
      tag: 'Customer Validation',
      format: 'Interview Protocol'
    },
    {
      title: 'Unit Economics & CAC/LTV Calculator',
      description: 'Spreadsheet to compute gross margin, customer acquisition cost, churn rate, and payback period.',
      tag: 'Financial Model',
      format: 'Excel / Sheets'
    }
  ];

  const mentors = [
    {
      name: 'Dr. Rajesh Mehta',
      title: 'Chief Venture Coach & Incubation Director',
      specialty: 'B2B SaaS, DeepTech & AgriTech',
      available: 'Wednesdays 3:00 PM - 5:00 PM',
      rating: '4.9/5.0 (42 reviews)'
    },
    {
      name: 'Ananya Deshmukh',
      title: 'Managing Partner, Frontier Ventures',
      specialty: 'Go-to-Market, Growth Loops & Seed Fundraising',
      available: 'Fridays 10:00 AM - 12:00 PM',
      rating: '5.0/5.0 (38 reviews)'
    },
    {
      name: 'Vikram Sengupta',
      title: 'Ex-CTO, Scaled Venture & Angel Investor',
      specialty: 'MVP Architecture, Product Scoping & AI Tech Stack',
      available: 'Tuesdays 4:00 PM - 6:00 PM',
      rating: '4.8/5.0 (29 reviews)'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Entrepreneurship Ecosystem
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
          Wadhwani Resource &amp; Mentor Network
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
          Access curated venture toolkits, investor pitch guidelines, financial calculators, and
          schedule 1-on-1 office hours with seasoned startup mentors.
        </p>
      </div>

      {/* Startup Toolkits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Venture Frameworks &amp; Downloadable Toolkits</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworks.map((fw, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {fw.tag}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">{fw.format}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900">{fw.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{fw.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold">Free for Enrolled Students</span>
                <button
                  onClick={() => alert(`Downloading "${fw.title}" template package.`)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Toolkit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Directory & Office Hours */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-red-600" />
              <span>Incubation Mentors &amp; Office Hours</span>
            </h2>
            <p className="text-xs text-gray-500">Book 30-minute 1-on-1 feedback sessions on your activity submissions</p>
          </div>
        </div>

        {bookedMentor && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Office hours request sent to <strong>{bookedMentor}</strong>! Calendar invite will arrive in your student email.</span>
            </div>
            <button
              onClick={() => setBookedMentor(null)}
              className="text-[11px] text-emerald-900 font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentors.map((mentor, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm mb-3 border border-slate-200">
                  {mentor.name.slice(0, 2)}
                </div>
                <h3 className="font-bold text-sm text-gray-900">{mentor.name}</h3>
                <p className="text-xs text-emerald-700 font-medium">{mentor.title}</p>
                <p className="text-xs text-gray-500 mt-2"><strong>Focus:</strong> {mentor.specialty}</p>
                <p className="text-[11px] text-gray-400 mt-1">🕒 {mentor.available}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setBookedMentor(mentor.name)}
                  className="w-full btn-primary-red py-2 rounded-lg text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book 1-on-1 Office Hours</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
