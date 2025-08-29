

import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, updateDoc, arrayUnion, arrayRemove, where, onSnapshot, deleteDoc, increment, writeBatch, limit } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { saveUser, updateUserInFirestore } from './auth.js';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export const getAllUsers = async () => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const savePdfRequest = async (requestData, user) => {
  if (!user) throw new Error('User must be authenticated to make a request.');

  try {
    await addDoc(collection(db, 'pdfRequests'), {
      ...requestData,
      requesterId: user.uid,
      requesterName: user.displayName,
      requesterEmail: user.email,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving PDF request:', error);
    throw error;
  }
};

export const saveCopyrightRemovalRequest = async (requestData, user) => {
  if (!user) throw new Error('User must be authenticated to make a request.');

  try {
    await addDoc(collection(db, 'copyrightRequests'), {
      ...requestData,
      requesterId: user.uid,
      requesterName: user.displayName,
      requesterEmail: user.email,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving copyright removal request:', error);
    throw error;
  }
};

export const savePdfDocument = async (pdfData, user) => {
  if (!user) throw new Error('User must be authenticated to upload a document.');

  const isAdmin = user.email === ADMIN_EMAIL;
  const authorName = isAdmin ? 'Admin' : user.displayName;


  try {
    await addDoc(collection(db, 'pdfs'), {
      ...pdfData,
      authorId: user.uid,
      authorName: authorName,
      createdAt: serverTimestamp(),
      views: 0,
    });
  } catch (error) {
    console.error('Error saving PDF document to Firestore:', error);
    throw error;
  }
};

export const getPdfs = async () => {
  try {
    const q = query(collection(db, 'pdfs'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const pdfs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pdfs;
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return [];
  }
};

export const getPdfById = async (id) => {
  try {
    const docRef = doc(db, 'pdfs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

export const incrementPdfViewCount = async (pdfId) => {
  if (!pdfId) return;

  const pdfRef = doc(db, 'pdfs', pdfId);
  try {
    // This will reset the view count to 1 for the current view.
    // This is a temporary measure to reset all view counts to 0 over time.
    await updateDoc(pdfRef, {
      views: 1
    });
  } catch (error) {
    if (error.code === 'not-found') {
        // If the document or the 'views' field doesn't exist, create it.
        await setDoc(pdfRef, { views: 1 }, { merge: true });
    } else {
        console.error("Could not set view count:", error.message);
    }
  }
};

export const saveReview = async (reviewData, user) => {
  if (!user) throw new Error('User must be authenticated to leave a review.');

  try {
    await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      reviewerId: user.uid,
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      reviewerPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};

export const getReviews = async () => {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const saveContactSubmission = async (formData, user) => {
  if (!user) throw new Error('User must be authenticated to submit a contact form.');

  try {
    await addDoc(collection(db, 'contactSubmissions'), {
      ...formData,
      senderId: user.uid,
      senderName: user.displayName,
      senderEmail: user.email,
      status: 'new',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  }
};

export const resetAndIncrementVisitorCount = async () => {
  const statsRef = doc(db, 'siteStats', 'visitorCounter');
  try {
    // This logic will effectively reset the counter to 1 for the first visitor of a new session cycle.
    await setDoc(statsRef, { count: 1 });
  } catch (error) {
    console.error('Could not reset and increment visitor count:', error);
  }
};


export const incrementVisitorCount = async () => {
  const statsRef = doc(db, 'siteStats', 'visitorCounter');
  try {
    await updateDoc(statsRef, {
      count: increment(1),
    });
  } catch (error) {
    // If the document doesn't exist, create it.
    if (error.code === 'not-found') {
      await setDoc(statsRef, { count: 1 }); // Start at 1 for the current user
    } else {
      console.error('Could not increment visitor count:', error);
    }
  }
};

export const listenToVisitorCount = (callback) => {
  const statsRef = doc(db, 'siteStats', 'visitorCounter');
  // Return the unsubscribe function to be called on cleanup
  return onSnapshot(statsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().count);
    } else {
      // If the document doesn't exist, you might want to initialize it
      // or handle the state appropriately (e.g., show 0 or a loading state).
       setDoc(statsRef, { count: 0 }); // Starting from a base number
       callback(0);
    }
  }, (error) => {
      console.error('Error listening to visitor count:', error);
  });
};


// Admin-specific functions

export const getAllPdfRequests = async () => {
  try {
    const q = query(collection(db, 'pdfRequests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all PDF requests:", error);
    return [];
  }
};

export const updateRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, 'pdfRequests', requestId);
    await updateDoc(requestRef, { status });
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

export const deletePdf = async (pdfId) => {
  try {
    const pdfRef = doc(db, 'pdfs', pdfId);
    await deleteDoc(pdfRef);
  } catch (error)
  {
    console.error('Error deleting PDF from Firestore:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review from Firestore:', error);
    throw error;
  }
};

export const getAllCopyrightRequests = async () => {
  try {
    const q = query(collection(db, 'copyrightRequests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all copyright requests:", error);
    return [];
  }
};

export const updateCopyrightRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, 'copyrightRequests', requestId);
    await updateDoc(requestRef, { status });
  } catch (error) {
    console.error('Error updating copyright request status:', error);
    throw error;
  }
};

export const getAllContactSubmissions = async () => {
  try {
    const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all contact submissions:", error);
    return [];
  }
};

export const updateContactSubmissionStatus = async (submissionId, status) => {
  try {
    const submissionRef = doc(db, 'contactSubmissions', submissionId);
    await updateDoc(submissionRef, { status });
  } catch (error) {
    console.error('Error updating contact submission status:', error);
    throw error;
  }
};

// Blog Functions
export const saveBlogPost = async (postData, user) => {
  if (!user) throw new Error('User must be authenticated to create a post.');

  try {
    await addDoc(collection(db, 'blogPosts'), {
      ...postData,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
      likes: [],
      views: 0,
      keywords: postData.keywords || '',
    });
  } catch (error) {
    console.error('Error saving blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (postId, postData) => {
  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      ...postData,
      keywords: postData.keywords || '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug) => {
  try {
    const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    throw error;
  }
};

export const deleteBlogPost = async (postId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    
    // Also delete all comments in the subcollection
    const commentsRef = collection(db, 'blogPosts', postId, 'comments');
    const commentsSnapshot = await getDocs(commentsRef);
    
    const batch = writeBatch(db);
    commentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting blog post and its comments:', error);
    throw error;
  }
};

export const likeBlogPost = async (postId, userId) => {
  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikeBlogPost = async (postId, userId) => {
  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const addCommentToPost = async (postId, commentData, user) => {
  if (!user) throw new Error('User must be authenticated to comment.');
  const commentsCollectionRef = collection(db, 'blogPosts', postId, 'comments');
  try {
    await addDoc(commentsCollectionRef, {
      ...commentData,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getCommentsForPost = async (postId) => {
  const commentsCollectionRef = collection(db, 'blogPosts', postId, 'comments');
  try {
    const q = query(commentsCollectionRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};


export const deleteComment = async (postId, commentId) => {
  try {
    const commentRef = doc(db, 'blogPosts', postId, 'comments', commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const getAllCommentsForPost = async (postId) => {
  if (!postId) return [];
  try {
    const commentsRef = collection(db, 'blogPosts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all comments for post:", error);
    return [];
  }
};

export const incrementBlogPostViewCount = async (postId) => {
  if (!postId) return;

  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error("Could not increment blog post view count:", error.message);
  }
};

export const getRelatedBlogPosts = async (currentPostId, authorId) => {
  if (!currentPostId || !authorId) return [];
  try {
    const q = query(
      collection(db, 'blogPosts'),
      where('authorId', '==', authorId),
      where('__name__', '!=', currentPostId), // Exclude the current post
      orderBy('__name__'), // Cannot have inequality on a field used for ordering
      limit(2)
    );
    const querySnapshot = await getDocs(q);
    // As we can't order by date, we'll manually sort them afterwards.
    // This is a Firestore limitation when using inequality filters.
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return [];
  }
};
    
