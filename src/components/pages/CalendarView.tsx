import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Activity, Submission } from '../../types';

interface CalendarViewProps {
  activities: Activity[];
  submissions: Submission[];
  onStartActivity: (activityId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  activities,
  submissions,
  onStartActivity
}) => {
  const events = [
    {
      date: 'Nov 15, 2026',
      title: 'Activity 1.1 Due: Problem Statement & Market Need',
      type: 'assignment',
      time: '11:59 PM',
      activityId: 'act_1_1'
    },
    {
      date: 'Nov 18, 2026',
      title: 'Faculty Masterclass: Conducting Unbiased Customer Interviews',
      type: 'masterclass',
      time: '4:00 PM - 5:30 PM',
      speaker: 'Dr. Rajesh Mehta (Zoom Live)'
    },
    {
      date: 'Nov 20, 2026',
      title: 'Activity 1.2 Due: Customer Persona & Pain Point Video Deliverable',
      type: 'assignment',
      time: '11:59 PM',
      activityId: 'act_1_2'
    },
    {
      date: 'Nov 25, 2026',
      title: 'Cohort Delta Peer-Review & Pitch Feedback Circle',
      type: 'workshop',
      time: '6:00 PM - 7:30 PM',
      speaker: 'Interactive Breakout Rooms'
    },
    {
      date: 'Nov 28, 2026',
      title: 'Activity 2.1 Due: Lean Canvas Architecture & Unit Economics',
      type: 'assignment',
      time: '11:59 PM',
      activityId: 'act_2_1'
    },
    {
      date: 'Dec 05, 2026',
      title: 'Activity 3.1 Due: MVP Prototype Walkthrough & User Testing Report',
      type: 'assignment',
      time: '11:59 PM',
      activityId: 'act_3_1'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Schedule &amp; Deadlines
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
            Academic Calendar &amp; Venture Milestones
          </h1>
          <p className="text-xs text-gray-500">
            Never miss an assignment deadline or live faculty incubation masterclass
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Timeline List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Cohort Delta Timeline (November - December 2026)
            </h2>

            <div className="space-y-4 divide-y divide-gray-100">
              {events.map((ev, idx) => {
                const sub = ev.activityId ? submissions.find((s) => s.activityId === ev.activityId) : null;
                const isCompleted = sub?.submissionStatus === 'submitted' || sub?.submissionStatus === 'reviewed';

                return (
                  <div key={idx} className="pt-4 first:pt-0 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {ev.date.split(' ')[0]}
                      </span>
                      <span className="text-lg font-black text-gray-900">
                        {ev.date.split(' ')[1].replace(',', '')}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            ev.type === 'assignment'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : ev.type === 'masterclass'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {ev.type}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-gray-900">{ev.title}</h3>
                      {ev.speaker && (
                        <p className="text-xs text-gray-500">Host: {ev.speaker}</p>
                      )}

                      {ev.activityId && (
                        <div className="pt-2">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Assignment Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => onStartActivity(ev.activityId!)}
                              className="btn-primary-red px-3 py-1 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1"
                            >
                              <span>Work on Activity</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Incubation Submission Policy</h3>
            <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <p>
                • <strong>Drafts:</strong> You may edit and save assignment drafts at any time before final submission.
              </p>
              <p>
                • <strong>Evidence:</strong> Video and URL deliverables must be accessible to evaluators without requiring private credentials.
              </p>
              <p>
                • <strong>Feedback:</strong> Faculty reviews are returned within 48 to 72 hours of submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
