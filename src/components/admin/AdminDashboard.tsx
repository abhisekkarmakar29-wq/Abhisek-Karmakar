import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  CheckSquare,
  FileText,
  Download,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Video,
  Globe,
  Sparkles,
  AlertTriangle,
  X,
  Save,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import {
  User,
  Course,
  Activity,
  Question,
  Submission,
  SubmissionWithDetails,
  QuestionInputType
} from '../../types';
import {
  getUsers,
  getCourses,
  getActivities,
  getQuestionsByActivity,
  getAllSubmissionsWithDetails,
  createActivity,
  updateActivity,
  deleteActivity,
  gradeSubmission,
  exportSubmissionsCSV
} from '../../services/storage';

interface AdminDashboardProps {
  currentUser: User;
  onActivitySelect?: (activityId: string) => void;
}

type AdminViewTab = 'submissions' | 'activities' | 'students';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onActivitySelect
}) => {
  const [activeTab, setActiveTab] = useState<AdminViewTab>('submissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'reviewed' | 'draft'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  // Review Submission Modal
  const [reviewingSubmission, setReviewingSubmission] = useState<SubmissionWithDetails | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [instructorFeedback, setInstructorFeedback] = useState<string>('');

  // Activity Create / Edit Modal
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState<{
    courseId: string;
    activityTitle: string;
    description: string;
    instructions: string;
    points: number;
    estimatedMinutes: number;
    questions: {
      id?: string;
      questionText: string;
      inputType: QuestionInputType;
      isRequired: boolean;
      suggestions: string;
      placeholder: string;
    }[];
  }>({
    courseId: 'crs_v101',
    activityTitle: '',
    description: '',
    instructions: '',
    points: 100,
    estimatedMinutes: 45,
    questions: [
      {
        questionText: '',
        inputType: 'textarea',
        isRequired: true,
        suggestions: '',
        placeholder: ''
      }
    ]
  });

  // State data
  const users = getUsers();
  const students = users.filter((u) => u.role === 'student');
  const courses = getCourses();
  const activities = getActivities();
  const submissions = getAllSubmissionsWithDetails();

  // Metrics
  const totalSubmissionsCount = submissions.length;
  const pendingReviewCount = submissions.filter((s) => s.submissionStatus === 'submitted').length;
  const gradedCount = submissions.filter((s) => s.submissionStatus === 'reviewed').length;

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.studentVenture && sub.studentVenture.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || sub.submissionStatus === statusFilter;
    const matchesCourse = courseFilter === 'all' || sub.courseCode === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  // CSV Export handler
  const handleExportCSV = () => {
    const csvContent = exportSubmissionsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `wadhwani_submissions_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Review Modal
  const handleOpenReview = (sub: SubmissionWithDetails) => {
    setReviewingSubmission(sub);
    setGradeScore(sub.score || 85);
    setInstructorFeedback(sub.feedback || '');
  };

  // Submit Grade
  const handleSaveGrade = () => {
    if (!reviewingSubmission) return;
    gradeSubmission(
      reviewingSubmission.id,
      gradeScore,
      instructorFeedback,
      currentUser.id
    );
    setReviewingSubmission(null);
  };

  // Open Create Activity Modal
  const handleOpenCreateActivity = () => {
    setEditingActivityId(null);
    setActivityForm({
      courseId: courses[0]?.id || 'crs_v101',
      activityTitle: '',
      description: '',
      instructions: '',
      points: 100,
      estimatedMinutes: 45,
      questions: [
        {
          questionText: 'What is the primary customer friction your venture is tackling?',
          inputType: 'textarea',
          isRequired: true,
          suggestions: 'Encourage students to focus on customer observation over speculation.',
          placeholder: 'Provide your detailed answer...'
        },
        {
          questionText: 'Submit a 2-minute video pitch or customer interview snippet link.',
          inputType: 'video_url',
          isRequired: false,
          suggestions: 'Loom, YouTube, or Google Drive link.',
          placeholder: 'https://...'
        }
      ]
    });
    setIsActivityModalOpen(true);
  };

  // Open Edit Activity Modal
  const handleOpenEditActivity = (act: Activity) => {
    const questions = getQuestionsByActivity(act.id);
    setEditingActivityId(act.id);
    setActivityForm({
      courseId: act.courseId,
      activityTitle: act.activityTitle,
      description: act.description,
      instructions: act.instructions,
      points: act.points || 100,
      estimatedMinutes: act.estimatedMinutes || 45,
      questions: questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        inputType: q.inputType,
        isRequired: q.isRequired,
        suggestions: q.suggestions || '',
        placeholder: q.placeholder || ''
      }))
    });
    setIsActivityModalOpen(true);
  };

  // Delete Activity
  const handleDeleteActivity = (actId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete activity "${title}"? This cannot be undone.`)) {
      deleteActivity(actId);
    }
  };

  // Save Activity Form
  const handleSaveActivityForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.activityTitle.trim() || !activityForm.instructions.trim()) {
      alert('Activity title and instructions are required.');
      return;
    }

    if (editingActivityId) {
      // Update existing
      updateActivity(
        editingActivityId,
        {
          courseId: activityForm.courseId,
          activityTitle: activityForm.activityTitle,
          description: activityForm.description,
          instructions: activityForm.instructions,
          points: activityForm.points,
          estimatedMinutes: activityForm.estimatedMinutes
        },
        activityForm.questions.map((q, idx) => ({
          id: q.id || `qst_${Date.now()}_${idx}`,
          activityId: editingActivityId,
          questionText: q.questionText,
          inputType: q.inputType,
          isRequired: q.isRequired,
          displayOrder: idx + 1,
          suggestions: q.suggestions,
          placeholder: q.placeholder
        }))
      );
    } else {
      // Create new
      createActivity(
        {
          courseId: activityForm.courseId,
          activityTitle: activityForm.activityTitle,
          description: activityForm.description,
          instructions: activityForm.instructions,
          displayOrder: activities.length + 1,
          points: activityForm.points,
          estimatedMinutes: activityForm.estimatedMinutes,
          tags: ['Venture Track', 'Cohort Delta']
        },
        activityForm.questions.map((q, idx) => ({
          questionText: q.questionText,
          inputType: q.inputType,
          isRequired: q.isRequired,
          displayOrder: idx + 1,
          suggestions: q.suggestions,
          placeholder: q.placeholder
        }))
      );
    }

    setIsActivityModalOpen(false);
  };

  // Dynamic question adder inside activity modal
  const handleAddQuestionRow = () => {
    setActivityForm({
      ...activityForm,
      questions: [
        ...activityForm.questions,
        {
          questionText: '',
          inputType: 'textarea',
          isRequired: true,
          suggestions: '',
          placeholder: ''
        }
      ]
    });
  };

  const handleRemoveQuestionRow = (idx: number) => {
    if (activityForm.questions.length <= 1) return;
    const updated = [...activityForm.questions];
    updated.splice(idx, 1);
    setActivityForm({ ...activityForm, questions: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Admin Header with Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-1">
            <span>Faculty Directorate</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Administrator &amp; Faculty Command Center
          </h1>
          <p className="text-xs text-gray-500">
            Review student submissions, manage learning activities, evaluate venture deliverables,
            and export data
          </p>
        </div>

        {/* Global Export CSV Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Submissions (CSV)</span>
          </button>
          <button
            onClick={handleOpenCreateActivity}
            className="btn-primary-red flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Activity</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Registered Students
          </span>
          <p className="text-xl font-extrabold text-gray-900 mt-1">{students.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Curriculum Courses
          </span>
          <p className="text-xl font-extrabold text-gray-900 mt-1">{courses.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Total Activities
          </span>
          <p className="text-xl font-extrabold text-gray-900 mt-1">{activities.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            Pending Review
          </span>
          <p className="text-xl font-extrabold text-amber-700 mt-1">{pendingReviewCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Evaluated Submissions
          </span>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{gradedCount}</p>
        </div>
      </div>

      {/* Sub-Tabs: Submissions Review vs Activities Management vs Students */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'submissions'
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Student Submissions Review ({totalSubmissionsCount})</span>
          {activeTab === 'submissions' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'activities'
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Activity &amp; Question Builder ({activities.length})</span>
          {activeTab === 'activities' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'students'
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Registered Students Roster ({students.length})</span>
          {activeTab === 'students' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, email, venture or activity..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg input-green-focus focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {activeTab === 'submissions' && (
            <>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none input-green-focus"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted (Needs Review)</option>
                <option value="reviewed">Reviewed &amp; Graded</option>
                <option value="draft">In-Progress Draft</option>
              </select>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none input-green-focus"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.courseName.slice(0, 25)}...
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* TAB 1: SUBMISSIONS REVIEW */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No student submissions match your search and filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Student &amp; Venture</th>
                    <th className="px-4 py-3">Course / Track</th>
                    <th className="px-4 py-3">Activity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900">{sub.studentName}</div>
                        <div className="text-[11px] text-gray-500">{sub.studentEmail}</div>
                        {sub.studentVenture && (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            🌱 {sub.studentVenture}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {sub.courseCode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                        {sub.activityTitle}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.submissionStatus === 'reviewed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.submissionStatus === 'submitted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {sub.submissionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {sub.submittedDate
                          ? new Date(sub.submittedDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Draft'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        {sub.score !== undefined ? `${sub.score} / 100` : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenReview(sub)}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review &amp; Grade</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVITIES BUILDER */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act) => {
              const course = courses.find((c) => c.id === act.courseId);
              const questions = getQuestionsByActivity(act.id);
              const activitySubs = submissions.filter((s) => s.activityId === act.id);

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {course?.code || 'Course'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {questions.length} Questions defined
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900">{act.activityTitle}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {act.instructions}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                      <span>Points: <strong>{act.points || 100}</strong></span>
                      <span>•</span>
                      <span>Submissions: <strong>{activitySubs.length}</strong></span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditActivity(act)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                      <span>Edit &amp; Questions</span>
                    </button>

                    <button
                      onClick={() => handleDeleteActivity(act.id, act.activityTitle)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED STUDENTS ROSTER */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Email &amp; ID</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Venture Name</th>
                  <th className="px-4 py-3">Submissions</th>
                  <th className="px-4 py-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const stdSubs = submissions.filter((s) => s.studentId === student.id);
                  const completed = stdSubs.filter(
                    (s) => s.submissionStatus === 'submitted' || s.submissionStatus === 'reviewed'
                  ).length;

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-gray-700">{student.email}</div>
                        <div className="text-[10px] font-mono text-emerald-700">
                          {student.studentId || 'WF-2026-REG'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {student.institution || 'Incubation Member'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-emerald-800">
                          {student.ventureName || 'Venture Ideation'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-gray-900">
                        {completed} Completed / {stdSubs.length} Total
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {new Date(student.registrationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMISSION REVIEW & GRADING MODAL */}
      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {reviewingSubmission.courseCode} • Submission Review
                </span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {reviewingSubmission.activityTitle}
                </h2>
                <p className="text-xs text-slate-300">
                  Submitted by <strong>{reviewingSubmission.studentName}</strong> (
                  {reviewingSubmission.studentEmail})
                </p>
              </div>
              <button
                onClick={() => setReviewingSubmission(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Answers Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Student Metadata Card */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-gray-400 block font-medium">Venture:</span>
                  <span className="font-bold text-gray-900">
                    {reviewingSubmission.studentVenture || 'Stealth Venture'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Institution:</span>
                  <span className="font-bold text-gray-900">
                    {reviewingSubmission.studentInstitution || 'Wadhwani Network'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Submitted Date:</span>
                  <span className="font-bold text-gray-900">
                    {reviewingSubmission.submittedDate
                      ? new Date(reviewingSubmission.submittedDate).toLocaleString()
                      : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Answers Breakdown */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Student Question Responses
                </h3>

                {Object.keys(reviewingSubmission.answers).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No answers submitted yet.</p>
                ) : (
                  Object.entries(reviewingSubmission.answers).map(([qId, ansText], idx) => {
                    const isUrl = ansText.startsWith('http://') || ansText.startsWith('https://');
                    const isVideo = isUrl && (ansText.includes('youtube') || ansText.includes('loom') || ansText.includes('vimeo') || ansText.includes('drive.google'));

                    return (
                      <div
                        key={qId}
                        className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                          <span className="text-emerald-700">Question #{idx + 1}</span>
                        </div>

                        {/* Answer Display */}
                        {isUrl ? (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 truncate">
                              {isVideo ? (
                                <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              <a
                                href={ansText}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-emerald-700 hover:text-emerald-800 underline truncate font-mono"
                              >
                                {ansText}
                              </a>
                            </div>
                            <a
                              href={ansText}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1 shrink-0"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {ansText}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Grading & Feedback Section */}
              <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Faculty Evaluation &amp; Grading</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-emerald-900">Score (out of 100):</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(Number(e.target.value))}
                      className="w-20 px-2.5 py-1 text-sm bg-white border border-emerald-300 rounded-lg font-bold text-center input-green-focus focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    Instructor Constructive Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={instructorFeedback}
                    onChange={(e) => setInstructorFeedback(e.target.value)}
                    placeholder="Provide specific, encouraging feedback on the customer validation data, TAM size, and execution readiness..."
                    className="w-full p-3 text-xs bg-white border border-emerald-300 rounded-lg input-green-focus focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewingSubmission(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGrade}
                className="btn-primary-red px-5 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Grade &amp; Send Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ACTIVITY MODAL */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-red-600 to-emerald-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {editingActivityId ? 'Edit Activity & Questions' : 'Create New Learning Activity'}
                </h2>
                <p className="text-xs text-white/80">Configure assignment objectives, instructions, and inputs</p>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivityForm} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Course Track <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={activityForm.courseId}
                    onChange={(e) => setActivityForm({ ...activityForm, courseId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Activity Points
                  </label>
                  <input
                    type="number"
                    value={activityForm.points}
                    onChange={(e) =>
                      setActivityForm({ ...activityForm, points: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Activity Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activityForm.activityTitle}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, activityTitle: e.target.value })
                  }
                  placeholder="e.g. Activity 2.2: Channel Economics & Customer Acquisition Cost"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Short Goal / Description
                </label>
                <input
                  type="text"
                  value={activityForm.description}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, description: e.target.value })
                  }
                  placeholder="Summarize the core outcome students should produce..."
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Instructions &amp; Objective Guidelines <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={activityForm.instructions}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, instructions: e.target.value })
                  }
                  placeholder="Provide comprehensive instructions and coaching advice for completing this assignment..."
                  className="w-full p-3 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none leading-relaxed"
                />
              </div>

              {/* Dynamic Questions Builder */}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Activity Questions &amp; Deliverables ({activityForm.questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestionRow}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {activityForm.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-800">Question #{idx + 1}</span>
                        {activityForm.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestionRow(idx)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => {
                            const updated = [...activityForm.questions];
                            updated[idx].questionText = e.target.value;
                            setActivityForm({ ...activityForm, questions: updated });
                          }}
                          placeholder="Enter question prompt..."
                          className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Input Type
                          </label>
                          <select
                            value={q.inputType}
                            onChange={(e) => {
                              const updated = [...activityForm.questions];
                              updated[idx].inputType = e.target.value as QuestionInputType;
                              setActivityForm({ ...activityForm, questions: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                          >
                            <option value="textarea">Long Answer (Textarea)</option>
                            <option value="text">Single Line (Short Text)</option>
                            <option value="video_url">Video URL (Pitch / Interview)</option>
                            <option value="website_url">Website / Project Link</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            id={`req_${idx}`}
                            checked={q.isRequired}
                            onChange={(e) => {
                              const updated = [...activityForm.questions];
                              updated[idx].isRequired = e.target.checked;
                              setActivityForm({ ...activityForm, questions: updated });
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          <label htmlFor={`req_${idx}`} className="text-xs font-semibold text-gray-700">
                            Required Field
                          </label>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={q.suggestions}
                          onChange={(e) => {
                            const updated = [...activityForm.questions];
                            updated[idx].suggestions = e.target.value;
                            setActivityForm({ ...activityForm, questions: updated });
                          }}
                          placeholder="Optional suggestion or hint for students..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-red px-5 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  {editingActivityId ? 'Update Activity' : 'Publish Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
