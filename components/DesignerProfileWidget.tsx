'use client';

import { useState } from 'react';
import { useDesignerProfile } from '@/lib/context/DesignerProfileContext';
import OnboardingModal from './OnboardingModal';
import { User, Edit2, Briefcase, Code, Target, Calendar } from 'lucide-react';
import { DesignerProfile } from '@/lib/types';

export default function DesignerProfileWidget() {
  const { profile, updateProfile } = useDesignerProfile();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) return null;

  const handleEditComplete = (updatedProfile: DesignerProfile) => {
    updateProfile(updatedProfile);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-16 w-16 rounded-full border-2 border-purple-200"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-200">
                <User className="h-8 w-8 text-purple-600" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  {profile.experienceLevel}
                </span>
                <span className="text-xs text-gray-600">
                  {profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? 'year' : 'years'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="h-4 w-4" />
              Specialties
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Code className="h-4 w-4" />
              Top Skills
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
                >
                  {skill.name}
                </span>
              ))}
              {profile.skills.length > 4 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  +{profile.skills.length - 4} more
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4" />
              Preferred Methods
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.preferredMethodologies.map((method) => (
                <span
                  key={method}
                  className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              Availability
            </div>
            <p className="text-sm text-gray-900">
              {profile.weeklyAvailability} hours/week
            </p>
          </div>
        </div>

        {profile.bio && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{profile.bio}</p>
          </div>
        )}
      </div>

      <OnboardingModal
        isOpen={showEditModal}
        onComplete={handleEditComplete}
      />
    </>
  );
}
