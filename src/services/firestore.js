
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, updateDoc, arrayUnion, arrayRemove, where, onSnapshot, deleteDoc, increment, writeBatch, limit, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

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

  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const baseSlug = generateSlug(pdfData.title);
  let finalSlug = baseSlug;
  let counter = 2;
  
  while (true) {
    const docRef = doc(db, 'pdfs', finalSlug);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      break;
    }
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  const docRef = doc(db, 'pdfs', finalSlug);

  try {
    await setDoc(docRef, {
      ...pdfData,
      slug: finalSlug,
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
    if (error.code === 'not-found') {
        await setDoc(pdfRef, { views: 1 }, { merge: true });
    } else {
        console.error("Could not increment view count:", error.message);
    }
  }
};

export const incrementBlogPostView = async (postId) => {
  if (!postId) return;

  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      views: increment(1)
    });
  } catch (error) {
    if (error.code === 'not-found') {
        await setDoc(postRef, { views: 1 }, { merge: true });
    } else {
        console.error("Could not increment blog post view count:", error.message);
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

export const incrementVisitorCount = async () => {
  const statsRef = doc(db, 'siteStats', 'visitorCounter');
  try {
    await updateDoc(statsRef, {
      count: increment(1),
    });
  } catch (error) {
    if (error.code === 'not-found') {
      await setDoc(statsRef, { count: 1 });
    } else {
      console.error('Could not increment visitor count:', error);
    }
  }
};

export const listenToVisitorCount = (callback) => {
  const statsRef = doc(db, 'siteStats', 'visitorCounter');
  return onSnapshot(statsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().count);
    } else {
       setDoc(statsRef, { count: 0 });
       callback(0);
    }
  }, (error) => {
      console.error('Error listening to visitor count:', error);
  });
};

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

export const likeBlogPost = async (postId, likerId) => {
  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      likes: arrayUnion(likerId),
    });
  } catch (error) {
     if (error.code === 'invalid-argument' || error.message.includes('arrayUnion')) {
        await setDoc(postRef, { likes: [likerId] }, { merge: true });
     } else {
        console.error('Error liking post:', error);
        throw error;
     }
  }
};

