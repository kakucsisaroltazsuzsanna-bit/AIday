'use client';

import { NewProjectFormData, Methodology, ExperienceLevel } from '@/lib/types';
import { Sparkles, Users, Clock, TrendingUp, User } from 'lucide-react';
import { getMethodologyRecommendation } from '@/lib/aiPlanGenerator';
import { useDesignerProfile } from '@/lib/context/DesignerProfileContext';

interface ProjectSettingsFormProps {
  formData: NewProjectFormData;
  onChange: (data: NewProjectFormData) => void;
}

const methodologies: (Methodology | 'Let AI choose')[] = [
  'Let AI choose',
  'Design Thinking',
  'Double Diamond',
  'Lean UX',
  'Design Sprint',
  'Agile UX',
];

const experienceLevels: ExperienceLevel[] = ['Junior', 'Mid-level', 'Senior'];

export default function ProjectSettingsForm({ formData, onChange }: ProjectSettingsFormProps) {
  const { profile } = useDesignerProfile();

  const handleChange = (field: keyof NewProjectFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const recommendation = getMethodologyRecommendation(formData, profile || undefined);

  return (
    <div className="space-y-6">
      {profile && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Designer Profile Active</p>
              <p className="mt-1 text-xs text-blue-700">
                AI will customize this plan based on your {profile.yearsOfExperience} years of experience,
                {profile.specialties.length > 0 && ` ${profile.specialties[0]} expertise,`} and
                {profile.weeklyAvailability} hrs/week availability.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="mb-3 block text-sm font-medium text-gray-900">
          Design Methodology
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          {methodologies.map((methodology) => (
            <button
              key={methodology}
              type="button"
              onClick={() => handleChange('methodology', methodology)}
              className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                formData.methodology === methodology
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {methodology === 'Let AI choose' && (
                  <Sparkles className="mt-0.5 h-5 w-5 text-purple-600" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{methodology}</p>
                  {methodology === 'Let AI choose' && (
                    <p className="mt-1 text-xs text-gray-600">
                      AI will recommend the best methodology based on your project timeline and goals
                    </p>
                  )}
                  {methodology === 'Design Thinking' && (
                    <p className="mt-1 text-xs text-gray-600">
                      Empathize → Define → Ideate → Prototype → Test
                    </p>
                  )}
                  {methodology === 'Double Diamond' && (
                    <p className="mt-1 text-xs text-gray-600">
                      Discover → Define → Develop → Deliver
                    </p>
                  )}
                  {methodology === 'Lean UX' && (
                    <p className="mt-1 text-xs text-gray-600">
                      Think → Make → Check (Rapid iteration)
                    </p>
                  )}
                  {methodology === 'Design Sprint' && (
                    <p className="mt-1 text-xs text-gray-600">
                      5-day process: Map → Sketch → Decide → Prototype → Test
                    </p>
                  )}
                  {methodology === 'Agile UX' && (
                    <p className="mt-1 text-xs text-gray-600">
                      Research → Design → Build → Measure (Iterative sprints)
                    </p>
                  )}
                </div>
                {formData.methodology === methodology && (
                  <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {formData.methodology === 'Let AI choose' && (
          <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">
                  AI Recommendation: {recommendation.methodology}
                </p>
                <p className="mt-1 text-xs text-purple-700">{recommendation.reason}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-gray-900">
          Designer Experience Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {experienceLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleChange('experienceLevel', level)}
              className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition-all ${
                formData.experienceLevel === level
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-600">
          This affects task complexity and time estimates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Users className="h-4 w-4 text-gray-600" />
            Team Size
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.teamSize}
            onChange={(e) => handleChange('teamSize', parseInt(e.target.value) || 1)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <p className="mt-1 text-xs text-gray-600">Number of designers on the team</p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Clock className="h-4 w-4 text-gray-600" />
            Weekly Design Capacity
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="80"
              value={formData.weeklyCapacity}
              onChange={(e) => handleChange('weeklyCapacity', parseInt(e.target.value) || 30)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              hours/week
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Available hours per week for this project
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Planning Summary</p>
            <div className="mt-2 space-y-1 text-xs text-blue-700">
              <p>
                • Timeline:{' '}
                {Math.ceil(
                  (formData.targetDeadline.getTime() - formData.startDate.getTime()) /
                    (1000 * 60 * 60 * 24 * 7)
                )}{' '}
                weeks
              </p>
              <p>• Team: {formData.teamSize} designer(s)</p>
              <p>• Capacity: {formData.weeklyCapacity}h/week</p>
              <p>
                • Total available hours:{' '}
                {formData.weeklyCapacity *
                  Math.ceil(
                    (formData.targetDeadline.getTime() - formData.startDate.getTime()) /
                      (1000 * 60 * 60 * 24 * 7)
                  )}
                h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
