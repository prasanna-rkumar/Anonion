import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Head from 'next/head'
import LoginCard from '../../components/LoginCard'

const LoginPage = () => {
	return <div className="flex flex-col flex-1 justify-center align-middle m-auto  bg-gray-100 h-screen px-2">
		<Head>
			<title>Anonion - Login</title>
		</Head>
		<LoginCard />
	</div>
}

export default withAuthUser({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
	whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
	whenUnauthedAfterInit: AuthAction.RENDER,
})(LoginPage)