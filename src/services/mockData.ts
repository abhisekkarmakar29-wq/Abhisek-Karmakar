import { User, Course, Activity, Question, Submission, Answer, PortalNotification } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_student_1',
    fullName: 'Aarav Patel',
    email: 'student@wadhwani.edu',
    passwordHash: 'student123',
    role: 'student',
    registrationDate: '2026-09-01T10:00:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentId: 'WF-2026-8941',
    institution: 'National Institute of Technology, Innovation Cell',
    cohort: 'Fall 2026 - Cohort Delta',
    bio: 'Aspiring deep-tech founder passionate about affordable AI-driven agricultural sensors for smallholder farmers.',
    ventureName: 'AgroSense Dynamics',
    ventureIndustry: 'AgriTech & IoT'
  },
  {
    id: 'usr_student_2',
    fullName: 'Priya Sharma',
    email: 'priya.s@university.edu',
    passwordHash: 'student123',
    role: 'student',
    registrationDate: '2026-09-05T14:30:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    studentId: 'WF-2026-8942',
    institution: 'BITS Pilani Entrepreneurship Hub',
    cohort: 'Fall 2026 - Cohort Delta',
    bio: 'Bio-medical engineering graduate working on non-invasive glucometer wearables.',
    ventureName: 'GlucoGuard Health',
    ventureIndustry: 'HealthTech'
  },
  {
    id: 'usr_student_3',
    fullName: 'Carlos Mendoza',
    email: 'carlos.m@techhub.org',
    passwordHash: 'student123',
    role: 'student',
    registrationDate: '2026-09-10T09:15:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentId: 'WF-2026-8943',
    institution: 'Global Entrepreneurship Academy',
    cohort: 'Fall 2026 - Cohort Delta',
    bio: 'FinTech developer building low-fee micropayment infrastructure for indie digital creators.',
    ventureName: 'MicroFlow Payments',
    ventureIndustry: 'FinTech'
  },
  {
    id: 'usr_admin_1',
    fullName: 'Dr. Rajesh Mehta',
    email: 'admin@wadhwani.edu',
    passwordHash: 'admin123',
    role: 'admin',
    registrationDate: '2025-01-15T08:00:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    institution: 'Wadhwani Foundation & Venture Accelerator',
    cohort: 'Global Faculty Directorate',
    bio: 'Senior Venture Coach, angel investor, and entrepreneurship educator with 18+ years of startup incubation experience.'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_v101',
    courseName: 'Venture Ideation & Problem Discovery',
    code: 'V101',
    description: 'Master the art of uncovering acute customer pain points, testing problem-solution fit, and formulating clear value propositions.',
    status: 'active',
    category: 'Foundation',
    enrolledCount: 148,
    totalActivities: 4,
    durationWeeks: 4,
    badge: 'Core Track'
  },
  {
    id: 'crs_v102',
    courseName: 'Customer Validation & Lean Canvas Architecture',
    code: 'V102',
    description: 'Conduct real customer discovery interviews, build your 1-page business model canvas, and map high-risk hypotheses.',
    status: 'active',
    category: 'Validation',
    enrolledCount: 112,
    totalActivities: 5,
    durationWeeks: 6,
    badge: 'Core Track'
  },
  {
    id: 'crs_v103',
    courseName: 'Prototyping & Minimum Viable Product (MVP)',
    code: 'V103',
    description: 'Transform concepts into clickable prototypes and no-code MVPs to gather quantifiable pre-launch traction metrics.',
    status: 'active',
    category: 'Product Execution',
    enrolledCount: 89,
    totalActivities: 4,
    durationWeeks: 6,
    badge: 'Advanced'
  },
  {
    id: 'crs_v104',
    courseName: 'Financial Modeling & Pitch Deck Readiness',
    code: 'V104',
    description: 'Craft investor-grade financial projections, unit economics models, and a compelling 10-slide startup pitch deck.',
    status: 'upcoming',
    category: 'Funding & Growth',
    enrolledCount: 64,
    totalActivities: 3,
    durationWeeks: 4,
    badge: 'Showcase'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_1_1',
    courseId: 'crs_v101',
    activityTitle: 'Activity 1.1: Problem Identification & Market Need Validation',
    description: 'Formulate a crisp problem statement based on observable inefficiencies and market friction.',
    instructions: 'Please answer all questions thoughtfully. Anchor your observations in direct customer interactions rather than speculative assumptions. Focus on who experiences the pain, how acute it is, and existing broken workarounds.',
    displayOrder: 1,
    deadline: '2026-11-15T23:59:59.000Z',
    points: 100,
    tags: ['Problem Statement', 'Market Validation', 'Ideation'],
    estimatedMinutes: 45
  },
  {
    id: 'act_1_2',
    courseId: 'crs_v101',
    activityTitle: 'Activity 1.2: Customer Persona & Pain Point Identification',
    description: 'Define your early adopter customer persona, their daily jobs-to-be-done, and deliver video evidence of customer empathy.',
    instructions: 'A great startup begins with deep customer empathy. Detail your target segment, their explicit frustrations, and provide links to your primary interview recording and customer journey map.',
    displayOrder: 2,
    deadline: '2026-11-20T23:59:59.000Z',
    points: 150,
    tags: ['Customer Persona', 'Video Pitch', 'Empathy Mapping'],
    estimatedMinutes: 60
  },
  {
    id: 'act_2_1',
    courseId: 'crs_v102',
    activityTitle: 'Activity 2.1: Lean Business Model Canvas Architecture',
    description: 'Complete all 9 blocks of the Ash Maurya Lean Canvas, highlighting your unfair advantage and channels.',
    instructions: 'The Lean Canvas is your venture blueprint on a single page. Be concise and precise. Submit your live digital canvas URL alongside explanations of your revenue logic and channels.',
    displayOrder: 1,
    deadline: '2026-11-28T23:59:59.000Z',
    points: 200,
    tags: ['Lean Canvas', 'Business Model', 'Unit Economics'],
    estimatedMinutes: 75
  },
  {
    id: 'act_3_1',
    courseId: 'crs_v103',
    activityTitle: 'Activity 3.1: MVP Feature Scope & Prototype Walkthrough',
    description: 'Demonstrate your Minimum Viable Product with a functional demo video and accessible project URL.',
    instructions: 'Your MVP should be the smallest set of features required to deliver core customer value. Submit a working demo link and a short screencast video explaining user flow.',
    displayOrder: 1,
    deadline: '2026-12-05T23:59:59.000Z',
    points: 250,
    tags: ['MVP', 'Video Demo', 'Product Testing'],
    estimatedMinutes: 90
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Activity 1.1 Questions
  {
    id: 'qst_1_1_1',
    activityId: 'act_1_1',
    questionText: 'What is the specific problem or market inefficiency your venture aims to solve?',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 1,
    suggestions: 'Avoid describing your solution here. State the root problem in terms of cost, time wasted, complexity, or health/safety impact.',
    placeholder: 'State the specific, observable problem experienced by your target audience...',
    minLength: 40,
    maxLength: 1000
  },
  {
    id: 'qst_1_1_2',
    activityId: 'act_1_1',
    questionText: 'How do customers currently solve or cope with this problem today (existing alternatives)?',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 2,
    suggestions: 'Every problem has existing workarounds—even if it is Excel spreadsheets, WhatsApp groups, or doing nothing. List at least 2 alternatives.',
    placeholder: 'Describe existing workarounds, competitors, or manual coping mechanisms...',
    minLength: 30,
    maxLength: 800
  },
  {
    id: 'qst_1_1_3',
    activityId: 'act_1_1',
    questionText: 'Provide a link to any secondary research, industry report, or data supporting the market problem size.',
    inputType: 'website_url',
    isRequired: false,
    displayOrder: 3,
    suggestions: 'Optional: Include links to verified industry data (Statista, McKinsey, Govt census, or academic research).',
    placeholder: 'https://example.com/industry-market-research'
  },

  // Activity 1.2 Questions (Customer Persona & Pain Points)
  {
    id: 'qst_1_2_1',
    activityId: 'act_1_2',
    questionText: 'Describe your Primary Target Customer Persona in detail (demographics, habits, daily frustrations, and job-to-be-done).',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 1,
    suggestions: 'Be specific: e.g. "Ramesh, 42-year-old onion farmer in Nashik managing 4 acres with irregular groundwater access."',
    placeholder: 'Profile your ideal early adopter persona: name, role, context, daily workflow, and acute stress points...',
    minLength: 50,
    maxLength: 1200
  },
  {
    id: 'qst_1_2_2',
    activityId: 'act_1_2',
    questionText: 'List the top 3 validated pain points your persona experiences, ranked by severity.',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 2,
    suggestions: 'Rank from #1 (most critical "hair-on-fire" problem) to #3. Explain why each pain point hurts their productivity or bottom line.',
    placeholder: '1. [Critical Pain Point] - Impact...\n2. [Secondary Pain Point] - Impact...\n3. [Tertiary Pain Point] - Impact...',
    minLength: 40,
    maxLength: 1000
  },
  {
    id: 'qst_1_2_3',
    activityId: 'act_1_2',
    questionText: 'Submit a 2-minute video recording or snippet of your customer interview or founder pitch.',
    inputType: 'video_url',
    isRequired: true,
    displayOrder: 3,
    suggestions: 'Upload a video to YouTube (Unlisted), Loom, Vimeo, or Google Drive (public link). Ensure audio is clear.',
    placeholder: 'https://www.youtube.com/watch?v=... or https://www.loom.com/share/...'
  },
  {
    id: 'qst_1_2_4',
    activityId: 'act_1_2',
    questionText: 'Provide a link to your digital Customer Journey Map, Miro board, or Figma presentation.',
    inputType: 'website_url',
    isRequired: false,
    displayOrder: 4,
    suggestions: 'Paste a link to your Figma, Miro, Google Slides, or Canva board illustrating the customer workflow.',
    placeholder: 'https://www.figma.com/file/... or https://miro.com/app/board/...'
  },

  // Activity 2.1 Questions (Lean Canvas Architecture)
  {
    id: 'qst_2_1_1',
    activityId: 'act_2_1',
    questionText: 'State your Unique Value Proposition (UVP) in 25 words or less.',
    inputType: 'text',
    isRequired: true,
    displayOrder: 1,
    suggestions: 'Formula: We help [Target Audience] achieve [Desired Outcome] without [Common Frustration].',
    placeholder: 'e.g., We help smallholder farmers predict soil moisture 48 hours ahead without expensive lab tests.',
    maxLength: 200
  },
  {
    id: 'qst_2_1_2',
    activityId: 'act_2_1',
    questionText: 'Explain your Revenue Streams, Pricing Model, and expected Unit Economics.',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 2,
    suggestions: 'Will you charge via subscription (SaaS), one-off hardware fee, marketplace commission, or freemium?',
    placeholder: 'Detail how money enters the business, estimated customer lifetime value (LTV), and pricing tiers...',
    minLength: 40,
    maxLength: 1000
  },
  {
    id: 'qst_2_1_3',
    activityId: 'act_2_1',
    questionText: 'Submit the link to your complete digital Lean Canvas document (Google Docs, Notion, or LeanStack).',
    inputType: 'website_url',
    isRequired: true,
    displayOrder: 3,
    suggestions: 'Provide view access to your 1-page canvas covering all 9 boxes.',
    placeholder: 'https://docs.google.com/document/d/...'
  },
  {
    id: 'qst_2_1_4',
    activityId: 'act_2_1',
    questionText: 'What is your Unfair Advantage (Moat) that cannot be easily copied or bought by incumbent competitors?',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 4,
    suggestions: 'Think proprietary data, network effects, personal authority, exclusivity agreements, or patented algorithms.',
    placeholder: 'Detail your defensible advantage in the market...',
    minLength: 30,
    maxLength: 800
  },

  // Activity 3.1 Questions (MVP Demo)
  {
    id: 'qst_3_1_1',
    activityId: 'act_3_1',
    questionText: 'Describe the core 3 features implemented in your Minimum Viable Product (MVP).',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 1,
    suggestions: 'Highlight strictly what was built to test core hypotheses, excluding non-essential bells and whistles.',
    placeholder: 'Feature 1: ...\nFeature 2: ...\nFeature 3: ...',
    minLength: 50,
    maxLength: 1200
  },
  {
    id: 'qst_3_1_2',
    activityId: 'act_3_1',
    questionText: 'Submit a Loom or YouTube video link demonstrating a live walkthrough of your prototype.',
    inputType: 'video_url',
    isRequired: true,
    displayOrder: 2,
    suggestions: 'Walk through the core user journey from initial signup/action to value delivery in under 3 minutes.',
    placeholder: 'https://www.youtube.com/watch?v=... or https://www.loom.com/share/...'
  },
  {
    id: 'qst_3_1_3',
    activityId: 'act_3_1',
    questionText: 'Provide the live URL where evaluators and users can interact with your deployed prototype or landing page.',
    inputType: 'website_url',
    isRequired: true,
    displayOrder: 3,
    suggestions: 'Ensure the link is publicly accessible (Vercel, Netlify, Bubble, Webflow, or GitHub Pages).',
    placeholder: 'https://my-startup-mvp.vercel.app'
  },
  {
    id: 'qst_3_1_4',
    activityId: 'act_3_1',
    questionText: 'Summarize early user testing feedback from at least 5 target individuals. What surprised you?',
    inputType: 'textarea',
    isRequired: true,
    displayOrder: 4,
    suggestions: 'Quote direct user feedback. Note what worked seamlessly and what friction points were identified.',
    placeholder: 'Detail testing methodology, tester profiles, and key pivot recommendations...',
    minLength: 40,
    maxLength: 1000
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    studentId: 'usr_student_1',
    activityId: 'act_1_1',
    submissionStatus: 'reviewed',
    submittedDate: '2026-10-18T16:20:00.000Z',
    lastUpdated: '2026-10-20T11:00:00.000Z',
    currentStep: 3,
    score: 95,
    feedback: 'Outstanding problem formulation, Aarav. Your direct field interviews with Nashik onion farmers gave your problem statement authentic authority. Focus now on narrowing down initial sensor installation costs.',
    reviewerId: 'usr_admin_1',
    reviewedDate: '2026-10-20T11:00:00.000Z'
  },
  {
    id: 'sub_2',
    studentId: 'usr_student_1',
    activityId: 'act_1_2',
    submissionStatus: 'submitted',
    submittedDate: '2026-10-28T09:45:00.000Z',
    lastUpdated: '2026-10-28T09:45:00.000Z',
    currentStep: 4
  },
  {
    id: 'sub_3',
    studentId: 'usr_student_2',
    activityId: 'act_1_1',
    submissionStatus: 'reviewed',
    submittedDate: '2026-10-17T14:10:00.000Z',
    lastUpdated: '2026-10-19T10:15:00.000Z',
    currentStep: 3,
    score: 92,
    feedback: 'Rigorous understanding of non-invasive glucose monitoring challenges. Be cautious regarding regulatory hurdles (FDA/CDSCO) as you move toward MVP.',
    reviewerId: 'usr_admin_1',
    reviewedDate: '2026-10-19T10:15:00.000Z'
  },
  {
    id: 'sub_4',
    studentId: 'usr_student_2',
    activityId: 'act_1_2',
    submissionStatus: 'reviewed',
    submittedDate: '2026-10-25T11:30:00.000Z',
    lastUpdated: '2026-10-27T15:20:00.000Z',
    currentStep: 4,
    score: 98,
    feedback: 'The patient persona and pain ranking was among the best in Cohort Delta. The Figma journey map clearly illustrates the daily friction of finger-prick testing.',
    reviewerId: 'usr_admin_1',
    reviewedDate: '2026-10-27T15:20:00.000Z'
  },
  {
    id: 'sub_5',
    studentId: 'usr_student_3',
    activityId: 'act_1_1',
    submissionStatus: 'submitted',
    submittedDate: '2026-10-29T18:00:00.000Z',
    lastUpdated: '2026-10-29T18:00:00.000Z',
    currentStep: 3
  }
];

