import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Course, Activity, Submission } from '../../types';

interface CoursesViewProps {
  courses: Course[];
  activities: Activity[];
  submissions: Submission[];
  onStartActivity: (activityId: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  activities,
  submissions,
  onStartActivity
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseActivities = activities.filter((a) => a.courseId === selectedCourse?.id);

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Curriculum Architecture
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            My Enrolled Courses &amp; Entrepreneurship Tracks
          </h1>
          <p className="text-xs text-gray-500">
            Structured modular courses designed by the Wadhwani Foundation venture curriculum
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg input-green-focus focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Courses List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Enrolled Tracks ({filteredCourses.length})
          </h2>

          <div className="space-y-2.5">
            {filteredCourses.map((course) => {
              const acts = activities.filter((a) => a.courseId === course.id);
              const completedCount = acts.filter((a) =>
                submissions.some(
                  (s) =>
                    s.activityId === a.id &&
                    (s.submissionStatus === 'submitted' || s.submissionStatus === 'reviewed')
                )
              ).length;
              const isSelected = selectedCourse?.id === course.id;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-400 shadow-xs'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {course.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-gray-900 line-clamp-1">
                    {course.courseName}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{acts.length} Activities</span>
                    <span className="text-emerald-700 font-bold">
                      {completedCount}/{acts.length} Done
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Course Detail & Activities Breakdown */}
        {selectedCourse && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {selectedCourse.code}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-2">
                    {selectedCourse.courseName}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Track Duration</span>
                  <span className="font-bold text-gray-800">
                    {selectedCourse.durationWeeks || 4} Weeks
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Enrolled Peers</span>
                  <span className="font-bold text-gray-800">
                    {selectedCourse.enrolledCount || 100}+ Founders
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Certification</span>
                  <span className="font-bold text-emerald-700">WEN Accredited</span>
                </div>
              </div>
            </div>

            {/* Course Activities List */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 tracking-tight">
                  Course Learning Activities &amp; Milestones
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {courseActivities.length} Milestones
                </span>
              </div>

              {courseActivities.length === 0 ? (
                <p className="text-xs text-gray-400 italic p-4 text-center">
                  No activities published for this course yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {courseActivities.map((act, index) => {
                    const sub = submissions.find((s) => s.activityId === act.id);
                    const isSubmitted = sub?.submissionStatus === 'submitted';
                    const isReviewed = sub?.submissionStatus === 'reviewed';

                    return (
                      <div
                        key={act.id}
                        className="p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-gray-400">
                              #{index + 1}
                            </span>
                            <h4 className="font-bold text-xs text-gray-900">{act.activityTitle}</h4>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-1 leading-relaxed">
                            {act.description}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
                            {act.estimatedMinutes && <span>~{act.estimatedMinutes} min</span>}
                            {act.points && <span>• {act.points} pts</span>}
                            {sub?.score !== undefined && (
                              <span className="font-bold text-emerald-700">
                                • Score: {sub.score}/100
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isReviewed && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              Graded
                            </span>
                          )}
                          {isSubmitted && (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                              Under Review
                            </span>
                          )}

                          <button
                            onClick={() => onStartActivity(act.id)}
                            className={
                              isReviewed || isSubmitted
                                ? 'px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                                : 'btn-primary-red px-3 py-1.5 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1'
                            }
                          >
                            <span>
                              {isReviewed || isSubmitted ? 'View Answers' : 'Launch Activity'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
