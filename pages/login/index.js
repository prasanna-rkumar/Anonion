import { auth } from '../../utils/db-client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { withAuthUser, AuthAction } from 'next-firebase-auth'

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

const LoginPage = () => {
    return <div className="flex flex-col flex-1 justify-center align-middle m-auto  bg-gray-100 h-screen px-2">
        <div className="max-w-xl m-auto">
            <div className="m-auto bg-white w-full rounded-md py-4 px-6 text-center shadow-2xl max-w-md">
                <h3 className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 to-teal-500 font-bold mt-2">Anonion</h3>
                <div className="m-auto mt-6 max-w-xs">
                    <div>
                        <input className="border-gray-400 border-2 rounded-full py-1 px-4 my-1.5 outline-none focus:ring-2 focus:teal-300 focus:border-transparent w-full" type="email" name="email" placeholder="Email" />
                        <input className="border-gray-400 border-2 rounded-full py-1 px-4 my-1.5 outline-none focus:ring-2 focus:teal-300 focus:border-transparent w-full" type="password" name="password" placeholder="Password" />
                        <div className="text-left mt-1"><a href="/">Forgot password</a></div>
                        <button className="rounded-full p-1 mt-3 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold text-lg shadow-md" onClick={() => {

                        }}>
                            Login
                        </button>
                    </div>
                    <div className="relative h-8 flex flex-row items-center mt-1">
                        <hr className="w-full flex-1" />
                        <span className="m-2 relative bottom-0.5 text-lg font-medium text-gray-600">or</span>
                        <hr className="w-full flex-1" />
                    </div>
                    <SocialLoginButton Icon={FcGoogle} label="Continue with Google" provider={GoogleAuthProvider} />
                    <SocialLoginButton Icon={FaGithub} label="Continue with Github" provide={GithubAuthProvider} />
                </div>
            </div>

        </div>
    </div>
}

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(LoginPage)