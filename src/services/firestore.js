

import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, updateDoc, arrayUnion, arrayRemove, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

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

  try {
    await addDoc(collection(db, 'pdfs'), {
      ...pdfData,
      authorId: user.uid,
      authorName: user.displayName,
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

// --- Blog Functions ---

export const createBlogPost = async (postData, user) => {
  if (!user) throw new Error('User must be authenticated to create a post.');
  
  try {
    const postRef = await addDoc(collection(db, 'posts'), {
      title: postData.title,
      body: postData.body,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
      likes: [],
      commentCount: 0,
    });
    return postRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};


export const getBlogPost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const addComment = async (postId, commentText, user) => {
  if (!user) throw new Error('User must be authenticated to comment.');
  try {
    // Add the comment to the 'comments' subcollection
    const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
      text: commentText,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhotoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });
    
    // Update the comment count on the parent post document
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    const currentCount = postSnap.data().commentCount || 0;
    await updateDoc(postRef, {
      commentCount: currentCount + 1,
    });

    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = (postId, callback) => {
    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
    
    // Use onSnapshot for real-time updates
    return onSnapshot(q, (querySnapshot) => {
      const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(comments);
    }, (error) => {
      console.error("Error fetching comments in real-time:", error);
    });
};

export const toggleLike = async (postId, userId) => {
  if (!userId) throw new Error('User must be authenticated to like a post.');

  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data();
    if (postData.likes.includes(userId)) {
      // User has already liked, so unlike
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    } else {
      // User has not liked, so like
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
    }
  } else {
    throw new Error("Post not found");
  }
};
