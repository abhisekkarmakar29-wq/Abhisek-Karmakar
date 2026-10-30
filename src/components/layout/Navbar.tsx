import React, { useState } from 'react';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ChevronDown,
  CheckCheck,
  ExternalLink,
  Menu,
  X,
  Database
} from 'lucide-react';
import { User, PortalNotification } from '../../types';
import {
  markNotificationRead,
  markAllNotificationsRead,
  switchDemoRole
} from '../../services/storage';

interface NavbarProps {
  currentUser: User | null;
  notifications: PortalNotification[];
  onNavigate: (tab: string, param?: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  notifications,
  onNavigate,
  onLogout,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRoleToggle = () => {
    if (!currentUser) return;
    const nextRole = currentUser.role === 'student' ? 'admin' : 'student';
    switchDemoRole(nextRole);
    if (nextRole === 'admin') {
      onNavigate('admin');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => onNavigate(currentUser?.role === 'admin' ? 'admin' : 'dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-sm shadow-red-200 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-tighter">W</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 text-base tracking-tight leading-none group-hover:text-red-600 transition-colors">
                    WADHWANI
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    Portal
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium tracking-wide">
                  Smart Learning &amp; Activity Management
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities, courses, frameworks..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none input-green-focus transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {/* Instant Role Switcher for Demo testing */}
                <button
                  onClick={handleRoleToggle}
                  title="Click to instantly toggle between Student and Admin viewpoints"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    currentUser.role === 'admin'
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>Role: {currentUser.role === 'admin' ? 'Faculty Admin' : 'Student'}</span>
                  <span className="text-[10px] text-gray-400 font-normal underline ml-1">Switch</span>
                </button>

                {/* Database Setup Button */}
                <button
                  onClick={() => onNavigate('db_setup')}
                  title="Database and Backend Integration Hub"
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DB Status</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllNotificationsRead(currentUser.id)}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationRead(notif.id);
                                if (notif.linkAction) {
                                  if (notif.linkAction.startsWith('activity_')) {
                                    onNavigate('activity_view', notif.linkAction.replace('activity_', ''));
                                  } else {
                                    onNavigate(notif.linkAction);
                                  }
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notif.isRead ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-xs text-gray-900">
                                  {notif.title}
                                </span>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                  {new Date(notif.timestamp).toLocaleDateString([], {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={
                        currentUser.avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          currentUser.fullName
                        )}`
                      }
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                    />
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-semibold text-gray-900 leading-tight">
                        {currentUser.fullName}
                      </span>
                      <span className="text-[10px] text-gray-500 capitalize leading-tight">
                        {currentUser.role === 'admin' ? 'Faculty Admin' : 'Student'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in">
                      <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900">{currentUser.fullName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                        {currentUser.studentId && (
                          <p className="text-[10px] font-mono text-emerald-700 mt-0.5">
                            ID: {currentUser.studentId}
                          </p>
                        )}
                      </div>

                      <div className="p-1">
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg text-left"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span>Student Profile</span>
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded-lg text-left font-medium"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                            <span>Faculty Admin Portal</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onNavigate('db_setup');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg text-left"
                        >
                          <Database className="w-3.5 h-3.5 text-gray-500" />
                          <span>Database &amp; API Setup</span>
                        </button>

                        <div className="my-1 border-t border-gray-100"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="btn-primary-red px-4 py-2 text-xs font-bold rounded-lg shadow-sm"
                >
                  Student Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
