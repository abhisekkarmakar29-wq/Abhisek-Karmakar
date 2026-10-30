import {
  User,
  Course,
  Activity,
  Question,
  Submission,
  Answer,
  PortalNotification,
  SubmissionWithDetails,
  UserRole
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_ACTIVITIES,
  INITIAL_QUESTIONS,
  INITIAL_SUBMISSIONS,
  INITIAL_ANSWERS,
  INITIAL_NOTIFICATIONS
} from './mockData';

const KEYS = {
  USERS: 'wadhwani_portal_users_v1',
  CURRENT_USER: 'wadhwani_portal_current_user_v1',
  COURSES: 'wadhwani_portal_courses_v1',
  ACTIVITIES: 'wadhwani_portal_activities_v1',
  QUESTIONS: 'wadhwani_portal_questions_v1',
  SUBMISSIONS: 'wadhwani_portal_submissions_v1',
  ANSWERS: 'wadhwani_portal_answers_v1',
  NOTIFICATIONS: 'wadhwani_portal_notifications_v1',
  DB_CONFIG: 'wadhwani_portal_db_config_v1'
};

// Event emitter for store changes
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToStore = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in store listener', e);
    }
  });
};

// Helper to get or initialize localStorage
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to parse storage key ${key}, falling back to defaults`, e);
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    notifyListeners();
  } catch (e) {
    console.error(`Failed to store key ${key}`, e);
  }
}

// Initialize seed data if not present
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    // Default logged in as Student Aarav Patel for frictionless immediate demo exploration
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
  if (!localStorage.getItem(KEYS.COURSES)) {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
  }
  if (!localStorage.getItem(KEYS.QUESTIONS)) {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  }
  if (!localStorage.getItem(KEYS.ANSWERS)) {
    localStorage.setItem(KEYS.ANSWERS, JSON.stringify(INITIAL_ANSWERS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

// ====================== AUTH OPERATIONS ======================
export const getCurrentUser = (): User | null => {
  return getStored<User | null>(KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: User | null): void => {
  setStored(KEYS.CURRENT_USER, user);
};

export const getUsers = (): User[] => {
  return getStored<User[]>(KEYS.USERS, INITIAL_USERS);
};

export const login = (email: string, passwordHash: string): { success: boolean; user?: User; error?: string } => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return { success: false, error: 'No user registered with this email address.' };
  }

  if (user.passwordHash && user.passwordHash !== passwordHash) {
    return { success: false, error: 'Incorrect password entered.' };
  }

  setCurrentUser(user);
  return { success: true, user };
};

export const register = (userData: Omit<User, 'id' | 'registrationDate'>): { success: boolean; user?: User; error?: string } => {
  const users = getUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const newUser: User = {
    ...userData,
    id: `usr_${Date.now()}`,
    registrationDate: new Date().toISOString(),
    studentId: userData.role === 'student' ? `WF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName)}`
  };

  const updatedUsers = [...users, newUser];
  setStored(KEYS.USERS, updatedUsers);
  setCurrentUser(newUser);

  // Add welcome notification
  addNotification({
    userId: newUser.id,
    title: 'Welcome to Wadhwani Entrepreneurship Portal!',
    message: 'Explore your enrolled foundation tracks, begin your problem validation activities, and build your venture.',
    type: 'success',
    linkAction: 'activities'
  });

  return { success: true, user: newUser };
};

export const logout = (): void => {
  localStorage.removeItem(KEYS.CURRENT_USER);
  notifyListeners();
};

export const switchDemoRole = (role: UserRole): User => {
  const users = getUsers();
  const targetUser = users.find((u) => u.role === role) || (role === 'admin' ? INITIAL_USERS[3] : INITIAL_USERS[0]);
  setCurrentUser(targetUser);
  return targetUser;
};

export const updateUserProfile = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;
  setStored(KEYS.USERS, users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
};

// ====================== COURSE OPERATIONS ======================
export const getCourses = (): Course[] => {
  return getStored<Course[]>(KEYS.COURSES, INITIAL_COURSES);
};

export const getCourseById = (courseId: string): Course | undefined => {
  return getCourses().find((c) => c.id === courseId);
};

export const createCourse = (course: Omit<Course, 'id'>): Course => {
  const courses = getCourses();
  const newCourse: Course = {
    ...course,
    id: `crs_${Date.now()}`
  };
  setStored(KEYS.COURSES, [...courses, newCourse]);
  return newCourse;
};

export const updateCourse = (id: string, updates: Partial<Course>): Course | null => {
  const courses = getCourses();
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = { ...courses[index], ...updates };
  setStored(KEYS.COURSES, courses);
  return courses[index];
};

export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const filtered = courses.filter((c) => c.id !== id);
  setStored(KEYS.COURSES, filtered);
  return true;
};

// ====================== ACTIVITY OPERATIONS ======================
export const getActivities = (): Activity[] => {
  return getStored<Activity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
};

export const getActivityById = (activityId: string): Activity | undefined => {
  return getActivities().find((a) => a.id === activityId);
};

export const getActivitiesByCourse = (courseId: string): Activity[] => {
  return getActivities()
    .filter((a) => a.courseId === courseId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const createActivity = (
  activityData: Omit<Activity, 'id'>,
  questions: Omit<Question, 'id' | 'activityId'>[]
): Activity => {
  const activities = getActivities();
  const activityId = `act_${Date.now()}`;
  const newActivity: Activity = {
    ...activityData,
    id: activityId
  };

  const currentQuestions = getStored<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS);
  const newQuestions: Question[] = questions.map((q, idx) => ({
    ...q,
    id: `qst_${Date.now()}_${idx}`,
    activityId: activityId,
    displayOrder: q.displayOrder || idx + 1
  }));

  setStored(KEYS.ACTIVITIES, [...activities, newActivity]);
  setStored(KEYS.QUESTIONS, [...currentQuestions, ...newQuestions]);

  // Notify students of new activity
  const students = getUsers().filter((u) => u.role === 'student');
  students.forEach((std) => {
    addNotification({
      userId: std.id,
      title: 'New Activity Published',
      message: `"${newActivity.activityTitle}" has been added to your curriculum track.`,
      type: 'info',
      linkAction: `activity_${newActivity.id}`
    });
  });

  return newActivity;
};

export const updateActivity = (
  activityId: string,
  activityUpdates: Partial<Activity>,
  questionsUpdates?: Question[]
): Activity | null => {
  const activities = getActivities();
  const index = activities.findIndex((a) => a.id === activityId);
  if (index === -1) return null;

  activities[index] = { ...activities[index], ...activityUpdates };
  setStored(KEYS.ACTIVITIES, activities);

  if (questionsUpdates) {
    const allQuestions = getStored<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const withoutThisActivity = allQuestions.filter((q) => q.activityId !== activityId);
    setStored(KEYS.QUESTIONS, [...withoutThisActivity, ...questionsUpdates]);
  }

  return activities[index];
};

export const deleteActivity = (activityId: string): boolean => {
  const activities = getActivities().filter((a) => a.id !== activityId);
  setStored(KEYS.ACTIVITIES, activities);

  // Clean up questions
  const questions = getStored<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS).filter(
    (q) => q.activityId !== activityId
  );
  setStored(KEYS.QUESTIONS, questions);

  // Clean up submissions
  const submissions = getStored<Submission[]>(KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS).filter(
    (s) => s.activityId !== activityId
  );
  setStored(KEYS.SUBMISSIONS, submissions);

  return true;
};

// ====================== QUESTION OPERATIONS ======================
export const getQuestionsByActivity = (activityId: string): Question[] => {
  const questions = getStored<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS);
  return questions
    .filter((q) => q.activityId === activityId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

// ====================== SUBMISSION & ANSWER OPERATIONS ======================
export const getSubmissions = (): Submission[] => {
  return getStored<Submission[]>(KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
};

export const getAnswers = (): Answer[] => {
  return getStored<Answer[]>(KEYS.ANSWERS, INITIAL_ANSWERS);
};

export const getSubmission = (studentId: string, activityId: string): Submission | undefined => {
  return getSubmissions().find((s) => s.studentId === studentId && s.activityId === activityId);
};

export const getSubmissionWithAnswers = (
  studentId: string,
  activityId: string
): { submission?: Submission; answers: Record<string, string> } => {
  const submission = getSubmission(studentId, activityId);
  if (!submission) {
    return { answers: {} };
  }

  const allAnswers = getAnswers();
  const answersMap: Record<string, string> = {};
  allAnswers
    .filter((ans) => ans.submissionId === submission.id)
    .forEach((ans) => {
      answersMap[ans.questionId] = ans.answerTextOrUrl;
    });

  return { submission, answers: answersMap };
};

export const saveDraft = (
  studentId: string,
  activityId: string,
  answersRecord: Record<string, string>,
  currentStep: number = 1
): Submission => {
  const submissions = getSubmissions();
  let allAnswers = getAnswers();
  const existingSubIndex = submissions.findIndex(
    (s) => s.studentId === studentId && s.activityId === activityId
  );

  let targetSubmissionId: string;
  const now = new Date().toISOString();

  if (existingSubIndex >= 0) {
    targetSubmissionId = submissions[existingSubIndex].id;
    submissions[existingSubIndex] = {
      ...submissions[existingSubIndex],
      lastUpdated: now,
      currentStep: currentStep
    };
  } else {
    targetSubmissionId = `sub_${Date.now()}`;
    const newSub: Submission = {
      id: targetSubmissionId,
      studentId,
      activityId,
      submissionStatus: 'draft',
      lastUpdated: now,
      currentStep: currentStep
    };
    submissions.push(newSub);
  }

  setStored(KEYS.SUBMISSIONS, submissions);

  // Update or insert answers
  // Remove existing answers for this submission to avoid duplicates
  allAnswers = allAnswers.filter((a) => a.submissionId !== targetSubmissionId);

  Object.entries(answersRecord).forEach(([questionId, text]) => {
    if (text !== undefined && text !== null) {
      allAnswers.push({
        id: `ans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        submissionId: targetSubmissionId,
        questionId,
        answerTextOrUrl: text,
        updatedAt: now
      });
    }
  });

  setStored(KEYS.ANSWERS, allAnswers);
  return submissions.find((s) => s.id === targetSubmissionId)!;
};

