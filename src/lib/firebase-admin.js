import admin from 'firebase-admin';

let serviceAccount;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  }
} catch(e) {
  console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', e);
  serviceAccount = undefined;
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
      storageBucket: 'youtubewebsite-8qqtg.appspot.com',
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

const adminAuth = admin.auth;
const adminStorage = admin.storage;
const adminDb = admin.firestore;

export { adminAuth, adminStorage, adminDb };
