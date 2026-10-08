import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidatePath } from 'next/cache';

function invalidate() {
  try {
    // Only public pages use ISR; the authenticated CMS and APIs remain dynamic.
    revalidatePath('/', 'layout');
  } catch (error) {
    // Import/maintenance scripts run outside a Next request. Their changes are
    // still picked up by the hourly public cache expiry. Normal CMS saves
    // invalidate immediately here instead of repeatedly rebuilding unchanged
    // public pages while their static assets are being delivered.
    if (error instanceof Error && /static generation store missing|work store missing/i.test(error.message)) return;
    throw error;
  }
}

export const publicContentChanged: CollectionAfterChangeHook = ({ doc }) => { invalidate(); return doc; };
export const publicContentDeleted: CollectionAfterDeleteHook = ({ doc }) => { invalidate(); return doc; };
