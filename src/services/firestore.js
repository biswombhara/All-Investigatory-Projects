







import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, updateDoc, arrayUnion, arrayRemove, where, onSnapshot, deleteDoc } from 'firebase/firestore';
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
  } catch (error) {
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
