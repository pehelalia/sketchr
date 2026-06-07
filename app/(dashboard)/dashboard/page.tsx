export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Welcome back</h2>
        <p className="text-stone-600">
          Track your artistic progress and document your creative journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-900 mb-2">Total Entries</h3>
          <p className="text-3xl font-bold text-stone-900">0</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-900 mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-stone-900">0</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-900 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-stone-900">0</p>
        </div>
      </div>
    </div>
  );
}
