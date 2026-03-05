'use client';

import { NewProjectFormData, Priority } from '@/lib/types';
import { Calendar } from 'lucide-react';

interface ProjectInfoFormProps {
  formData: NewProjectFormData;
  onChange: (data: NewProjectFormData) => void;
}

export default function ProjectInfoForm({ formData, onChange }: ProjectInfoFormProps) {
  const handleChange = (field: keyof NewProjectFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const handleStakeholdersChange = (value: string) => {
    const stakeholders = value.split(',').map(s => s.trim()).filter(s => s);
    handleChange('stakeholders', stakeholders);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., E-commerce Mobile App Redesign"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Short Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief one-line description of the project"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Design Brief
        </label>
        <textarea
          value={formData.designBrief}
          onChange={(e) => handleChange('designBrief', e.target.value)}
          placeholder="Paste your design brief or project requirements here. Include context, goals, constraints, and any specific requirements..."
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
        <p className="mt-1 text-xs text-gray-500">
          The more detail you provide, the better the AI can generate your project plan
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as Priority)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Product Area
          </label>
          <input
            type="text"
            value={formData.productArea || ''}
            onChange={(e) => handleChange('productArea', e.target.value)}
            placeholder="e.g., Mobile, Web, Dashboard"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleChange('startDate', new Date(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Target Deadline
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.targetDeadline.toISOString().split('T')[0]}
              onChange={(e) => handleChange('targetDeadline', new Date(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Stakeholders
        </label>
        <input
          type="text"
          value={formData.stakeholders?.join(', ') || ''}
          onChange={(e) => handleStakeholdersChange(e.target.value)}
          placeholder="e.g., Product Manager, Engineering Lead, CEO (comma-separated)"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple stakeholders with commas
        </p>
      </div>
    </div>
  );
}
