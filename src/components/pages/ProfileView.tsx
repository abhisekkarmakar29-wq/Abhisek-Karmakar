import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building,
  Rocket,
  Award,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { User, Submission, Activity } from '../../types';
import { updateUserProfile } from '../../services/storage';

interface ProfileViewProps {
  currentUser: User;
  submissions: Submission[];
  activities: Activity[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  submissions,
  activities
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [ventureName, setVentureName] = useState(currentUser.ventureName || '');
  const [ventureIndustry, setVentureIndustry] = useState(currentUser.ventureIndustry || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isSaved, setIsSaved] = useState(false);

  const completedCount = submissions.filter(
    (s) =>
      s.studentId === currentUser.id &&
      (s.submissionStatus === 'submitted' || s.submissionStatus === 'reviewed')
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      fullName,
      institution,
      ventureName,
      ventureIndustry,
      bio
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-700 to-emerald-800 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={
              currentUser.avatarUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                currentUser.fullName
              )}`
            }
            alt={currentUser.fullName}
            className="w-24 h-24 rounded-2xl border-2 border-white/30 shadow-lg object-cover bg-white"
          />

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.fullName}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                {currentUser.role === 'admin' ? 'Faculty Admin' : 'Student Entrepreneur'}
              </span>
            </div>
            <p className="text-xs text-white/80">{currentUser.email}</p>
            {currentUser.studentId && (
              <p className="text-[11px] font-mono text-emerald-200">ID: {currentUser.studentId}</p>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                {currentUser.institution || 'Wadhwani Incubation Cell'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(currentUser.registrationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Completed Activities</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Active Venture</span>
          <p className="text-base font-bold text-emerald-700 truncate mt-1">
            {currentUser.ventureName || 'Stealth Concept'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Cohort Status</span>
          <p className="text-base font-bold text-gray-800 mt-1">Cohort Delta</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Track Level</span>
          <p className="text-base font-bold text-red-600 mt-1">Core Track 1</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Student &amp; Venture Details</h2>
            <p className="text-xs text-gray-500">Update your public profile and incubator information</p>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profile Saved</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Institution or Incubation Cell
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Startup Venture Name
              </label>
              <input
                type="text"
                value={ventureName}
                onChange={(e) => setVentureName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Target Sector / Industry</label>
            <input
              type="text"
              value={ventureIndustry}
              onChange={(e) => setVentureIndustry(e.target.value)}
              placeholder="e.g. AgriTech &amp; IoT, B2B SaaS, HealthTech..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Founder Bio &amp; Entrepreneurship Mission
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your motivation, technical skills, and vision for your startup..."
              className="w-full p-3.5 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="btn-primary-red px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
