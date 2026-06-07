import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const entryFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'Image must be less than 10MB',
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only JPG, PNG, and WebP images are allowed',
    }),
  title: z.string().max(200, 'Title must be less than 200 characters').optional().or(z.literal('')),
  medium: z.enum(['pencil', 'pen', 'digital', 'watercolor', 'charcoal', 'other'], {
    errorMap: () => ({ message: 'Please select a valid medium' }),
  }),
  subject: z.enum(['portrait', 'landscape', 'figure', 'animal', 'abstract', 'still life', 'other'], {
    errorMap: () => ({ message: 'Please select a valid subject' }),
  }),
  mood: z
    .string()
    .max(100, 'Mood must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  timeSpent: z
    .coerce
    .number()
    .int('Time spent must be a whole number')
    .min(0, 'Time spent must be at least 0 minutes')
    .max(1440, 'Time spent cannot exceed 24 hours (1440 minutes)'),
  journalNote: z
    .string()
    .max(500, 'Journal note must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  visibility: z.enum(['private', 'public'], {
    errorMap: () => ({ message: 'Please select a visibility option' }),
  }),
  entryDate: z
    .string()
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, 'Invalid date')
    .refine((date) => {
      const d = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return d <= today;
    }, 'Entry date cannot be in the future'),
});

export type EntryFormData = z.infer<typeof entryFormSchema>;
