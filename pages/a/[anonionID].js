import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { withAuthUser, useAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
import db from '../../utils/db-server'
import firestore from '../../utils/db-client'
import Header from '../../components/Header'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ToastContainer, toast } from 'react-toastify';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const DynamicComponentWithCustomLoading = dynamic(
	() => import('../../components/AnswerForm'),
	{ loading: () => <p>...</p> }
)

function AnonionPage({ isOwner, anonion, displayName, url }) {
	const router = useRouter()
	const AuthUser = useAuthUser()
	const { anonionID } = router.query
	const [shareURL, setShareURL] = useState("")
	const notify = () => toast("Link Copied!");
	const [message, setMessage] = useState("")
	const [responses, setResponses] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setShareURL(window.location.href);
		let unsubscribe = firestore.collection("anonions")
			.doc(anonionID)
			.collection("responses")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				if (loading) setLoading(false)
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
	}, [AuthUser])

	return <div className="bg-gray-100 h-screen">
		{anonion == undefined ? <div>404: Not found</div> : <>
			<Head>
				<title>Anonion - {anonion.question}</title>
				<meta property="og:title" content={anonion.question} />
				<meta property="og:description" content={isOwner ? anonion.question : displayName + " asks " + anonion.question} />
				<meta property="og:url" content={url} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<div className=" max-w-screen-xl m-auto">
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<main className="w-11/12 m-auto max-w-screen-md">
					{isOwner ? <></> : <div className="text-gray-600 text-xl font-medium pb-2 pl-2">{displayName}'s Question</div>}
					<div style={{ boxShadow: "0 2px 13px -2px rgb(0 0 0 / 10%)" }} className="bg-white w-full rounded-lg p-4 text-center">
						<span className="text-4xl font-bold">{anonion.question}</span>
						<div className="flex flex-row justify-center m-3">
							<a href={"https://twitter.com/intent/tweet?text=" + message + "&url=" + shareURL}>
								<img className="w-10 px-2 cursor-pointer" src="/twitter.png" alt="Tweet" />
							</a>
							<CopyToClipboard onCopy={() => notify()} text={shareURL}>
								<img className="w-10 px-2 cursor-pointer" src="/copy.png" alt="Copy" />
							</CopyToClipboard>
						</div>
						{isOwner ?
							<LoadingOverlay>
								{responses.length > 0 ? <div style={{
									width: "100%",
									flex: 1,
									padding: "1rem 0 2rem 0",
									display: "grid",
									gridGap: 20,
									alignItems: "baseline",
									gridTemplateColumns: "repeat(auto-fill,minmax(45%,1fr))"
								}} >
									{responses.map((value, index) => {
										return <div key={value.id} style={{
											backgroundColor: "#bfd1ec",
											color: "#00327c"
										}} className="text-lg font-medium cursor-pointer rounded-lg shadow-xl float-left p-4">{value.answer}</div>
									})}
								</div>
									: <div className="m-2 text-md text-gray-600 font-semibold">No Answers</div>}
								<Loader loading={loading} />
							</LoadingOverlay> : <>
								{isOwner ? <></> : <DynamicComponentWithCustomLoading anonionID={anonionID} onSuccess={() => toast.success("Answer sent to " + displayName)} onError={() => toast.error("Something went wrong!")} />}
							</>}
					</div>
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
	var anonion = await db
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
		} else {
			var user = await db
				.collection('users')
				.doc(anonion.get('uid'))
				.get()
				.then(querySnapshot => querySnapshot)
				.catch(e => e)
			props.displayName = user.get("name")
			console.log(props.displayName)
		}
	}
	return { props }
})

export default withAuthUser()(AnonionPage)