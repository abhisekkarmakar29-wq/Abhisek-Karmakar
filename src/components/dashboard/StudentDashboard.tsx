import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCheck
} from 'lucide-react';
import { User, Course, Activity, Submission } from '../../types';

interface StudentDashboardProps {
  currentUser: User;
  courses: Course[];
  activities: Activity[];
  submissions: Submission[];
  onStartActivity: (activityId: string) => void;
  onNavigate: (tab: string, param?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  activities,
  submissions,
  onStartActivity,
  onNavigate
}) => {
  const [activityFilter, setActivityFilter] = useState<'all' | 'pending' | 'draft' | 'completed'>('all');

  // Student specific submissions
  const studentSubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  // Compute metrics
  const totalActivitiesCount = activities.length;
  const completedSubmissions = studentSubmissions.filter(
    (s) => s.submissionStatus === 'submitted' || s.submissionStatus === 'reviewed'
  );
  const draftSubmissions = studentSubmissions.filter((s) => s.submissionStatus === 'draft');
  const pendingCount = totalActivitiesCount - completedSubmissions.length;
  const progressPercent =
    totalActivitiesCount > 0 ? Math.round((completedSubmissions.length / totalActivitiesCount) * 100) : 0;

  // Map activities with submission status
  const activitiesWithStatus = activities.map((act) => {
    const course = courses.find((c) => c.id === act.courseId);
    const sub = studentSubmissions.find((s) => s.activityId === act.id);
    return {
      ...act,
      courseName: course?.courseName || 'Entrepreneurship Foundation',
      courseCode: course?.code || 'V100',
      status: sub ? sub.submissionStatus : 'unstarted',
      submission: sub
    };
  });

  const filteredActivities = activitiesWithStatus.filter((act) => {
    if (activityFilter === 'completed') return act.status === 'submitted' || act.status === 'reviewed';
    if (activityFilter === 'draft') return act.status === 'draft';
    if (activityFilter === 'pending') return act.status === 'unstarted' || act.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome & Student Venture Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.cohort || 'Fall 2026 - Cohort Delta'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.fullName}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Continue your entrepreneurship journey with Wadhwani Foundation. Validate hypotheses,
              submit evidence-backed assignments, and build your venture.
            </p>
            {currentUser.ventureName && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Venture: {currentUser.ventureName}
                </span>
                {currentUser.institution && (
                  <span className="text-slate-400 border-l border-slate-700 pl-4">
                    {currentUser.institution}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Progress Dial Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 flex items-center gap-4 shrink-0">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-white/30 flex items-center justify-center font-extrabold text-xl">
              {progressPercent}%
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                Overall Track
              </p>
              <p className="text-sm font-bold text-white">
                {completedSubmissions.length} of {totalActivitiesCount} Finished
              </p>
              <p className="text-[11px] text-emerald-400">
                {pendingCount > 0 ? `${pendingCount} activities pending` : 'All tasks completed!'}
              </p>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Enrolled Tracks
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{courses.length}</p>
          <p className="text-xs text-gray-500 mt-1">Foundation &amp; Validation</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Completed Activities
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{completedSubmissions.length}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Verified Submissions</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pending Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{pendingCount}</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">Upcoming Deadlines</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              In-Progress Drafts
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{draftSubmissions.length}</p>
          <p className="text-xs text-red-600 font-semibold mt-1">Ready to complete</p>
        </div>
      </div>

      {/* Enrolled Courses Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Enrolled Courses</h2>
            <p className="text-xs text-gray-500">
              Curriculum tracks assigned by your entrepreneurship faculty
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.slice(0, 3).map((course) => {
            const courseActs = activities.filter((a) => a.courseId === course.id);
            const courseCompleted = courseActs.filter((a) =>
              studentSubmissions.some(
                (s) =>
                  s.activityId === a.id &&
                  (s.submissionStatus === 'submitted' || s.submissionStatus === 'reviewed')
              )
            ).length;
            const coursePercent =
              courseActs.length > 0 ? Math.round((courseCompleted / courseActs.length) * 100) : 0;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {course.category || 'Track'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 font-medium">
                    <span>Progress</span>
                    <span className="font-bold text-gray-900">{coursePercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${coursePercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {courseCompleted} of {courseActs.length} Activities
                    </span>
                    <button
                      onClick={() => {
                        const nextAct = courseActs.find(
                          (a) =>
                            !studentSubmissions.some(
                              (s) =>
                                s.activityId === a.id &&
                                (s.submissionStatus === 'submitted' ||
                                  s.submissionStatus === 'reviewed')
                            )
                        );
                        if (nextAct) {
                          onStartActivity(nextAct.id);
                        } else if (courseActs[0]) {
                          onStartActivity(courseActs[0].id);
                        }
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <span>Resume</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Learning Activities Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Learning Activities</h2>
            <p className="text-xs text-gray-500">
              Submit your answers, record pitch videos, and share live prototype links
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActivityFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activityFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({activitiesWithStatus.length})
            </button>
            <button
              onClick={() => setActivityFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activityFilter === 'pending'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              To-Do ({pendingCount})
            </button>
            <button
              onClick={() => setActivityFilter('draft')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activityFilter === 'draft'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Drafts ({draftSubmissions.length})
            </button>
            <button
              onClick={() => setActivityFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activityFilter === 'completed'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Completed ({completedSubmissions.length})
            </button>
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((act) => {
            const isCompleted = act.status === 'submitted' || act.status === 'reviewed';
            const isDraft = act.status === 'draft';

            return (
              <div
                key={act.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {act.courseCode}
                    </span>

                    {/* Status Badge */}
                    {act.status === 'reviewed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCheck className="w-3 h-3" />
                        Reviewed ({act.submission?.score || 100} pts)
                      </span>
                    )}
                    {act.status === 'submitted' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3 h-3" />
                        Submitted (Pending Review)
                      </span>
                    )}
                    {act.status === 'draft' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <RotateCcw className="w-3 h-3" />
                        Draft Saved
                      </span>
                    )}
                    {act.status === 'unstarted' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        Not Started
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 leading-snug">
                    {act.activityTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Tags */}
                  {act.tags && act.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {act.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    {act.estimatedMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{act.estimatedMinutes} mins
                      </span>
                    )}
                    {act.points && (
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        {act.points} pts
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onStartActivity(act.id)}
                    className={
                      isCompleted
                        ? 'px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1'
                        : isDraft
                        ? 'btn-primary-red px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1'
                        : 'btn-primary-red px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1'
                    }
                  >
                    <span>{isCompleted ? 'View Answers' : isDraft ? 'Continue Draft' : 'Start Activity'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions & Feedback Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Recent Submissions</h2>
            <p className="text-xs text-gray-500">Track assignment submissions and instructor grading</p>
          </div>
        </div>

        {studentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No submissions recorded yet. Select an activity above to begin!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted On</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentSubmissions.map((sub) => {
                  const act = activities.find((a) => a.id === sub.activityId);
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-gray-900">{act?.activityTitle || 'Activity'}</p>
                        {sub.feedback && (
                          <p className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-200">
                            <strong>Faculty Note:</strong> {sub.feedback}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.submissionStatus === 'reviewed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.submissionStatus === 'submitted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.submissionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {sub.submittedDate
                          ? new Date(sub.submittedDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Draft In Progress'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        {sub.score !== undefined ? `${sub.score} / 100` : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => onStartActivity(sub.activityId)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                        >
                          {sub.submissionStatus === 'draft' ? 'Edit Draft' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
