import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { entryFormSchema } from '@/lib/entry-schema';

/**
 * POST /api/entries
 * Create a new entry
 * 
 * Expected: FormData with image file and form fields
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract fields
    const imageFile = formData.get('image') as File;
    const title = formData.get('title') as string;
    const medium = formData.get('medium') as string;
    const subject = formData.get('subject') as string;
    const mood = formData.get('mood') as string;
    const timeSpent = formData.get('timeSpent') as string;
    const journalNote = formData.get('journalNote') as string;
    const visibility = formData.get('visibility') as string;
    const entryDate = formData.get('entryDate') as string;

    // Create validation data object
    const validationData = {
      image: imageFile,
      title: title || undefined,
      medium,
      subject,
      mood: mood || undefined,
      timeSpent: parseInt(timeSpent),
      journalNote: journalNote || undefined,
      visibility,
      entryDate,
    };

    // Validate with Zod schema
    const validation = entryFormSchema.safeParse(validationData);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // TODO: Upload image to storage service (e.g., AWS S3, Cloudinary, Supabase)
    // For now, we'll just log that we received it
    console.log('Entry submission:', {
      userId,
      title: validation.data.title,
      medium: validation.data.medium,
      subject: validation.data.subject,
      imageSize: imageFile.size,
      visibility: validation.data.visibility,
    });

    // TODO: Save entry to database using Prisma
    // const entry = await prisma.entry.create({
    //   data: {
    //     userId,
    //     title: validation.data.title,
    //     medium: validation.data.medium,
    //     subject: validation.data.subject,
    //     mood: validation.data.mood,
    //     timeSpent: validation.data.timeSpent,
    //     journalNote: validation.data.journalNote,
    //     imageUrl: uploadedImageUrl,
    //     visibility: validation.data.visibility,
    //     entryDate: new Date(validation.data.entryDate),
    //   },
    // });

    return NextResponse.json(
      {
        message: 'Entry created successfully',
        // entry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Entry creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
