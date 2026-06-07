# Entry Form - Complete Reference

Quick overview of all files for the entry creation form with React Hook Form and Zod validation.

## 📋 Files Overview

### New Files (4)

1. **lib/entry-schema.ts** - Zod validation schema
2. **components/forms/EntryForm.tsx** - React Hook Form component
3. **app/api/entries/route.ts** - API endpoint for form submission
4. **ENTRY_FORM_SETUP.md** - Complete documentation

### Updated Files (2)

1. **package.json** - Added react-hook-form, zod, @hookform/resolvers
2. **app/(dashboard)/entries/new/page.tsx** - Updated to use EntryForm

---

## 🎯 Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Image | File | ✅ Yes | JPG/PNG/WebP, max 10MB |
| Title | Text | ❌ No | Max 200 chars |
| Medium | Select | ✅ Yes | 6 options |
| Subject | Select | ✅ Yes | 7 options |
| Mood | Text | ❌ No | Max 100 chars |
| Time Spent | Number | ✅ Yes | 0-1440 minutes |
| Journal Note | Textarea | ❌ No | Max 500 chars, counter |
| Visibility | Select | ✅ Yes | private/public |
| Entry Date | Date | ✅ Yes | Cannot be future |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Visit form
# http://localhost:3000/entries/new
```

---

## 📱 Form Layout

### Desktop (md+)
- 2-column grids for fields
- Image upload takes full width
- All sections in white cards

### Mobile
- Single column layout
- Touch-friendly spacing
- Full-width inputs

---

## ✨ Features

✅ **Image Upload**
- Click to upload button with dashed border
- Visual preview after selection
- Remove button (X) to replace
- File type and size validation

✅ **Live Character Counter**
- Shows "X/500" in journal note field
- Updates as user types
- Prevents exceeding 500 characters

✅ **Validation**
- Client-side with Zod (immediate feedback)
- Server-side re-validation
- Inline error messages in red
- Custom error messages for each field

✅ **Default Values**
- Entry date defaults to today
- Medium defaults to "pencil"
- Subject defaults to "portrait"
- Visibility defaults to "private"

✅ **Accessibility**
- Proper labels for all inputs
- Error messages linked to fields
- Required indicators (*)
- Form-friendly tab order

---

## 📊 Form State Management

Uses React Hook Form with:
- `mode: 'onBlur'` - Validates when field loses focus
- `zodResolver` - Connects Zod schema to form
- `watch` - Tracks journal note for character count
- `resetField` - Clears image when removed
- `register` - Connects inputs to form state

---

## 🛡️ Validation Examples

### Image Errors
```
"Image must be less than 10MB"
"Only JPG, PNG, and WebP images are allowed"
```

### Time Spent Errors
```
"Time spent must be a whole number"
"Time spent must be at least 0 minutes"
"Time spent cannot exceed 24 hours (1440 minutes)"
```

### Date Errors
```
"Invalid date"
"Entry date cannot be in the future"
```

---

## 🔌 API Endpoint

**POST** `/api/entries`

**Request**: FormData with all form fields

**Response Success** (201):
```json
{
  "message": "Entry created successfully"
}
```

**Response Error** (400):
```json
{
  "error": "Validation failed",
  "issues": [
    { "code": "too_small", "path": ["timeSpent"], "message": "..." }
  ]
}
```

---

## 🎨 Color Scheme

- **Backgrounds**: stone-50, white
- **Borders**: stone-200
- **Text**: stone-900, stone-600
- **Focus**: stone-900 ring
- **Errors**: red-600
- **Buttons**: stone-900 (hover: stone-800)

---

## 💾 Dependencies

```json
{
  "react-hook-form": "^7.48.0",      // Form state
  "zod": "^3.22.4",                  // Validation
  "@hookform/resolvers": "^3.3.4"    // Integration
}
```

---

## 🧪 Test Scenarios

### 1. Upload Image
- ✅ Valid JPG/PNG/WebP → shows preview
- ❌ Wrong format → error message
- ❌ >10MB → error message

### 2. Character Counter
- ✅ Type in journal note → counter updates
- ✅ Type past 500 → input stops accepting

### 3. Date Validation
- ✅ Select today → accepted
- ❌ Select future date → error

### 4. Required Fields
- ❌ Submit without image → error
- ❌ Submit without medium → error
- ❌ Submit without subject → error

### 5. Optional Fields
- ✅ Leave title blank → accepted
- ✅ Leave mood blank → accepted
- ✅ Leave journal note blank → accepted

---

## 🚦 Next Steps

1. **Image Storage** - Implement AWS S3, Cloudinary, or Supabase upload
2. **Database** - Add Entry model to Prisma schema
3. **API Handler** - Implement actual database save in POST endpoint
4. **Redirect** - Send user to gallery after successful save
5. **Toast** - Show success/error notification
6. **Gallery** - Display entries after creation

---

## 📖 Documentation

- **ENTRY_FORM_SETUP.md** - Comprehensive guide with code examples
- **This file** - Quick reference
- **lib/entry-schema.ts** - Validation rules explained in comments
- **components/forms/EntryForm.tsx** - Component features documented

---

## ✅ Checklist

- [x] React Hook Form installed
- [x] Zod installed
- [x] Validation schema created
- [x] Form component built
- [x] Image upload with preview
- [x] Character counter
- [x] Inline error messages
- [x] Default values
- [x] API endpoint created
- [x] Entry page updated
- [x] Documentation complete
- [ ] Image storage integration (TODO)
- [ ] Database integration (TODO)
- [ ] Success notification (TODO)
- [ ] Gallery display (TODO)

---

**Status**: ✅ Ready to Use  
**Files**: 4 NEW, 2 UPDATED  
**Total Size**: ~500 lines  
**Last Updated**: 2026-06-08
