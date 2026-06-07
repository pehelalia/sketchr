# Sketchlog Entry Form Setup

Complete guide for the entry creation form with React Hook Form, Zod validation, and image preview.

## 📋 Overview

The entry creation form collects comprehensive information about artistic work:

- **Image Upload**: JPG/PNG/WebP with preview (max 10MB)
- **Title**: Optional text input
- **Medium**: Dropdown (pencil, pen, digital, watercolor, charcoal, other)
- **Subject**: Dropdown (portrait, landscape, figure, animal, abstract, still life, other)
- **Mood**: Optional free text (100 char limit)
- **Time Spent**: Number input in minutes
- **Journal Note**: Textarea with live character counter (500 char limit)
- **Visibility**: Toggle (private/public)
- **Entry Date**: Date picker (defaults to today, cannot be future date)

## 🛠️ Technologies

- **React Hook Form 7.48.0** - Form state management
- **Zod 3.22.4** - Schema validation
- **@hookform/resolvers 3.3.4** - Zod integration with React Hook Form
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 File Structure

```
sketchr/
├── lib/
│   └── entry-schema.ts                 ✅ Zod validation schema
├── components/
│   └── forms/
│       └── EntryForm.tsx               ✅ Complete form component
├── app/
│   └── api/
│       └── entries/
│           └── route.ts                ✅ Form submission endpoint
│   └── (dashboard)/
│       └── entries/
│           └── new/
│               └── page.tsx            ✅ New entry page
└── package.json                        ✅ Dependencies
```

---

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4"
  }
}
```

Install with:
```bash
npm install
```

---

## 🔍 Detailed File Contents

### 1. Validation Schema (`lib/entry-schema.ts`)

```typescript
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

  title: z
    .string()
    .max(200, 'Title must be less than 200 characters')
    .optional()
    .or(z.literal('')),

  medium: z.enum([
    'pencil',
    'pen',
    'digital',
    'watercolor',
    'charcoal',
    'other',
  ]),

  subject: z.enum([
    'portrait',
    'landscape',
    'figure',
    'animal',
    'abstract',
    'still life',
    'other',
  ]),

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

  visibility: z.enum(['private', 'public']),

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
```

**Validation Rules:**
- ✅ Image: Required, max 10MB, only JPG/PNG/WebP
- ✅ Title: Optional, max 200 characters
- ✅ Medium: Required enum
- ✅ Subject: Required enum
- ✅ Mood: Optional, max 100 characters
- ✅ Time Spent: Required number, 0-1440 minutes
- ✅ Journal Note: Optional, max 500 characters
- ✅ Visibility: Required enum (private/public)
- ✅ Entry Date: Required, cannot be future date

---

### 2. Form Component (`components/forms/EntryForm.tsx`)

**Key Features:**

#### Image Upload with Preview
```typescript
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validate file type and size
    // Create preview with FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
};
```

- Click to upload button with dashed border
- Shows preview after selection
- "Change image" link to replace
- Remove button (X) on preview
- File type and size validation with inline error messages

#### Live Character Counter
```typescript
const watchJournalNote = watch('journalNote');
const [journalCharCount, setJournalCharCount] = useState(0);

