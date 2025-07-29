import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "youtubewebsite-8qqtg",
  "appId": "1:445458515370:web:4b4a458b36b46198a257d3",
  "storageBucket": "youtubewebsite-8qqtg.firebasestorage.app",
  "apiKey": "AIzaSyCdGQZ3T5LZHmgriUUeJKgXoT5PzwsY-BY",
  "authDomain": "website-8qqtg.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "445458515370"
};

// Initialize Firebase for the client
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);


export {
  app,
  auth,
  storage,
  db
};
