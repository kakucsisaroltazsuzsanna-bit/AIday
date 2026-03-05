import { Package, FileText, Calendar, HardDrive, CheckCircle2, Upload } from 'lucide-react';

const integrations = [
  {
    id: 'jira',
    name: 'Jira',
    description: 'Export tasks directly to Jira with descriptions, priorities, and estimates.',
    icon: Package,
    connected: false,
  },
  {
    id: 'confluence',
    name: 'Confluence',
    description: 'Sync project documentation and briefs from Confluence.',
    icon: FileText,
    connected: false,
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Add project milestones and meetings to your calendar.',
    icon: Calendar,
    connected: true,
  },
  {
    id: 'drive',
    name: 'Google Drive',
    description: 'Access and link design files from Google Drive.',
    icon: HardDrive,
    connected: false,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="mt-1 text-gray-600">
          Connect your favorite tools to streamline your workflow
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    {integration.connected ? (
                      <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-gray-500">Not connected</div>
                    )}
                  </div>
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-600">{integration.description}</p>

              <button
                className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  integration.connected
                    ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <h3 className="mb-2 font-semibold text-gray-900">
          Upload Project Documentation
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Upload PRDs, research reports, or design briefs to help AI generate
          better project plans.
        </p>
        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Choose Files
        </button>
      </div>
    </div>
  );
}
