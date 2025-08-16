



import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, updateDoc, arrayUnion, arrayRemove, where, onSnapshot, deleteDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


export const saveUser = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL, uid } = user;
    try {
      await setDoc(userRef, {
        uid,
        displayName,
        email,
        photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving user to Firestore: ", error);
    }
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
    await updateDoc(pdfRef, {
      views: increment(1)
    });
  } catch (error) {
    // It's okay if this fails, e.g., document doesn't exist yet.
    // The main functionality of viewing the PDF shouldn't be blocked.
    console.error("Could not increment view count:", error.message);
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

export const incrementVisitorCount = async () => {
  const statsRef = doc(db, 'siteStats', 'visitorCounter');
  try {
    await updateDoc(statsRef, {
      count: increment(1),
    });
  } catch (error) {
    // If the document doesn't exist, create it.
    if (error.code === 'not-found') {
      await setDoc(statsRef, { count: 12345 }); // Starting from a base number
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
       setDoc(statsRef, { count: 12345 }); // Starting from a base number
       callback(12345);
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

// Blog specific functions
export const saveBlogPost = async (postData, user) => {
  if (!user) throw new Error('User must be authenticated to create a post.');
  try {
    const docRef = await addDoc(collection(db, 'blogPosts'), {
      ...postData,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (postId, postData) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    await updateDoc(postRef, {
      ...postData,
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
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    throw error;
  }
};

export const deleteBlogPost = async (postId) => {
    try {
        const postRef = doc(db, 'blogPosts', postId);
        await deleteDoc(postRef);
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
};
