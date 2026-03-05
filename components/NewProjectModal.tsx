'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { NewProjectFormData, GeneratedPhase } from '@/lib/types';
import { generateProjectPlan, getMethodologyRecommendation } from '@/lib/aiPlanGenerator';
import ProjectInfoForm from './ProjectInfoForm';
import ProjectSettingsForm from './ProjectSettingsForm';
import ProjectPlanPreview from './ProjectPlanPreview';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: NewProjectFormData, generatedPlan: GeneratedPhase[]) => void;
  prefilledData?: Partial<NewProjectFormData>;
}

const steps = [
  { id: 1, name: 'Basic Info', description: 'Project details' },
  { id: 2, name: 'Settings', description: 'Planning parameters' },
  { id: 3, name: 'AI Generation', description: 'Generate plan' },
  { id: 4, name: 'Review', description: 'Review and edit' },
];

export default function NewProjectModal({ isOpen, onClose, onSave, prefilledData }: NewProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPhase[] | null>(null);
  const [formData, setFormData] = useState<NewProjectFormData>(() => {
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);

    return {
      title: prefilledData?.title || '',
      description: prefilledData?.description || '',
      designBrief: prefilledData?.designBrief || '',
      priority: prefilledData?.priority || 'Medium',
      startDate: prefilledData?.startDate || new Date(),
      targetDeadline: prefilledData?.targetDeadline || defaultDeadline,
      stakeholders: prefilledData?.stakeholders || [],
      productArea: prefilledData?.productArea || '',
      methodology: prefilledData?.methodology || 'Let AI choose',
      experienceLevel: prefilledData?.experienceLevel || 'Mid-level',
      teamSize: prefilledData?.teamSize || 2,
      weeklyCapacity: prefilledData?.weeklyCapacity || 30,
    };
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const plan = generateProjectPlan(formData);
    setGeneratedPlan(plan);
    setIsGenerating(false);
    setCurrentStep(4);
  };

  const handleSave = () => {
    if (generatedPlan) {
      onSave(formData, generatedPlan);
      onClose();
    }
  };

  const handlePlanUpdate = (updatedPlan: GeneratedPhase[]) => {
    setGeneratedPlan(updatedPlan);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.title.trim() && formData.description.trim();
    }
    if (currentStep === 2) {
      return formData.weeklyCapacity > 0 && formData.teamSize > 0;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1].name}: {steps[currentStep - 1].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                        currentStep >= step.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.id}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 ${
                        currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="min-h-[500px]">
              {currentStep === 1 && (
                <ProjectInfoForm formData={formData} onChange={setFormData} />
              )}

              {currentStep === 2 && (
                <ProjectSettingsForm formData={formData} onChange={setFormData} />
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-4">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      AI Project Plan Generator
                    </h3>
                    <p className="text-gray-600">
                      Generate a complete project plan with phases and tasks based on your inputs
                    </p>
                  </div>

                  {formData.methodology === 'Let AI choose' && (
                    <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                      <p className="text-sm font-medium text-purple-900">
                        Recommended Methodology: {getMethodologyRecommendation(formData).methodology}
                      </p>
                      <p className="mt-1 text-xs text-purple-700">
                        {getMethodologyRecommendation(formData).reason}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>Analyzing project requirements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>Selecting optimal methodology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>Generating phases and tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>Estimating time and resources</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGeneratePlan}
                    disabled={isGenerating}
                    className="mt-8 flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Project Plan
                      </>
                    )}
                  </button>
                </div>
              )}

              {currentStep === 4 && generatedPlan && (
                <ProjectPlanPreview
                  plan={generatedPlan}
                  formData={formData}
                  onPlanUpdate={handlePlanUpdate}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || currentStep === 3}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700"
                >
                  Save Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
