import React from 'react';
import {
  Home,
  BookOpen,
  CheckSquare,
  Network,
  Calendar,
  User,
  HelpCircle,
  ShieldAlert,
  Database,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole?: UserRole;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  userRole = 'student',
  onLogout,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'activities', label: 'Activities', icon: CheckSquare },
    { id: 'resources', label: 'Resource Network', icon: Network },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: 'Faculty' },
    { id: 'db_setup', label: 'Database & APIs', icon: Database }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Learning Workspace
            </p>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Administration & Faculty Tools */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Management &amp; Data
              </p>
              {userRole === 'admin' && (
                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-red-50 text-red-800 border border-red-200 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-red-600' : 'text-gray-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Wadhwani Venture Tip Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Venture Tip</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed">
              "Fall in love with the customer problem, not your initial solution. Validate before you build."
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
