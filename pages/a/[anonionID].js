import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { withAuthUser, useAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
import db from '../../utils/db-server'
import firestore from '../../utils/db-client'
import Header from '../../components/Header'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AnonionPage({ isOwner, anonion, responses, displayName, url }) {
	const router = useRouter()
	const AuthUser = useAuthUser()
	const [answer, setAnswer] = useState("")
	const { anonionID } = router.query
	const [shareURL, setShareURL] = useState("")
	const notify = () => toast("Link Copied!");
	const answerSubmittedNotify = () => toast("Answer Sent!")
	const [message, setMessage] = useState("")

	useEffect(() => setShareURL(window.location.href), [])
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
						{isOwner ? responses.length > 0 ? <div style={{
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
							: <div className="m-2 text-md text-gray-600 font-semibold">No Answers</div> : <>
								<textarea placeholder="Send your anonymous message" className="my-4 mt-6" maxLength={128} value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} cols={40} style={{
									borderRadius: 6,
									width: "100%",
									backgroundColor: "#d5feff",
									paddingLeft: 6,
									paddingTop: 2
								}} ></textarea>
								<button className="bg-black text-white border-gray-900 border-2 rounded-full py-1 px-4 hover:shadow-md m-2" onClick={() => {
									const datetime = (new Date()).getTime()
									firestore
										.collection("anonions")
										.doc(anonionID)
										.collection("responses")
										.add({
											answer: answer.substr(0, 128),
											createdAt: datetime,
											updatedAt: datetime,
										}).then((value) => answerSubmittedNotify()).catch(e => window.alert("Error"))
								}}>
									Submit
						</button>
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
	var { query, AuthUser, req, resolvedUrl, res } = ctx
	var { headers, url } = req
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
			props.responses = await db
				.collection("anonions")
				.doc(query.anonionID)
				.collection("responses")
				.orderBy("createdAt", "desc")
				.get()
				.then(querySnapshot => querySnapshot.docs.map(doc => {
					return {
						...doc.data(),
						id: doc.id
					}
				})).catch(e => e)
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
	} else {

	}
	return { props }
})

export default withAuthUser()(AnonionPage)