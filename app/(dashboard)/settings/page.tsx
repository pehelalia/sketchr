export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Settings</h2>
        <p className="text-stone-600">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Your display name"
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-1">
                Bio
              </label>
              <textarea
                placeholder="Tell others about yourself"
                rows={3}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-stone-200" />

        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Privacy</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-stone-900">Make my profile public</span>
          </label>
          <p className="text-xs text-stone-600 mt-2">
            Allow other artists to see your journal and entries.
          </p>
        </div>

        <hr className="border-stone-200" />

        <div>
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Notifications</h3>
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-stone-900">Email digest</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-stone-900">Streak reminders</span>
          </label>
        </div>

        <hr className="border-stone-200" />

        <div className="flex gap-4">
          <button className="px-6 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors">
            Save Changes
          </button>
          <button className="px-6 py-2 border border-stone-200 text-stone-900 rounded-lg font-medium hover:bg-stone-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Danger Zone</h3>
        <button className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
