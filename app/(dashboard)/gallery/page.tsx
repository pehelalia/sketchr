export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Your Gallery</h2>
        <p className="text-stone-600">
          View and organize all your sketch entries in one place.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
        <p className="text-stone-600 mb-4">
          No entries yet. Create your first entry to get started.
        </p>
        <a
          href="/entries/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
        >
          Create Entry
        </a>
      </div>
    </div>
  );
}