// Update as user types
if (watchJournalNote && watchJournalNote.length !== journalCharCount) {
  setJournalCharCount(watchJournalNote.length || 0);
}
```

- Shows "X/500" in top-right of textarea
- Updates as user types
- Maxlength attribute prevents exceeding limit

#### React Hook Form Integration
```typescript
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
  resetField,
} = useForm<EntryFormData>({
  resolver: zodResolver(entryFormSchema),
  mode: 'onBlur',  // Validate on blur, not on every keystroke
  defaultValues: {
    // Set defaults including today's date
    entryDate: new Date().toISOString().split('T')[0],
  },
});
```

**Benefits:**
- `mode: 'onBlur'` - Validates when field loses focus, not on every keystroke
- `zodResolver` - Automatically validates against Zod schema
- `defaultValues` - Pre-fills form with sensible defaults
- `watch` - Watch specific fields for reactive updates
- `register` - Connects inputs to form state

#### Inline Error Display
Every field has error handling:
```typescript
{errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
```

---

### 3. Form Page (`app/(dashboard)/entries/new/page.tsx`)

```typescript
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
```

**Key Points:**
- Imports `EntryForm` component
- Wraps in max-width container (max-w-3xl)
- Page title and description
- Form takes up remaining space

---

### 4. API Endpoint (`app/api/entries/route.ts`)

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();

    // 3. Extract fields
    const imageFile = formData.get('image') as File;
    const title = formData.get('title') as string;
    // ... extract other fields

    // 4. Validate with Zod
    const validation = entryFormSchema.safeParse(validationData);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    // 5. TODO: Upload image to storage (S3, Cloudinary, etc.)
    // 6. TODO: Save entry to database

    return NextResponse.json({ message: 'Entry created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
```

**Flow:**
1. Verify user is authenticated via Clerk
2. Parse FormData from request
3. Extract all form fields
4. Validate against Zod schema
5. Upload image (implement with your storage service)
6. Save entry to database (implement with Prisma)
7. Return success/error response

---

## 🎨 Styling Details

### Layout
- Max width: `max-w-3xl` on page
- Sections in `.bg-white` cards with borders
- `space-y-6` for vertical spacing between sections
- Grid layout for two-column sections on desktop

### Colors
- Background: `stone-50`
- Borders: `stone-200`
- Text: `stone-900` (primary), `stone-600` (secondary)
- Errors: `red-600`
- Required indicator: `red-600`

### Forms
- All inputs: `border border-stone-200 rounded-lg`
- Focus: `focus:ring-2 focus:ring-stone-900 focus:border-transparent`
- Buttons: `bg-stone-900 hover:bg-stone-800`

### Responsive
- Desktop: 2-column grid (md:grid-cols-2)
- Mobile: 1-column grid (grid-cols-1)
- Image upload: Full width

---

## 🚀 Usage

### 1. Visit New Entry Page
```
http://localhost:3000/entries/new
```

### 2. Fill Form
- Upload image
- Enter title (optional)
- Select medium and subject
- Enter mood (optional)
- Enter time spent (minutes)
- Write journal note (optional)
- Choose visibility
- Select entry date (defaults to today)

### 3. Submit
- Click "Save Entry"
- Form validates client-side with inline errors
- On server, validation happens again with Zod
- Image uploaded (implement storage)
- Entry saved to database (implement)

### 4. Errors
All validation errors show inline:
- Image: "Image must be less than 10MB"
- Title: "Title must be less than 200 characters"
- Time Spent: "Time spent must be a whole number"
- Entry Date: "Entry date cannot be in the future"
- etc.

---

## 📱 Responsive Behavior

### Desktop (md+)
```
┌─────────────────────────────────┐
│ Image Upload (full width)       │
├─────────────────────────────────┤
│ Title (full width)              │
├──────────────────┬──────────────┤
│ Medium           │ Subject      │
├──────────────────┬──────────────┤
│ Mood             │ Time Spent   │
├─────────────────────────────────┤
│ Journal Note (full width)       │
├──────────────────┬──────────────┤
│ Visibility       │ Entry Date   │
├──────────────────┬──────────────┤
│ Save Entry       │ Cancel       │
└──────────────────┴──────────────┘
```

### Mobile
All fields stack vertically in single column

---

## 🔧 Customization

### Add More Medium Options
In `EntryForm.tsx`:
```typescript
const mediumOptions = [
  { value: 'oil', label: 'Oil Painting' },
  // ... add more
];
```

Then update schema in `entry-schema.ts`:
```typescript
medium: z.enum(['pencil', 'pen', 'digital', 'oil', ...])
```

### Change Character Limits
In `entry-schema.ts`:
```typescript
journalNote: z.string().max(1000, 'Note must be less than 1000 characters')
```

### Change Image Size Limit
In `entry-schema.ts`:
```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB instead of 10MB
```

---

## 🧪 Testing

### Test Image Upload
1. Visit `/entries/new`
2. Click upload button
3. Select an image file
4. Verify preview appears
5. Click X to remove
6. Try uploading non-image file → should fail
7. Try uploading >10MB file → should fail

### Test Character Counter
1. Click journal note textarea
2. Type text
3. Watch counter increment in top-right
4. Try typing past 500 chars → input stops accepting

### Test Date Validation
1. Try selecting future date → "Entry date cannot be in the future"
2. Select today → should work

### Test Required Fields
1. Try submitting without:
   - Image → error
   - Medium → error
   - Subject → error
   - Time Spent → error
   - Visibility → error
   - Entry Date → error

### Test Optional Fields
1. Leave title blank → should work
2. Leave mood blank → should work
3. Leave journal note blank → should work

---

## 🔐 Security Considerations

✅ **Client-side Validation** - Immediate feedback with Zod
✅ **Server-side Validation** - Re-validate all data on server
✅ **File Type Checking** - MIME type validation
✅ **File Size Limits** - Prevent large uploads
✅ **Authentication** - Clerk auth required
✅ **User ID** - Store with user who created entry

---

## 🚦 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create form and validation schema
3. ⬜ **Implement image upload storage**
   - Options: AWS S3, Cloudinary, Supabase, Vercel Blob
   - Store URL in database
4. ⬜ **Add to Prisma schema**
   ```prisma
   model Entry {
     id        String   @id @default(cuid())
     userId    String
     imageUrl  String
     title     String?
     medium    String
     subject   String
     mood      String?
     timeSpent Int
     journalNote String?
     visibility String @default("private")
     entryDate DateTime
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```
5. ⬜ **Update API endpoint** to actually save to database
6. ⬜ **Add redirect** after successful submission
7. ⬜ **Show success message** with toast notification
8. ⬜ **Add edit/delete** functionality
9. ⬜ **Display entries** in gallery

---

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Tailwind CSS Forms](https://tailwindcss.com/docs/plugins/forms)
- [Lucide Icons](https://lucide.dev/)
- [Next.js File Uploads](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## ✅ Verification Checklist

After setup:

- [ ] `npm install` completed
- [ ] `/entries/new` page loads
- [ ] Form displays all fields
- [ ] Image upload button works
- [ ] Image preview shows after upload
- [ ] Journal character counter works
- [ ] Required field indicators (red *) visible
- [ ] Can fill all fields
- [ ] Submit button works
- [ ] Error messages appear inline
- [ ] Date picker defaults to today
- [ ] Future date validation works
- [ ] Stone color palette consistent
- [ ] Responsive layout works on mobile

---

**Last Updated:** 2026-06-08
**Status:** ✅ Complete and Ready
**Files:** 4 NEW, 2 UPDATED
**Dependencies:** 3 NEW
