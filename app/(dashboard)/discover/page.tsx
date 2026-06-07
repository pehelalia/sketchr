export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Discover</h2>
        <p className="text-stone-600">
          Explore other artists' progress journals and find inspiration.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-stone-200 p-6 text-center">
          <p className="text-stone-600 mb-4">
            Public journals from other artists will appear here.
          </p>
          <p className="text-sm text-stone-500">
            Make your profile public in settings to share your journey with others.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-stone-300 transition-colors">
            <div className="aspect-square bg-stone-100" />
            <div className="p-4">
              <p className="font-semibold text-stone-900 text-sm">Artist Name</p>
              <p className="text-xs text-stone-600">Latest entry: today</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
