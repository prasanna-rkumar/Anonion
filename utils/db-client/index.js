import firebase from 'firebase';

const firebaseConfig = {
	apiKey: "AIzaSyBQG4VBeVVSb_FqjJF5PeRxZQEy7Zncj3g",
	authDomain: "anonion-57d06.firebaseapp.com",
	projectId: "anonion-57d06",
	storageBucket: "anonion-57d06.appspot.com",
	messagingSenderId: "1006712752941",
	appId: "1:1006712752941:web:af10af76750642b38361a4",
	measurementId: "G-LV0VD2FXLT"
};

try {
	firebase.initializeApp(firebaseConfig);
} catch (err) {
	if (!/already exists/.test(err.message)) {
		console.error('Firebase initialization error', err.stack)
	}
}
const fire = firebase;
export default fire.firestore();