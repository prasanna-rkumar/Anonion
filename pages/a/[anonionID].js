import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState, useEffect, useContext } from 'react'
import { withAuthUser, useAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import admin from '../../utils/db-server'
import firestore from '../../utils/db-client'
import Header from '../../components/Header'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingContext } from '../../context/GlobalLoadingContext'

const DynamicComponentWithCustomLoading = dynamic(
	() => import('../../components/AnswerForm'),
	{ loading: () => <p>...</p> }
)

function AnonionPage({ isOwner, anonion, url }) {
	const router = useRouter()
	const AuthUser = useAuthUser()
	const { setLoading } = useContext(LoadingContext)
	const { anonionID } = router.query
	const [shareURL, setShareURL] = useState("")
	const notify = () => toast("Link Copied!");
	const [message, setMessage] = useState("")
	const [responses, setResponses] = useState([])

	useEffect(() => {
		setLoading(true)
		setShareURL(window.location.href);
		let unsubscribe = firestore.collection("anonions")
			.doc(anonionID)
			.collection("responses")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				setLoading(false)
				if (snapshot.size > 0) {
					var list = snapshot.docs.map((doc) => Object.assign({ ...doc.data(), id: doc.id }))
					setResponses([...list])
				}
			}, (e) => {
				console.log(e)
				setLoading(false)
			})
		return () => {
			unsubscribe()
		}
	}, [])

	useEffect(() => {
		if (AuthUser.firebaseUser != null) {
			setMessage(AuthUser.firebaseUser.displayName + " wants your anonymous opinion")
		}
	}, [AuthUser.firebaseUser])

	return <div className="bg-gray-100 h-screen">
		{anonion == undefined ? <div>404: Not found</div> : <>
			<Head>
				<title>Anonion - {anonion.question}</title>
				<meta property="og:title" content={anonion.question} />
				<meta property="og:url" content={url} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<div className="max-w-screen-xl m-auto px-2">
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<main className="w-11/12 m-auto max-w-screen-xl">
					<div style={{ boxShadow: "0 2px 13px -2px rgb(0 0 0 / 10%)" }} className="bg-white w-full rounded-lg p-4 text-center max-w-screen-md m-auto mb-4">
						<span className="text-4xl font-bold">{anonion.question}</span>
						<div className="flex flex-row justify-center m-3">
							<a href={"https://twitter.com/intent/tweet?text=" + message + "&url=" + shareURL}>
								<img className="w-10 px-2 cursor-pointer" src="/twitter.png" alt="Tweet" />
							</a>
							<CopyToClipboard onCopy={() => notify()} text={shareURL}>
								<img className="w-10 px-2 cursor-pointer" src="/copy.png" alt="Copy" />
							</CopyToClipboard>
						</div>
					</div>
					{isOwner ? responses.length > 0 ? <div className="w-full flex-1 py-1 grid gap-5 items-baseline grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
						{responses.map((value, index) => {
							return <div key={value.id} style={{
								backgroundColor: "#bfd1ec",
								color: "#00327c"
							}} className="text-lg font-medium cursor-pointer rounded-lg shadow-xl float-left p-4">{value.answer}</div>
						})}
					</div>
						: <div className="m-2 text-md text-gray-600 font-semibold">No Answers</div> : <>
						{isOwner ? <></> : <DynamicComponentWithCustomLoading anonionID={anonionID} onSuccess={() => toast.success("Answer sent")} onError={() => toast.error("Something went wrong!")} />}
					</>}
				</main>
				<ToastContainer
					autoClose={2000}
					closeOnClick
					pauseOnFocusLoss={false}
					pauseOnHover={false}
				/>
			</div></>}

	</div>
}

export const getServerSideProps = withAuthUserTokenSSR({
})(async (ctx) => {
	var { query, AuthUser, req, resolvedUrl } = ctx
	var { headers } = req
	var anonion = await admin.firestore()
		.collection("anonions")
		.doc(query.anonionID)
		.get()
		.then(querySnapshot => querySnapshot)
		.catch(e => e)
	var props = {
		isOwner: false,
		url: "https://" + headers.host + resolvedUrl
	}
	if (anonion.data()) {
		props.anonion = anonion.data()
		if (AuthUser && anonion.get("uid") == AuthUser.id) {
			props.isOwner = true
		}
	}
	return { props }
})

export default withAuthUser()(AnonionPage)