import { EntryForm } from '@/components/forms/EntryForm';

export default function NewEntryPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Entry</h1>
        <p className="text-stone-600">
          Document your artistic progress and reflect on your creative journey.
        </p>
      </div>

      <EntryForm />
    </div>
  );
}