export const unlikeBlogPost = async (postId, likerId) => {
  const postRef = doc(db, 'blogPosts', postId);
  try {
    await updateDoc(postRef, {
      likes: arrayRemove(likerId),
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const addCommentToPost = async (postId, commentData, author) => {
  const commentsCollectionRef = collection(db, 'blogPosts', postId, 'comments');
  const authorDetails = author.uid
    ? {
        authorId: author.uid,
        authorName: author.displayName,
        authorPhotoURL: author.photoURL,
      }
    : {
        authorName: author.authorName,
      };

  if (!authorDetails.authorName) {
    throw new Error('Author name is required to comment.');
  }

  try {
    await addDoc(commentsCollectionRef, {
      ...commentData,
      ...authorDetails,
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

export const getRelatedBlogPosts = async (currentPostId, authorId) => {
  if (!currentPostId || !authorId) return [];
  try {
    const q = query(
      collection(db, 'blogPosts'),
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(post => post.id !== currentPostId)
      .slice(0, 2);
    return posts;
  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return [];
  }
};

export const seedHighTrafficBlogs = async () => {
  const blogs = [
    {
      title: "AI in Education: Transforming the Classroom in 2026",
      description: "Artificial Intelligence is no longer a futuristic concept; it's the engine driving a revolution in education. By 2026, personalized learning paths and AI tutors will be standard in classrooms worldwide.",
      coverImage: "https://picsum.photos/seed/ai-edu/1200/630",
      slug: "ai-in-education-2026",
      keywords: "AI, education, future, learning, 2026",
      date: new Date('2025-09-15')
    },
    {
      title: "The Future of Healthcare: Telemedicine and Personal AI Assistants",
      description: "Healthcare is becoming more accessible and efficient thanks to AI. Discover how personal health assistants will monitor our vitals in real-time by 2026.",
      coverImage: "https://picsum.photos/seed/healthcare/1200/630",
      slug: "future-of-healthcare-2026",
      keywords: "healthcare, AI, telemedicine, medicine",
      date: new Date('2025-10-20')
    },
    {
      title: "Top 5 Careers for 2026: Why Data Science is Still King",
      description: "As industries digitize, the demand for data literacy is sky-high. We analyze the top job markets to watch as we head into 2026.",
      coverImage: "https://picsum.photos/seed/careers/1200/630",
      slug: "top-careers-2026",
      keywords: "careers, data science, jobs, 2026, technology",
      date: new Date('2025-11-05')
    },
    {
      title: "Mental Health in the Digital Age: Strategies for Students",
      description: "Balancing screen time and study time is crucial. We explore practical strategies for students to maintain mental well-being in an always-connected world.",
      coverImage: "https://picsum.photos/seed/mentalhealth/1200/630",
      slug: "mental-health-students",
      keywords: "mental health, students, digital age, well-being",
      date: new Date('2025-12-12')
    },
    {
      title: "Sustainable Energy: The Breakthroughs Powering Our Future",
      description: "From solid-state batteries to fusion energy experiments, the path to a green 2026 is clearer than ever.",
      coverImage: "https://picsum.photos/seed/energy/1200/630",
      slug: "sustainable-energy-breakthroughs",
      keywords: "sustainability, energy, green tech, climate",
      date: new Date('2026-01-18')
    },
    {
      title: "Quantum Computing for Beginners: What You Need to Know",
      description: "Quantum computing is complex but transformative. Here's a plain-english guide to the technology that will redefine processing power by 2026.",
      coverImage: "https://picsum.photos/seed/quantum/1200/630",
      slug: "quantum-computing-guide",
      keywords: "quantum computing, technology, guide, processing",
      date: new Date('2026-02-25')
    },
    {
      title: "The Gig Economy in 2026: How to Thrive as a Freelancer",
      description: "Freelancing is the new normal for millions. Learn the tools and mindsets needed to succeed in the decentralized workforce of 2026.",
      coverImage: "https://picsum.photos/seed/gig/1200/630",
      slug: "gig-economy-2026",
      keywords: "freelancing, gig economy, work, 2026",
      date: new Date('2026-03-10')
    },
    {
      title: "Biotechnology: Revolutionizing Medicine and Agriculture",
      description: "CRISPR and mRNA tech are just the beginning. 2026 will see breakthroughs in drought-resistant crops and personalized cancer treatments.",
      coverImage: "https://picsum.photos/seed/bio/1200/630",
      slug: "biotech-revolution-2026",
      keywords: "biotechnology, medicine, agriculture, science",
      date: new Date('2026-04-05')
    },
    {
      title: "Space Exploration: The Next Decade of Lunar Missions",
      description: "Humanity is heading back to the Moon. We look at the upcoming Artemis missions and the goal of a sustainable lunar base by 2030.",
      coverImage: "https://picsum.photos/seed/space/1200/630",
      slug: "space-exploration-lunar",
      keywords: "space, NASA, moon, exploration, future",
      date: new Date('2025-09-30')
    },
    {
      title: "Cybersecurity Essentials: Protecting Your Data in 2026",
      description: "As AI-driven attacks rise, personal data protection is paramount. Here are the top 5 tools you need to stay safe online in 2026.",
      coverImage: "https://picsum.photos/seed/cyber/1200/630",
      slug: "cybersecurity-2026-essentials",
      keywords: "cybersecurity, data protection, security, AI",
      date: new Date('2025-10-10')
    }
  ];

  const batch = writeBatch(db);
  blogs.forEach((blog) => {
    const postRef = doc(collection(db, 'blogPosts'));
    batch.set(postRef, {
      title: blog.title,
      description: blog.description,
      coverImage: blog.coverImage,
      slug: blog.slug,
      keywords: blog.keywords,
      authorId: "seed-admin-id",
      authorName: "Admin",
      authorEmail: "allinvestigatoryprojects@gmail.com",
      authorPhotoURL: "https://yt3.googleusercontent.com/4bUuIDk_BIXQEWPFuYoXGKd94hhTXLW6jrJDynplZD8vNIlPuvo6TiibXVJcsAAKdKQZsOMRtw=s160-c-k-c0x00ffffff-no-rj",
      createdAt: Timestamp.fromDate(blog.date),
      likes: [],
      views: Math.floor(Math.random() * 500) + 100
    });
  });

  await batch.commit();
};
