'use server';

import { doc, increment, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function incrementBlogPostView(postId) {
  if (!postId) return { success: false, error: 'Post ID is required.' };

  const postRef = doc(db, 'blogPosts', postId);

  try {
    // We use updateDoc which will fail if the document doesn't exist.
    // A more robust approach might use a transaction to get and update.
    await updateDoc(postRef, {
      views: increment(1),
    });
    return { success: true };
  } catch (error) {
    // If the document doesn't exist or doesn't have a 'views' field,
    // we can try to set it. This makes it more resilient.
    if (error.code === 'not-found') {
        try {
            await setDoc(postRef, { views: 1 }, { merge: true });
            return { success: true };
        } catch (set_error) {
             console.error("Could not set blog post view count:", set_error.message);
             return { success: false, error: set_error.message };
        }
    }
    console.error('Could not increment blog post view count:', error.message);
    return { success: false, error: error.message };
  }
}
