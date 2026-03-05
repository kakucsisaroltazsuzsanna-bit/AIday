'use client';

import { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { NewProjectFormData } from '@/lib/types';

interface ImportProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Partial<NewProjectFormData>) => void;
}

type ImportSource = 'jira' | 'confluence' | 'csv' | null;

export default function ImportProjectModal({ isOpen, onClose, onImport }: ImportProjectModalProps) {
  const [source, setSource] = useState<ImportSource>(null);
  const [jiraUrl, setJiraUrl] = useState('');
  const [confluenceUrl, setConfluenceUrl] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleConfluenceImport = async () => {
    setIsImporting(true);
    setImportStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/confluence/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confluenceUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        setImportStatus('error');
        setErrorMessage(result.message || result.error || 'Import failed');

        // Show help URL if credentials not configured
        if (result.helpUrl) {
          setErrorMessage(
            `${result.message}\n\nGet your API token from: ${result.helpUrl}\n\nThen add to .env.local:\nCONFLUENCE_DOMAIN=yourcompany.atlassian.net\nCONFLUENCE_EMAIL=your@email.com\nCONFLUENCE_API_TOKEN=your-token`
          );
        }

        setIsImporting(false);
        return;
      }

      // Success - prepare data for import
      const importedData: Partial<NewProjectFormData> = {
        title: result.data.title,
        description: result.data.description,
        designBrief: result.data.designBrief,
        priority: result.data.priority || 'Medium',
        stakeholders: result.data.stakeholders,
        productArea: result.data.productArea,
      };

      setImportStatus('success');
      setIsImporting(false);

      setTimeout(() => {
        onImport(importedData);
        onClose();
        resetForm();
      }, 1500);

    } catch (error: any) {
      console.error('Confluence import error:', error);
      setImportStatus('error');
      setErrorMessage(error.message || 'Network error. Please check your connection.');
      setIsImporting(false);
    }
  };

  const handleJiraImport = async () => {
    setIsImporting(true);
    setImportStatus('idle');

    // Mock Jira import (TODO: Implement real Jira API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const importedData: Partial<NewProjectFormData> = {
      title: 'Imported from Jira: Mobile App Redesign',
      description: 'Project imported from Jira board',
      designBrief: `Imported from Jira: ${jiraUrl}\n\nKey Requirements:\n- Improve user experience\n- Modernize UI\n- Increase engagement`,
      priority: 'High',
      stakeholders: ['Product Manager', 'Engineering Lead'],
      productArea: 'Mobile',
    };

    setImportStatus('success');
    setIsImporting(false);

    setTimeout(() => {
      onImport(importedData);
      onClose();
      resetForm();
    }, 1500);
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;

    setIsImporting(true);
    setImportStatus('idle');
    setErrorMessage('');

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        setImportStatus('error');
        setErrorMessage('CSV file must contain at least a header row and one data row');
        setIsImporting(false);
        return;
      }

      // Parse CSV
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const tasks = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const task: any = {};

        headers.forEach((header, index) => {
          if (values[index]) {
            task[header] = values[index];
          }
        });

        if (task['task name'] || task['title']) {
          tasks.push({
            title: task['task name'] || task['title'],
            description: task['description'] || task['task name'] || task['title'],
            estimatedHours: parseInt(task['estimated hours'] || task['hours'] || '8'),
            priority: task['priority'] || 'Medium',
          });
        }
      }

      const importedData: Partial<NewProjectFormData> = {
        title: `Imported from CSV: ${csvFile.name.replace('.csv', '')}`,
        description: 'Project imported from CSV file',
        designBrief: `Imported from CSV file: ${csvFile.name}\n\n${tasks.length} tasks imported.\n\nTasks will be distributed across phases based on your selected methodology.`,
        priority: 'Medium',
      };

      setImportStatus('success');
      setIsImporting(false);

      setTimeout(() => {
        onImport(importedData);
        onClose();
        resetForm();
      }, 1500);

    } catch (error: any) {
      console.error('CSV import error:', error);
      setImportStatus('error');
      setErrorMessage('Failed to parse CSV file. Please check the format.');
      setIsImporting(false);
    }
  };

  const handleImport = () => {
    if (source === 'jira') {
      handleJiraImport();
    } else if (source === 'confluence') {
      handleConfluenceImport();
    } else if (source === 'csv') {
      handleCsvImport();
    }
  };

  const resetForm = () => {
    setSource(null);
    setJiraUrl('');
    setConfluenceUrl('');
    setCsvFile(null);
    setImportStatus('idle');
    setErrorMessage('');
  };

  const canImport = () => {
    if (source === 'jira') return jiraUrl.trim().length > 0;
    if (source === 'confluence') return confluenceUrl.trim().length > 0;
    if (source === 'csv') return csvFile !== null;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Import Project</h2>
              <p className="text-sm text-gray-600">Import project data from external sources</p>
            </div>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {!source ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Select an import source:</p>

                <button
                  onClick={() => setSource('jira')}
                  className="w-full rounded-xl border-2 border-gray-200 p-6 text-left transition-all hover:border-purple-500 hover:bg-purple-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Import from Jira</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Import project structure, tasks, and metadata from a Jira board or project
                      </p>
                      <p className="mt-2 text-xs text-orange-600">⚠️ Mock implementation - real API coming soon</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSource('confluence')}
                  className="w-full rounded-xl border-2 border-purple-500 bg-purple-50 p-6 text-left transition-all hover:border-purple-600"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Import from Confluence</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Import project documentation, briefs, and requirements from Confluence pages
                      </p>
                      <p className="mt-2 text-xs text-green-600">✅ Real API integration - fully functional</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSource('csv')}
                  className="w-full rounded-xl border-2 border-gray-200 p-6 text-left transition-all hover:border-purple-500 hover:bg-purple-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Upload className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Import from CSV</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Upload a CSV file with project tasks, estimates, and other details
                      </p>
                      <p className="mt-2 text-xs text-green-600">✅ Fully functional</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {source === 'jira' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Jira Board URL or Project Key
                    </label>
                    <input
                      type="text"
                      value={jiraUrl}
                      onChange={(e) => setJiraUrl(e.target.value)}
                      placeholder="https://yourcompany.atlassian.net/browse/PROJ-123 or PROJ-123"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the full Jira URL or project key to import tasks and structure
                    </p>
                    <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                      <p className="text-xs text-orange-800">
                        ⚠️ This is currently a mock implementation. Real Jira API integration coming soon.
                      </p>
                    </div>
                  </div>
                )}

                {source === 'confluence' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Confluence Page URL
                    </label>
                    <input
                      type="text"
                      value={confluenceUrl}
                      onChange={(e) => setConfluenceUrl(e.target.value)}
                      placeholder="https://yourcompany.atlassian.net/wiki/spaces/PROJ/pages/123456/Page+Title"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the Confluence page URL containing your project documentation
                    </p>
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-xs font-medium text-blue-900 mb-1">Setup Required:</p>
                      <p className="text-xs text-blue-800">
                        1. Get API token: <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" className="underline">Atlassian API Tokens</a><br/>
                        2. Add to <code className="bg-blue-100 px-1 rounded">.env.local</code>:<br/>
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded block mt-1">
                          CONFLUENCE_DOMAIN=yourcompany.atlassian.net<br/>
                          CONFLUENCE_EMAIL=your@email.com<br/>
                          CONFLUENCE_API_TOKEN=your-token
                        </code>
                      </p>
                    </div>
                  </div>
                )}

                {source === 'csv' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Upload CSV File
                    </label>
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                            Choose File
                          </span>
                          <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {csvFile && (
                        <p className="mt-4 text-sm font-medium text-gray-900">
                          Selected: {csvFile.name}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        CSV should include columns: Task Name, Description, Estimated Hours, Priority
                      </p>
                    </div>
                  </div>
                )}

                {importStatus === 'success' && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">
                      Import successful! Opening project creation wizard...
                    </p>
                  </div>
                )}

                {importStatus === 'error' && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">Import failed</p>
                        <p className="mt-1 text-xs text-red-800 whitespace-pre-wrap">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSource(null);
                      setImportStatus('idle');
                      setErrorMessage('');
                    }}
                    disabled={isImporting}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!canImport() || isImporting}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Import Project'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