export const submitActivity = (
  studentId: string,
  activityId: string,
  answersRecord: Record<string, string>
): { success: boolean; submission?: Submission; error?: string } => {
  const questions = getQuestionsByActivity(activityId);

  // Validate required questions
  for (const q of questions) {
    if (q.isRequired) {
      const val = answersRecord[q.id]?.trim() || '';
      if (!val) {
        return {
          success: false,
          error: `Question "${q.questionText.substring(0, 50)}..." is required and cannot be empty.`
        };
      }
    }
  }

  const submissions = getSubmissions();
  let allAnswers = getAnswers();
  const existingSubIndex = submissions.findIndex(
    (s) => s.studentId === studentId && s.activityId === activityId
  );

  const now = new Date().toISOString();
  let targetSubmissionId: string;

  if (existingSubIndex >= 0) {
    targetSubmissionId = submissions[existingSubIndex].id;
    submissions[existingSubIndex] = {
      ...submissions[existingSubIndex],
      submissionStatus: 'submitted',
      submittedDate: now,
      lastUpdated: now
    };
  } else {
    targetSubmissionId = `sub_${Date.now()}`;
    const newSub: Submission = {
      id: targetSubmissionId,
      studentId,
      activityId,
      submissionStatus: 'submitted',
      submittedDate: now,
      lastUpdated: now
    };
    submissions.push(newSub);
  }

  setStored(KEYS.SUBMISSIONS, submissions);

  // Save final answers
  allAnswers = allAnswers.filter((a) => a.submissionId !== targetSubmissionId);
  Object.entries(answersRecord).forEach(([questionId, text]) => {
    if (text !== undefined && text !== null) {
      allAnswers.push({
        id: `ans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        submissionId: targetSubmissionId,
        questionId,
        answerTextOrUrl: text,
        updatedAt: now
      });
    }
  });
  setStored(KEYS.ANSWERS, allAnswers);

  // Notify student of success
  const activity = getActivityById(activityId);
  addNotification({
    userId: studentId,
    title: 'Activity Submitted Successfully!',
    message: `Your submission for "${activity?.activityTitle || 'Activity'}" has been queued for faculty review.`,
    type: 'success',
    linkAction: 'dashboard'
  });

  // Notify instructors
  const instructors = getUsers().filter((u) => u.role === 'admin');
  const student = getUsers().find((u) => u.id === studentId);
  instructors.forEach((admin) => {
    addNotification({
      userId: admin.id,
      title: 'New Student Assignment Submitted',
      message: `${student?.fullName || 'A student'} submitted answers for "${activity?.activityTitle || 'Activity'}".`,
      type: 'info',
      linkAction: 'admin_submissions'
    });
  });

  return { success: true, submission: submissions.find((s) => s.id === targetSubmissionId) };
};

export const gradeSubmission = (
  submissionId: string,
  score: number,
  feedback: string,
  reviewerId: string
): Submission | null => {
  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === submissionId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  submissions[index] = {
    ...submissions[index],
    submissionStatus: 'reviewed',
    score,
    feedback,
    reviewerId,
    reviewedDate: now,
    lastUpdated: now
  };

  setStored(KEYS.SUBMISSIONS, submissions);

  // Notify student
  const sub = submissions[index];
  const activity = getActivityById(sub.activityId);
  addNotification({
    userId: sub.studentId,
    title: 'Assignment Graded & Feedback Provided',
    message: `Your submission for "${activity?.activityTitle || 'Activity'}" received ${score}/100 points. Check instructor comments.`,
    type: 'success',
    linkAction: 'dashboard'
  });

  return submissions[index];
};

export const getAllSubmissionsWithDetails = (): SubmissionWithDetails[] => {
  const submissions = getSubmissions();
  const users = getUsers();
  const activities = getActivities();
  const courses = getCourses();
  const answers = getAnswers();

  return submissions.map((sub) => {
    const student = users.find((u) => u.id === sub.studentId);
    const activity = activities.find((a) => a.id === sub.activityId);
    const course = activity ? courses.find((c) => c.id === activity.courseId) : undefined;

    const answersRecord: Record<string, string> = {};
    answers
      .filter((a) => a.submissionId === sub.id)
      .forEach((a) => {
        answersRecord[a.questionId] = a.answerTextOrUrl;
      });

    return {
      ...sub,
      studentName: student?.fullName || 'Unknown Student',
      studentEmail: student?.email || 'N/A',
      studentInstitution: student?.institution,
      studentVenture: student?.ventureName,
      activityTitle: activity?.activityTitle || 'Untitled Activity',
      courseName: course?.courseName || 'Unassigned Course',
      courseCode: course?.code || 'N/A',
      answers: answersRecord
    };
  });
};

// ====================== CSV EXPORT ======================
export const exportSubmissionsCSV = (): string => {
  const detailed = getAllSubmissionsWithDetails();
  const allQuestions = getStored<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS);

  const headers = [
    'Submission ID',
    'Student Name',
    'Student Email',
    'Student ID',
    'Venture Name',
    'Course Code',
    'Course Name',
    'Activity Title',
    'Status',
    'Score',
    'Submitted Date',
    'Instructor Feedback',
    'Question Responses'
  ];

  const rows = detailed.map((sub) => {
    const questionAnswers = Object.entries(sub.answers)
      .map(([qId, answer]) => {
        const q = allQuestions.find((item) => item.id === qId);
        const qText = q ? q.questionText.replace(/"/g, '""') : qId;
        const ansClean = (answer || '').replace(/"/g, '""');
        return `[Q: ${qText}] => [A: ${ansClean}]`;
      })
      .join(' | ');

    return [
      `"${sub.id}"`,
      `"${sub.studentName.replace(/"/g, '""')}"`,
      `"${sub.studentEmail.replace(/"/g, '""')}"`,
      `"${sub.studentId || ''}"`,
      `"${(sub.studentVenture || '').replace(/"/g, '""')}"`,
      `"${sub.courseCode}"`,
      `"${sub.courseName.replace(/"/g, '""')}"`,
      `"${sub.activityTitle.replace(/"/g, '""')}"`,
      `"${sub.submissionStatus}"`,
      `"${sub.score !== undefined ? sub.score : ''}"`,
      `"${sub.submittedDate || ''}"`,
      `"${(sub.feedback || '').replace(/"/g, '""')}"`,
      `"${questionAnswers}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

// ====================== NOTIFICATIONS ======================
export const getNotifications = (userId: string): PortalNotification[] => {
  const notifs = getStored<PortalNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  return notifs
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addNotification = (
  notif: Omit<PortalNotification, 'id' | 'timestamp' | 'isRead'>
): PortalNotification => {
  const notifs = getStored<PortalNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  const newNotif: PortalNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  setStored(KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
  return newNotif;
};

export const markNotificationRead = (id: string): void => {
  const notifs = getStored<PortalNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  setStored(KEYS.NOTIFICATIONS, updated);
};

export const markAllNotificationsRead = (userId: string): void => {
  const notifs = getStored<PortalNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  const updated = notifs.map((n) => (n.userId === userId ? { ...n, isRead: true } : n));
  setStored(KEYS.NOTIFICATIONS, updated);
};

// ====================== DATABASE STATE MANAGEMENT ======================
export const resetToDefaultData = (): void => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
  localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  localStorage.setItem(KEYS.ANSWERS, JSON.stringify(INITIAL_ANSWERS));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  notifyListeners();
};

export const exportFullDatabaseJSON = (): string => {
  return JSON.stringify(
    {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tables: {
        users: getUsers(),
        courses: getCourses(),
        activities: getActivities(),
        questions: getStored<Question[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS),
        submissions: getSubmissions(),
        answers: getAnswers(),
        notifications: getStored<PortalNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
      }
    },
    null,
    2
  );
};

export const importDatabaseJSON = (jsonStr: string): { success: boolean; error?: string } => {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.tables) {
      return { success: false, error: 'Invalid database backup JSON format. Missing "tables" object.' };
    }
    if (data.tables.users) setStored(KEYS.USERS, data.tables.users);
    if (data.tables.courses) setStored(KEYS.COURSES, data.tables.courses);
    if (data.tables.activities) setStored(KEYS.ACTIVITIES, data.tables.activities);
    if (data.tables.questions) setStored(KEYS.QUESTIONS, data.tables.questions);
    if (data.tables.submissions) setStored(KEYS.SUBMISSIONS, data.tables.submissions);
    if (data.tables.answers) setStored(KEYS.ANSWERS, data.tables.answers);
    if (data.tables.notifications) setStored(KEYS.NOTIFICATIONS, data.tables.notifications);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'JSON parse failure' };
  }
};
