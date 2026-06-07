import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { WebhookEvent } from '@clerk/nextjs/server';

/**
 * Webhook endpoint for Clerk user events
 * Handles user.created and user.deleted events
 * 
 * POST /api/webhooks/clerk
 */
export async function POST(req: Request) {
  try {
    // Get webhook signature from headers
    const headerPayload = headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    // Verify webhook signature
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing webhook headers', { status: 400 });
    }

    const body = await req.text();
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const wh = new Webhook(secret);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return new Response('Webhook verification failed', { status: 400 });
    }

    // Handle user.created event
    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url, profile_image_url } = evt.data;

      if (!id || !email_addresses || email_addresses.length === 0) {
        console.error('Invalid user data in webhook:', evt.data);
        return new Response('Invalid user data', { status: 400 });
      }

      const primaryEmail = email_addresses[0]?.email_address;
      if (!primaryEmail) {
        console.error('No primary email found for user:', id);
        return new Response('No primary email found', { status: 400 });
      }

      // Create username from email (sanitize it)
      const username = primaryEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');

      try {
        const newUser = await prisma.user.create({
          data: {
            clerkId: id,
            username: username,
            displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || 'User',
            avatarUrl: image_url || profile_image_url || null,
            isPublic: true,
            currentStreak: 0,
            longestStreak: 0,
          },
        });

        console.log('User created in database:', newUser.id);
        return new Response('User created successfully', { status: 201 });
      } catch (error: any) {
        if (error.code === 'P2002') {
          // Unique constraint violation (username or clerkId already exists)
          console.warn('User already exists:', error.meta?.target);
          return new Response('User already exists', { status: 409 });
        }
        throw error;
      }
    }

    // Handle user.updated event (optional - to sync profile changes)
    if (evt.type === 'user.updated') {
      const { id, first_name, last_name, image_url, profile_image_url } = evt.data;

      if (!id) {
        return new Response('Invalid user data', { status: 400 });
      }

      try {
        const updatedUser = await prisma.user.update({
          where: { clerkId: id },
          data: {
            displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || undefined,
            avatarUrl: image_url || profile_image_url || undefined,
          },
        });

        console.log('User updated in database:', updatedUser.id);
        return new Response('User updated successfully', { status: 200 });
      } catch (error: any) {
        if (error.code === 'P2025') {
          // User not found
          console.warn('User not found for update:', id);
          return new Response('User not found', { status: 404 });
        }
        throw error;
      }
    }

    // Handle user.deleted event
    if (evt.type === 'user.deleted') {
      const { id } = evt.data;

      if (!id) {
        return new Response('Invalid user data', { status: 400 });
      }

      try {
        const deletedUser = await prisma.user.delete({
          where: { clerkId: id },
        });

        console.log('User deleted from database:', deletedUser.id);
        return new Response('User deleted successfully', { status: 200 });
      } catch (error: any) {
        if (error.code === 'P2025') {
          // User not found
          console.warn('User not found for deletion:', id);
          return new Response('User not found', { status: 404 });
        }
        throw error;
      }
    }

    // Ignore other event types
    return new Response('Event type not handled', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
