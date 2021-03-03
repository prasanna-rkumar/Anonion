import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import firestore from '../utils/db-client'

// Note that next-firebase-auth inits Firebase for us,
// so we don't need to.

const firebaseAuthConfig = {
	signInFlow: 'popup',
	// Auth providers
	// https://github.com/firebase/firebaseui-web#configure-oauth-providers
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: true,
		},
	],
	signInSuccessUrl: '/',
	credentialHelper: 'none',
	callbacks: {
		// https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
		signInSuccessWithAuthResult: (authResult, redirectUrl) => {
			firestore
				.collection('users')
				.doc(authResult.user.uid)
				.set({
					name: authResult.user.displayName,
					email: authResult.user.email
				}, { merge: true })
				.then(value => console.log("success"))
				.catch(err => console.log(err))
				.finally(() => console.log("finally"))
			return false;
		},
	},
}

const FirebaseAuth = () => {
	// Do not SSR FirebaseUI, because it is not supported.
	// https://github.com/firebase/firebaseui-web/issues/213
	const [renderAuth, setRenderAuth] = useState(false)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setRenderAuth(true)
		}
	}, [])
	return (
		<div>
			{renderAuth ? (
				<StyledFirebaseAuth
					uiConfig={firebaseAuthConfig}
					firebaseAuth={firebase.auth()}
				/>
			) : null}
		</div>
	)
}

export default FirebaseAuth