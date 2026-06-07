'use client';

import { useState } from 'react';
import { EntryForm } from '@/components/forms/EntryForm';
import { type EntryFormData } from '@/lib/entry-schema';

/**
 * Example implementation showing how to use EntryForm with the API endpoint
 * This demonstrates form submission, error handling, and success flow
 */
export function EntryFormExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (data: EntryFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Create FormData to include file
      const formData = new FormData();

      // Append file
      formData.append('image', data.image);

      // Append other fields
      formData.append('title', data.title || '');
      formData.append('medium', data.medium);
      formData.append('subject', data.subject);
      formData.append('mood', data.mood || '');
      formData.append('timeSpent', String(data.timeSpent));
      formData.append('journalNote', data.journalNote || '');
      formData.append('visibility', data.visibility);
      formData.append('entryDate', data.entryDate);

      // Submit to API
      const response = await fetch('/api/entries', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create entry');
      }

      const result = await response.json();

      // Show success message
      setSuccessMessage('Entry created successfully! Redirecting...');

      // Wait briefly, then redirect
      setTimeout(() => {
        // Redirect to gallery or dashboard
        window.location.href = '/gallery';
      }, 1500);
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create entry. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <EntryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    </div>
  );
}