export const INITIAL_ANSWERS: Answer[] = [
  // Sub 1 Answers (Aarav - Act 1.1)
  {
    id: 'ans_1_1',
    submissionId: 'sub_1',
    questionId: 'qst_1_1_1',
    answerTextOrUrl: 'Smallholder horticultural farmers in semi-arid regions lose between 28% and 35% of their crop yield annually due to over-irrigation or late detection of root rot, causing an average financial loss of $1,400 per acre per season.',
    updatedAt: '2026-10-18T16:10:00.000Z'
  },
  {
    id: 'ans_1_2',
    submissionId: 'sub_1',
    questionId: 'qst_1_1_2',
    answerTextOrUrl: 'Currently, farmers rely on tactile soil digging (judging moisture by hand texture) and rigid fixed-schedule electricity pumping routines. High-end soil moisture sensors from industrial conglomerates cost upwards of $600 per unit, which is financially out of reach.',
    updatedAt: '2026-10-18T16:15:00.000Z'
  },
  {
    id: 'ans_1_3',
    submissionId: 'sub_1',
    questionId: 'qst_1_1_3',
    answerTextOrUrl: 'https://www.fao.org/land-water/databases-and-software/cropwat/en/',
    updatedAt: '2026-10-18T16:18:00.000Z'
  },

  // Sub 2 Answers (Aarav - Act 1.2)
  {
    id: 'ans_2_1',
    submissionId: 'sub_2',
    questionId: 'qst_1_2_1',
    answerTextOrUrl: 'Persona: Ramesh Kulkarni, 44-year-old independent onion & pomegranate farmer in Nashik. Manages 4.5 acres. Uses an Android smartphone primarily for WhatsApp and YouTube farming tutorials. Frustrated by erratic power supply, unpredictable weather swings, and the fear of fungal blight killing his seedlings.',
    updatedAt: '2026-10-28T09:30:00.000Z'
  },
  {
    id: 'ans_2_2',
    submissionId: 'sub_2',
    questionId: 'qst_1_2_2',
    answerTextOrUrl: '1. Inability to gauge exact root-zone hydration, leading to either root rot or stunted crop bulb size.\n2. Incurring high diesel pump costs when irrigating unnecessarily during erratic power cuts.\n3. Lack of localized regional language SMS/voice advisories tied to soil metrics.',
    updatedAt: '2026-10-28T09:35:00.000Z'
  },
  {
    id: 'ans_2_3',
    submissionId: 'sub_2',
    questionId: 'qst_1_2_3',
    answerTextOrUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    updatedAt: '2026-10-28T09:40:00.000Z'
  },
  {
    id: 'ans_2_4',
    submissionId: 'sub_2',
    questionId: 'qst_1_2_4',
    answerTextOrUrl: 'https://www.figma.com/proto/sample-wadhwani-journey-map',
    updatedAt: '2026-10-28T09:42:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS: PortalNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_student_1',
    title: 'Submission Reviewed & Graded!',
    message: 'Dr. Rajesh Mehta has evaluated your Activity 1.1 submission. You scored 95/100 points! Check instructor feedback.',
    type: 'success',
    timestamp: '2026-10-20T11:00:00.000Z',
    isRead: false
  },
  {
    id: 'notif_2',
    userId: 'usr_student_1',
    title: 'Upcoming Deadline Alert',
    message: 'Activity 2.1: Lean Business Model Canvas Architecture is due on November 28. Don\'t forget to save your draft.',
    type: 'warning',
    timestamp: '2026-10-29T08:00:00.000Z',
    isRead: false
  },
  {
    id: 'notif_3',
    userId: 'usr_admin_1',
    title: 'New Student Submission Received',
    message: 'Aarav Patel has submitted Activity 1.2: Customer Persona & Pain Point Identification for review.',
    type: 'info',
    timestamp: '2026-10-28T09:45:00.000Z',
    isRead: false
  }
];
