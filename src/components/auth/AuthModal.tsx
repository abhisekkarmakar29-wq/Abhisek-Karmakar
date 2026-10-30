import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  Rocket,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { login, register, switchDemoRole } from '../../services/storage';
import { User, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [ventureName, setVentureName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Failed to authenticate.');
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        fullName,
        email,
        passwordHash: password,
        role,
        institution: institution || 'Wadhwani Entrepreneurship Network Member',
        ventureName: ventureName || 'Stealth Venture'
      });
      setIsLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }, 400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your registered email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(
        `A password reset token link has been simulated for ${email}. Check your inbox or proceed with demo logins.`
      );
    }, 500);
  };

  const handleQuickDemoLogin = (targetRole: UserRole) => {
    const user = switchDemoRole(targetRole);
    onSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              W
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">Wadhwani Portal Auth</h2>
              <p className="text-[11px] text-white/80">Secure Entrepreneurship Learning Login</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 p-1">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Register Student
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Logins Bar */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>⚡ One-Click Demo Access</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>As Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>As Faculty Admin</span>
              </button>
            </div>
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Content */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@wadhwani.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder-gray-400 input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setError(null);
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder-gray-400 input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-red py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Rohit Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder-gray-400 input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rohit@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder-gray-400 input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder-gray-400 input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Institution / Hub
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="IIT, NIT, Incubation Cell"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg input-green-focus focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Venture Name
                  </label>
                  <input
                    type="text"
                    value={ventureName}
                    onChange={(e) => setVentureName(e.target.value)}
                    placeholder="e.g. EcoTech Labs"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                      role === 'student'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Student Entrepreneur
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                      role === 'admin'
                        ? 'bg-red-50 text-red-800 border-red-400'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Faculty / Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-red py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your registered student or faculty email address and we will generate a password recovery verification token.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@wadhwani.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg input-green-focus focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-red py-2 rounded-lg text-xs font-bold shadow-sm"
              >
                {isLoading ? 'Sending...' : 'Send Recovery Link'}
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 py-1"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
