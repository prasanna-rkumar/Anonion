// ./initAuth.js
import { init } from 'next-firebase-auth'
import { env } from 'process'

const initAuth = () => {
	init({
		authPageURL: '/login',
		appPageURL: '/',
		loginAPIEndpoint: '/api/login', // required
		logoutAPIEndpoint: '/api/logout', // required
		// Required in most cases.
		firebaseAdminInitConfig: {
			credential: {
				projectId: "anonion-57d06",
				clientEmail: 'firebase-adminsdk-b6a3c@anonion-57d06.iam.gserviceaccount.com',
				// The private key must not be accesssible on the client side.
				privateKey: process.env.FIREBASE_PRIVATE_KEY
				? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
				: undefined,
			},
		},
		firebaseClientInitConfig: {
			apiKey: "AIzaSyBQG4VBeVVSb_FqjJF5PeRxZQEy7Zncj3g",
			authDomain: "anonion-57d06.firebaseapp.com",
			projectId: "anonion-57d06",
			storageBucket: "anonion-57d06.appspot.com",
			messagingSenderId: "1006712752941",
			appId: "1:1006712752941:web:af10af76750642b38361a4",
			measurementId: "G-LV0VD2FXLT"
		},
		cookies: {
			name: 'Anonion', // required
			// Keys are required unless you set `signed` to `false`.
			// The keys cannot be accessible on the client side.
			httpOnly: true,
			maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
			overwrite: true,
			path: '/',
			sameSite: 'strict',
			secure: false, // set this to false in local (non-HTTPS) development
			signed: false,
		},
	})
}

export default initAuth