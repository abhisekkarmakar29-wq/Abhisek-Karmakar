import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Video,
  Globe,
  FileText,
  Clock,
  Award,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import { Activity, Question, Submission, User } from '../../types';
import {
  getCourseById,
  getQuestionsByActivity,
  getSubmissionWithAnswers,
  saveDraft,
  submitActivity
} from '../../services/storage';

interface ActivityRunnerProps {
  activity: Activity;
  currentUser: User;
  onBack: () => void;
  onSubmissionComplete?: () => void;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({
  activity,
  currentUser,
  onBack,
  onSubmissionComplete
}) => {
  const course = getCourseById(activity.courseId);
  const questions = getQuestionsByActivity(activity.id);

  // Current step state (0-indexed question index)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<Submission | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('All changes synced');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing submission and answers on mount
  useEffect(() => {
    const { submission: existingSub, answers: existingAns } = getSubmissionWithAnswers(
      currentUser.id,
      activity.id
    );
    setSubmission(existingSub);
    setAnswers(existingAns || {});

    // Resume from saved step if within bounds
    if (existingSub?.currentStep && existingSub.currentStep <= questions.length) {
      setCurrentStepIndex(Math.max(0, existingSub.currentStep - 1));
    }
  }, [activity.id, currentUser.id, questions.length]);

  // Real-time answers update
  const handleAnswerChange = (questionId: string, val: string) => {
    setValidationError(null);
    const updated = { ...answers, [questionId]: val };
    setAnswers(updated);
    setAutoSaveStatus('Saving changes...');

    // Debounced draft auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft(currentUser.id, activity.id, updated, currentStepIndex + 1);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAutoSaveStatus(`Draft auto-saved at ${timeStr}`);
    }, 1200);
  };

  const currentQuestion: Question | undefined = questions[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === questions.length - 1;
  const isAlreadySubmitted =
    submission?.submissionStatus === 'submitted' || submission?.submissionStatus === 'reviewed';

  // Manual Draft Save
  const handleManualSaveDraft = () => {
    setIsSavingDraft(true);
    try {
      const saved = saveDraft(currentUser.id, activity.id, answers, currentStepIndex + 1);
      setSubmission(saved);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAutoSaveStatus(`Draft saved at ${timeStr}`);
    } finally {
      setTimeout(() => setIsSavingDraft(false), 400);
    }
  };

  // Step Navigation - Next
  const handleNext = () => {
    setValidationError(null);
    if (!currentQuestion) return;

    // Check if required
    if (currentQuestion.isRequired) {
      const currentAns = answers[currentQuestion.id]?.trim() || '';
      if (!currentAns) {
        setValidationError('This question is required before moving forward.');
        return;
      }
      if (currentQuestion.minLength && currentAns.length < currentQuestion.minLength) {
        setValidationError(
          `Please provide a more detailed response (minimum ${currentQuestion.minLength} characters, currently ${currentAns.length}).`
        );
        return;
      }
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step Navigation - Previous
  const handlePrevious = () => {
    setValidationError(null);
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Submission
  const handleFinalSubmit = () => {
    setValidationError(null);

    // Prevent duplicate submission
    if (isSubmitting || isAlreadySubmitted) return;

    // Validate ALL required questions across the activity
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.isRequired) {
        const val = answers[q.id]?.trim() || '';
        if (!val) {
          setCurrentStepIndex(i);
          setValidationError(
            `Question ${i + 1} ("${q.questionText.slice(0, 40)}...") is required before final submission.`
          );
          return;
        }
        if (q.minLength && val.length < q.minLength) {
          setCurrentStepIndex(i);
          setValidationError(
            `Question ${i + 1} requires at least ${q.minLength} characters (currently ${val.length}).`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitActivity(currentUser.id, activity.id, answers);
      setIsSubmitting(false);

      if (res.success && res.submission) {
        setSubmission(res.submission);
        setSubmittedResult(res.submission);
        setShowSuccessModal(true);

        // Fire celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore confetti fallback
        }
      } else {
        setValidationError(res.error || 'Failed to submit activity. Please check required fields.');
      }
    }, 600);
  };

  // Calculate completed questions count
  const answeredCount = questions.filter((q) => (answers[q.id]?.trim() || '').length > 0).length;
  const progressPct =
    questions.length > 0 ? Math.round(((currentStepIndex + 1) / questions.length) * 100) : 0;

  // Render input helper based on QuestionInputType
  const renderInputWidget = (question: Question) => {
    const value = answers[question.id] || '';

    switch (question.inputType) {
      case 'text':
        return (
          <div className="space-y-2">
            <input
              type="text"
              disabled={isAlreadySubmitted}
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder || 'Enter your concise response here...'}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl input-green-focus focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
            />
            {question.maxLength && (
              <div className="flex justify-end text-[11px] text-gray-400 font-mono">
                {value.length} / {question.maxLength} chars
              </div>
            )}
          </div>
        );

      case 'video_url':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Video className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                disabled={isAlreadySubmitted}
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder || 'https://www.youtube.com/watch?v=... or https://loom.com/share/...'}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-xl input-green-focus focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 font-mono text-xs"
              />
            </div>

            {/* Video Preview Card if URL is provided */}
            {value.trim() && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Video Deliverable Preview</span>
                  </span>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 underline"
                  >
                    <span>Test Video Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-gray-500 mb-2 truncate">
                  Provided URL: <code className="text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">{value}</code>
                </p>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Make sure permissions are set to "Public" or "Anyone with the link can view".</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'website_url':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Globe className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                disabled={isAlreadySubmitted}
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder || 'https://www.figma.com/file/... or https://docs.google.com/...'}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-xl input-green-focus focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 font-mono text-xs"
              />
            </div>

            {/* Live website link validator */}
            {value.trim() && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Target Deliverable URL</p>
                  <p className="text-xs text-gray-500 truncate max-w-sm font-mono mt-0.5">
                    {value}
                  </p>
                </div>
                <a
                  href={value.startsWith('http') ? value : `https://${value}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-emerald-700 hover:bg-gray-50 shadow-2xs flex items-center gap-1"
                >
                  <span>Open Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        );

      case 'textarea':
      default:
        return (
          <div className="space-y-2">
            <textarea
              rows={7}
              disabled={isAlreadySubmitted}
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder || 'Provide your detailed analysis and entrepreneurial findings here...'}
              className="w-full p-4 text-sm bg-white border border-gray-300 rounded-xl input-green-focus focus:outline-none transition-all leading-relaxed disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>
                {question.minLength ? `Min: ${question.minLength} chars` : 'Comprehensive answer expected'}
              </span>
              <span>
                {value.length} {question.maxLength ? `/ ${question.maxLength}` : ''} characters
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Top Back Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span>{course?.code || 'Course'}</span>
              <span>/</span>
              <span>{course?.courseName || 'Curriculum Track'}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {activity.activityTitle}
            </h1>
          </div>
        </div>

        {/* Status Pill & Auto-Save */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-[11px] text-gray-400 italic hidden sm:block">
            {autoSaveStatus}
          </span>
          {isAlreadySubmitted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{submission?.submissionStatus === 'reviewed' ? 'Graded' : 'Submitted'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Instructions & Suggestions Callout Box (Reference design requirement) */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-emerald-950">
              Activity Instructions &amp; Objectives
            </h3>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              {activity.instructions}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-emerald-800 font-medium">
              {activity.points && (
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Total Score: {activity.points} Points
                </span>
              )}
              {activity.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Due: {new Date(activity.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Already Submitted Warning Banner (Read-only notice) */}
      {isAlreadySubmitted && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>
              This activity was submitted on{' '}
              <strong>
                {submission?.submittedDate
                  ? new Date(submission.submittedDate).toLocaleString()
                  : 'recent date'}
              </strong>
              . Answers are preserved in read-only mode.
            </span>
          </div>
          {submission?.score !== undefined && (
            <span className="font-extrabold text-blue-800 bg-blue-100 px-2 py-1 rounded">
              Score: {submission.score} / 100
            </span>
          )}
        </div>
      )}

      {/* Question Stepper Indicator (Step 2 of 5) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              Question {currentStepIndex + 1} of {questions.length}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700">
              {answeredCount} of {questions.length} Answered
            </span>
          </div>
          <span className="font-mono text-gray-500 font-bold">{progressPct}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step Navigation Dots / Pills */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
          {questions.map((q, idx) => {
            const hasAns = (answers[q.id]?.trim() || '').length > 0;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setValidationError(null);
                  setCurrentStepIndex(idx);
                }}
                className={`h-7 px-3 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : hasAns
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span>Q{idx + 1}</span>
                {hasAns && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card - Centered Reference Architecture */}
      {currentQuestion ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Title & Requirement Tag */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                Prompt {currentStepIndex + 1}
              </span>
              {currentQuestion.isRequired ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  * Required
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                  Optional
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {currentQuestion.questionText}
            </h2>

            {/* Practical Suggestion / Hint Box */}
            {currentQuestion.suggestions && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Faculty Suggestion: </span>
                  <span className="text-amber-950/80">{currentQuestion.suggestions}</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Input Widget (Textarea, URL, Video, etc.) */}
          <div className="pt-2">
            {renderInputWidget(currentQuestion)}
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Navigation & Action Buttons Bar */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Previous Button & Save Draft */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all flex items-center justify-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {!isAlreadySubmitted && (
                <button
                  type="button"
                  onClick={handleManualSaveDraft}
                  disabled={isSavingDraft}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-gray-500" />
                  <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                </button>
              )}
            </div>

            {/* Right: Next or Submit Primary Red Button */}
            <div className="w-full sm:w-auto">
              {isLastStep ? (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || isAlreadySubmitted}
                  className="w-full sm:w-auto btn-primary-red px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Submitting...'
                      : isAlreadySubmitted
                      ? 'Already Submitted'
                      : 'Complete & Submit Activity'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto btn-primary-red px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
          No questions defined for this activity.
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Submission Successful!
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your responses, video evidence, and project deliverables for{' '}
                <strong>"{activity.activityTitle}"</strong> have been securely recorded and queued
                for faculty review.
              </p>
            </div>

            {/* Submission Info Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Submission ID:</span>
                <span className="font-bold text-gray-900">{submittedResult?.id || 'sub_success'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted By:</span>
                <span className="font-bold text-gray-900">{currentUser.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp:</span>
                <span className="text-gray-700">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Answered:</span>
                <span className="font-bold text-emerald-700">{questions.length} Questions</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                  if (onSubmissionComplete) onSubmissionComplete();
                }}
                className="w-full btn-primary-red py-2.5 rounded-xl text-xs font-bold shadow-sm"
              >
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Review My Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
