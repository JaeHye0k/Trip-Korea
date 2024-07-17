import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_KEY,
	authDomain: "trip-korea-cca8a.firebaseapp.com",
	projectId: "trip-korea-cca8a",
	storageBucket: "trip-korea-cca8a.appspot.com",
	messagingSenderId: "943693429967",
	appId: "1:943693429967:web:fa1bfe92c67ff676430bba",
	measurementId: "G-QR3Z9ERLDC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage, analytics };
