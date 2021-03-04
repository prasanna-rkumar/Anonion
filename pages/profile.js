import { withAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
import admin from '../utils/db-server'

const DemoPage = ({ authUser }) => <div>The thing is: {JSON.stringify(authUser)}</div>

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
	// Optionally, get other props.
	admin.firestore().collection("users").doc(AuthUser.id).get().then(value => console.log(value.get("name")))
	return {
		props: {
			authUser: {
				id: AuthUser.id,
				email: AuthUser.email
			}
		}
	}
})

export default withAuthUser()(DemoPage)