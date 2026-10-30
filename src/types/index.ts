export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  registrationDate: string;
  avatarUrl?: string;
  studentId?: string;
  institution?: string;
  cohort?: string;
  bio?: string;
  ventureName?: string;
  ventureIndustry?: string;
}

export type CourseStatus = 'active' | 'archived' | 'upcoming';

export interface Course {
  id: string;
  courseName: string;
  description: string;
  status: CourseStatus;
  code: string;
  category?: string;
  enrolledCount?: number;
  totalActivities?: number;
  durationWeeks?: number;
  badge?: string;
}

export interface Activity {
  id: string;
  courseId: string;
  activityTitle: string;
  instructions: string;
  description: string;
  displayOrder: number;
  deadline?: string;
  points?: number;
  tags?: string[];
  estimatedMinutes?: number;
}

export type QuestionInputType = 'textarea' | 'text' | 'video_url' | 'website_url';

export interface Question {
  id: string;
  activityId: string;
  questionText: string;
  inputType: QuestionInputType;
  isRequired: boolean;
  displayOrder: number;
  suggestions?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export type SubmissionStatus = 'draft' | 'submitted' | 'reviewed';

export interface Submission {
  id: string;
  studentId: string;
  activityId: string;
  submissionStatus: SubmissionStatus;
  submittedDate?: string;
  lastUpdated: string;
  currentStep?: number;
  score?: number;
  feedback?: string;
  reviewerId?: string;
  reviewedDate?: string;
}

export interface Answer {
  id: string;
  submissionId: string;
  questionId: string;
  answerTextOrUrl: string;
  updatedAt: string;
}

export interface ActivityWithCourse extends Activity {
  courseName: string;
  courseCode: string;
}

export interface SubmissionWithDetails extends Submission {
  studentName: string;
  studentEmail: string;
  studentInstitution?: string;
  studentVenture?: string;
  activityTitle: string;
  courseName: string;
  courseCode: string;
  answers: Record<string, string>; // questionId -> answer
}

export interface PortalNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
}
