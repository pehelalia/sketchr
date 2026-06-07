export default function RecapsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Progress Recaps</h2>
        <p className="text-stone-600">
          Review your artistic growth over time with detailed analytics and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Entries Created</span>
              <span className="font-semibold text-stone-900">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Days Active</span>
              <span className="font-semibold text-stone-900">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Streak Days</span>
              <span className="font-semibold text-stone-900">0</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">All Time</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Total Entries</span>
              <span className="font-semibold text-stone-900">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Longest Streak</span>
              <span className="font-semibold text-stone-900">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Member Since</span>
              <span className="font-semibold text-stone-900">—</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Activity Chart</h3>
        <p className="text-stone-600 text-center py-8">
          Your activity data will appear here as you create entries.
        </p>
      </div>
    </div>
  );
}
