import { auth } from '../utils/db-client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const GithubAuthProvider = new auth.GithubAuthProvider()
const GoogleAuthProvider = new auth.GoogleAuthProvider()

const socialLogin = (provider) => {
	auth().signInWithRedirect(provider).then(result => console.log(result))
}



const SocialLoginButton = ({ Icon, label, provider }) => {
	return <button className="flex flex-row justify-center items-center border-gray-400 border-2 rounded-full p-1 my-3 w-full" onClick={() => socialLogin(provider)}>
		{Icon ? <div className="w-10">
			<Icon size={24} />
		</div> : ""}
		<div className="text-md font-medium text-gray-600">
			{label}
		</div>
	</button>
}
export default function LoginCard() {

	return (
		<div className="max-w-xl m-auto">
			<div className="m-auto bg-white w-full rounded-md py-4 px-6 text-center shadow-2xl max-w-md">
				<h3 className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 to-teal-500 font-bold mt-2">Anonion</h3>
				<div className="m-auto mt-6 max-w-xs">
					<SocialLoginButton Icon={FcGoogle} label="Continue with Google" provider={GoogleAuthProvider} />
					<SocialLoginButton Icon={FaGithub} label="Continue with Github" provide={GithubAuthProvider} />
				</div>
			</div>

		</div>
	)
}