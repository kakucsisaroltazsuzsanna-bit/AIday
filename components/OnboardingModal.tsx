'use client';

import { useState } from 'react';
import { DesignerProfile, ExperienceLevel, DesignSpecialty, Methodology, ToolProficiency } from '@/lib/types';
import { X, ChevronRight, ChevronLeft, User, Briefcase, Code, Calendar, Target, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: DesignerProfile) => void;
}

const specialties: DesignSpecialty[] = [
  'UI Design',
  'UX Research',
  'Product Design',
  'Visual Design',
  'Interaction Design',
  'Design Systems',
  'Service Design',
];

const methodologies: Methodology[] = [
  'Design Thinking',
  'Double Diamond',
  'Lean UX',
  'Design Sprint',
  'Agile UX',
];

const commonSkills = [
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
  'InVision', 'Framer', 'Principle', 'After Effects', 'Prototyping',
  'User Research', 'Usability Testing', 'Information Architecture', 'Wireframing',
  'HTML/CSS', 'React', 'Design Systems', 'Accessibility'
];

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experienceLevel: 'Mid-level' as ExperienceLevel,
    yearsOfExperience: 3,
    specialties: [] as DesignSpecialty[],
    skills: [] as { name: string; proficiency: ToolProficiency }[],
    weeklyAvailability: 40,
    preferredMethodologies: [] as Methodology[],
    bio: '',
  });

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const profile: DesignerProfile = {
      id: `designer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...formData,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=9333ea&color=fff`,
      completedOnboarding: true,
    };
    onComplete(profile);
  };

  const toggleSpecialty = (specialty: DesignSpecialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleMethodology = (methodology: Methodology) => {
    setFormData(prev => ({
      ...prev,
      preferredMethodologies: prev.preferredMethodologies.includes(methodology)
        ? prev.preferredMethodologies.filter(m => m !== methodology)
        : [...prev.preferredMethodologies, methodology]
    }));
  };

  const addSkill = (skillName: string) => {
    if (!formData.skills.find(s => s.name === skillName)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, proficiency: 'Intermediate' }]
      }));
    }
  };

  const removeSkill = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName)
    }));
  };

  const updateSkillProficiency = (skillName: string, proficiency: ToolProficiency) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.name === skillName ? { ...s, proficiency } : s
      )
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.email.trim();
      case 2:
        return formData.specialties.length > 0;
      case 3:
        return formData.skills.length > 0;
      case 4:
        return formData.preferredMethodologies.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to AI Design Planner</h2>
            <p className="mt-2 text-gray-600">
              Let's set up your designer profile to personalize your experience
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span>Step {step} of {totalSteps}</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-sm text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Junior', 'Mid-level', 'Senior'] as ExperienceLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, experienceLevel: level })}
                        className={`rounded-lg border-2 p-4 text-center transition-all ${
                          formData.experienceLevel === level
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold">{level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience: {formData.yearsOfExperience}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 years</span>
                    <span>20+ years</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Specialties */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Design Specialties</h3>
                    <p className="text-sm text-gray-600">Select your areas of expertise (choose at least one)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        formData.specialties.includes(specialty)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{specialty}</span>
                        {formData.specialties.includes(specialty) && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Skills & Tools */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Code className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Skills & Tools</h3>
                    <p className="text-sm text-gray-600">Add your skills and rate your proficiency</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Common Skills</label>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {commonSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        disabled={formData.skills.some(s => s.name === skill)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                          formData.skills.some(s => s.name === skill)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                        }`}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
                  {formData.skills.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                      <p className="text-sm text-gray-500">No skills added yet. Click on common skills above or add your own.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.skills.map((skill) => (
                        <div key={skill.name} className="rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{skill.name}</span>
                            <button
                              onClick={() => removeSkill(skill.name)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as ToolProficiency[]).map((level) => (
                              <button
                                key={level}
                                onClick={() => updateSkillProficiency(skill.name, level)}
                                className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-all ${
                                  skill.proficiency === level
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Methodologies */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Preferred Methodologies</h3>
                    <p className="text-sm text-gray-600">Select the design methodologies you prefer to work with</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {methodologies.map((methodology) => (
                    <button
                      key={methodology}
                      onClick={() => toggleMethodology(methodology)}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        formData.preferredMethodologies.includes(methodology)
                          ? 'border-orange-600 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{methodology}</span>
                        {formData.preferredMethodologies.includes(methodology) && (
                          <CheckCircle className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Availability & Bio */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Availability & Bio</h3>
                    <p className="text-sm text-gray-600">Final details about your work schedule</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Availability: {formData.weeklyAvailability} hours
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={formData.weeklyAvailability}
                    onChange={(e) => setFormData({ ...formData, weeklyAvailability: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10 hrs/week</span>
                    <span>60 hrs/week</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us a bit about yourself, your design philosophy, or anything you'd like to share..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Profile Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Experience:</strong> {formData.experienceLevel} ({formData.yearsOfExperience} years)</p>
                    <p><strong>Specialties:</strong> {formData.specialties.join(', ')}</p>
                    <p><strong>Skills:</strong> {formData.skills.length} added</p>
                    <p><strong>Methodologies:</strong> {formData.preferredMethodologies.join(', ')}</p>
                    <p><strong>Availability:</strong> {formData.weeklyAvailability} hours/week</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
