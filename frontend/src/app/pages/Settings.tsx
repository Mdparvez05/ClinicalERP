import { Save } from 'lucide-react';

export function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your clinic settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-6">
          <div className="flex gap-6">
            <button className="pb-2 border-b-2 border-gray-900 font-medium flex items-center gap-2">
              <span>📋</span>
              General
            </button>
            <button className="pb-2 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <span>🔔</span>
              Notifications
            </button>
            <button className="pb-2 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <span>🔒</span>
              Security
            </button>
            <button className="pb-2 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <span>👥</span>
              Team
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Clinic Information</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Name
                </label>
                <input
                  type="text"
                  defaultValue="MediCare Clinic & Diagnostics"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">📧</span>
                  <input
                    type="email"
                    defaultValue="contact@medicare-clinic.com"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">🌐</span>
                  <input
                    type="url"
                    defaultValue="https://medicare-clinic.com"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  defaultValue="123 Healthcare Ave, Medical District, NY 10001"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
