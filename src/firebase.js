import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "reacttrip-7b060.firebaseapp.com",
  projectId: "reacttrip-7b060",
  storageBucket: "reacttrip-7b060.appspot.com",
  messagingSenderId: "424187112623",
  appId: "1:424187112623:web:21b806ecd46b090dc6b85a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);