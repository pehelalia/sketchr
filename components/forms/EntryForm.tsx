'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import { entryFormSchema, type EntryFormData } from '@/lib/entry-schema';

const mediumOptions = [
  { value: 'pencil', label: 'Pencil' },
  { value: 'pen', label: 'Pen' },
  { value: 'digital', label: 'Digital' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'charcoal', label: 'Charcoal' },
  { value: 'other', label: 'Other' },
];

const subjectOptions = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'figure', label: 'Figure' },
  { value: 'animal', label: 'Animal' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'still life', label: 'Still Life' },
  { value: 'other', label: 'Other' },
];

interface EntryFormProps {
  onSubmit?: (data: EntryFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EntryForm({ onSubmit, isLoading = false }: EntryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [journalCharCount, setJournalCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    resetField,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entryFormSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      medium: 'pencil',
      subject: 'portrait',
      mood: '',
      timeSpent: 0,
      journalNote: '',
      visibility: 'private',
      entryDate: new Date().toISOString().split('T')[0],
    },
  });

  const watchJournalNote = watch('journalNote');
  const watchImage = watch('image');

  // Update character count
  if (watchJournalNote && watchJournalNote.length !== journalCharCount) {
    setJournalCharCount(watchJournalNote.length || 0);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only JPG, PNG, and WebP images are allowed');
        return;
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB');
        return;
      }

      setFileName(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    resetField('image');
  };

  const handleFormSubmit = async (data: EntryFormData) => {
    if (onSubmit) {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Image Upload Section */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Upload Artwork</h3>

        {imagePreview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-96 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-sm text-stone-600">
              <p>Selected: {fileName}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-stone-900 hover:text-stone-700 font-medium underline"
              >
                Change image
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-stone-200 rounded-lg p-8 hover:border-stone-300 transition-colors text-center"
          >
            <Upload className="mx-auto mb-2 text-stone-400" size={32} />
            <p className="text-stone-900 font-medium">Click to upload image</p>
            <p className="text-sm text-stone-600">JPG, PNG, or WebP (max 10MB)</p>
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          {...register('image')}
          onChange={handleImageChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
      </div>

      {/* Title Section */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <label htmlFor="title" className="block text-sm font-medium text-stone-900 mb-2">
          Title <span className="text-stone-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="title"
          placeholder="Give your entry a title"
          {...register('title')}
          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {/* Medium and Subject Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medium */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <label htmlFor="medium" className="block text-sm font-medium text-stone-900 mb-2">
            Medium <span className="text-red-600">*</span>
          </label>
          <select
            id="medium"
            {...register('medium')}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors bg-white"
          >
            {mediumOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.medium && <p className="mt-1 text-sm text-red-600">{errors.medium.message}</p>}
        </div>

        {/* Subject */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <label htmlFor="subject" className="block text-sm font-medium text-stone-900 mb-2">
            Subject <span className="text-red-600">*</span>
          </label>
          <select
            id="subject"
            {...register('subject')}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors bg-white"
          >
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
        </div>
      </div>

      {/* Mood and Time Spent Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <label htmlFor="mood" className="block text-sm font-medium text-stone-900 mb-2">
            Mood <span className="text-stone-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="mood"
            placeholder="e.g., Inspired, Experimental, Frustrated"
            {...register('mood')}
            maxLength={100}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors"
          />
          {errors.mood && <p className="mt-1 text-sm text-red-600">{errors.mood.message}</p>}
        </div>

        {/* Time Spent */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <label htmlFor="timeSpent" className="block text-sm font-medium text-stone-900 mb-2">
            Time Spent (minutes) <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            id="timeSpent"
            placeholder="0"
            {...register('timeSpent')}
            min={0}
            max={1440}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors"
          />
          {errors.timeSpent && <p className="mt-1 text-sm text-red-600">{errors.timeSpent.message}</p>}
        </div>
      </div>

      {/* Journal Note Section */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="journalNote" className="block text-sm font-medium text-stone-900">
            Journal Note <span className="text-stone-500 font-normal">(optional)</span>
          </label>
          <span className="text-xs text-stone-500">
            {journalCharCount}/500
          </span>
        </div>
        <textarea
          id="journalNote"
          placeholder="Reflect on your creative process, what worked, what didn't, or any thoughts about this piece..."
          {...register('journalNote')}
          maxLength={500}
          rows={6}
          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors resize-none"
        />
        {errors.journalNote && (
          <p className="mt-1 text-sm text-red-600">{errors.journalNote.message}</p>
        )}
      </div>

      {/* Visibility and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visibility */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <label htmlFor="visibility" className="block text-sm font-medium text-stone-900 mb-2">
            Visibility <span className="text-red-600">*</span>
          </label>
          <select
            id="visibility"
            {...register('visibility')}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors bg-white"
          >
            <option value="private">Private (Only you can see)</option>
            <option value="public">Public (Visible to others)</option>
          </select>
          {errors.visibility && (
            <p className="mt-1 text-sm text-red-600">{errors.visibility.message}</p>
          )}
        </div>

        {/* Entry Date */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <label htmlFor="entryDate" className="block text-sm font-medium text-stone-900 mb-2">
            Entry Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            id="entryDate"
            {...register('entryDate')}
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-colors"
          />
          {errors.entryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.entryDate.message}</p>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Entry'}
        </button>
        <button
          type="button"
          className="flex-1 px-6 py-2 border border-stone-200 text-stone-900 rounded-lg font-medium hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
