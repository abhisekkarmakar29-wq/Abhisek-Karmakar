import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  logout,
  getCourses,
  getActivities,
  getSubmissions,
  getNotifications,
  subscribeToStore,
  initializeStorage
} from './services/storage';
import { User, Course, Activity, Submission, PortalNotification } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ActivityRunner } from './components/activity/ActivityRunner';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CoursesView } from './components/pages/CoursesView';
import { ResourceNetworkView } from './components/pages/ResourceNetworkView';
import { CalendarView } from './components/pages/CalendarView';
import { ProfileView } from './components/pages/ProfileView';
import { HelpSupportView } from './components/pages/HelpSupportView';
import { DatabaseIntegrationView } from './components/pages/DatabaseIntegrationView';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  // Initialize sample data on boot
  useEffect(() => {
    initializeStorage();
  }, []);

  const [currentUser, setUserState] = useState<User | null>(() => getCurrentUser());
  const [courses, setCourses] = useState<Course[]>(() => getCourses());
  const [activities, setActivities] = useState<Activity[]>(() => getActivities());
  const [submissions, setSubmissions] = useState<Submission[]>(() => getSubmissions());
  const [notifications, setNotifications] = useState<PortalNotification[]>(() =>
    currentUser ? getNotifications(currentUser.id) : []
  );

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Subscribe to real-time storage changes
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      const user = getCurrentUser();
      setUserState(user);
      setCourses(getCourses());
      setActivities(getActivities());
      setSubmissions(getSubmissions());
      if (user) {
        setNotifications(getNotifications(user.id));
      }
    });
    return unsubscribe;
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'activity_view' && param) {
      setSelectedActivityId(param);
      setCurrentTab('activity_view');
    } else {
      setCurrentTab(tab);
      if (tab !== 'activity_view') {
        setSelectedActivityId(null);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartActivity = (activityId: string) => {
    setSelectedActivityId(activityId);
    setCurrentTab('activity_view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setUserState(null);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setUserState(user);
    if (user.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  // Filter activities if search is active
  const filteredActivities = searchQuery.trim()
    ? activities.filter(
        (a) =>
          a.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : activities;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        notifications={notifications}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          userRole={currentUser?.role || 'student'}
          onLogout={handleLogout}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />

        {/* Center Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Activity Runner View (Centered focused learning mode) */}
          {currentTab === 'activity_view' && selectedActivity && currentUser && (
            <ActivityRunner
              activity={selectedActivity}
              currentUser={currentUser}
              onBack={() => handleNavigate(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
              onSubmissionComplete={() => {
                setSubmissions(getSubmissions());
              }}
            />
          )}

          {/* Student Dashboard */}
          {currentTab === 'dashboard' && currentUser && (
            <StudentDashboard
              currentUser={currentUser}
              courses={courses}
              activities={filteredActivities}
              submissions={submissions}
              onStartActivity={handleStartActivity}
              onNavigate={handleNavigate}
            />
          )}

          {/* Activities List (same as dashboard view filtered to activities) */}
          {currentTab === 'activities' && currentUser && (
            <StudentDashboard
              currentUser={currentUser}
              courses={courses}
              activities={filteredActivities}
              submissions={submissions}
              onStartActivity={handleStartActivity}
              onNavigate={handleNavigate}
            />
          )}

          {/* Courses View */}
          {currentTab === 'courses' && (
            <CoursesView
              courses={courses}
              activities={activities}
              submissions={submissions}
              onStartActivity={handleStartActivity}
            />
          )}

          {/* Resource Network View */}
          {currentTab === 'resources' && <ResourceNetworkView />}

          {/* Calendar View */}
          {currentTab === 'calendar' && (
            <CalendarView
              activities={activities}
              submissions={submissions}
              onStartActivity={handleStartActivity}
            />
          )}

          {/* Profile View */}
          {currentTab === 'profile' && currentUser && (
            <ProfileView
              currentUser={currentUser}
              submissions={submissions}
              activities={activities}
            />
          )}

          {/* Help & Support View */}
          {currentTab === 'support' && <HelpSupportView />}

          {/* Administrator Panel */}
          {currentTab === 'admin' && currentUser && (
            <AdminDashboard
              currentUser={currentUser}
              onActivitySelect={handleStartActivity}
            />
          )}

          {/* Database Integration & API Configuration */}
          {currentTab === 'db_setup' && <DatabaseIntegrationView />}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
