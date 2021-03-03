import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyBQG4VBeVVSb_FqjJF5PeRxZQEy7Zncj3g",
	authDomain: "anonion-57d06.firebaseapp.com",
	projectId: "anonion-57d06",
	storageBucket: "anonion-57d06.appspot.com",
	messagingSenderId: "1006712752941",
	appId: "1:1006712752941:web:af10af76750642b38361a4",
	measurementId: "G-LV0VD2FXLT"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = firebase.auth;
const db = firebase.firestore();
const now = firebase.firestore.Timestamp.now();
export { auth, db, now };
export default db;
console.log(app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(');