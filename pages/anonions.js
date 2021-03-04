import Header from '../components/Header'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import firestore from '../utils/db-client'
import db from '../utils/db-server'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Modal from "react-modal";
import { withAuthUser, useAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import { relativeTimeString } from '../utils/dayjs-helper'

function Anonions({ anonions }) {
	const [modalIsOpen, setModalOpen] = useState(false);
	const [question, setQuestion] = useState("")

	const router = useRouter()

	var openModal = () => setModalOpen(true);
	var closeModal = () => setModalOpen(false);

	const customStyles = {
		content: {
			height: "40%",
			textAlign: "center",
			margin: "auto",
			inset: "5%",
			maxWidth: 400
		},
	};

	useEffect(() => {
		if (window.location.search.indexOf("new") >= 0)
			openModal()
	}, [])

	var AuthUser = useAuthUser()
	return <div className={styles.container}>
		<Head>
			<title>My Questions</title>
		</Head>
		<Header email={AuthUser.email} signOut={AuthUser.signOut} />
		<div className="flex flex-col align-middle">
			<div className="text-2xl font-bold text-gray-700 mb-1">{AuthUser.firebaseUser ? AuthUser.firebaseUser.displayName.concat("'s Anonions") : ""}</div>
			<button onClick={() => setModalOpen(true)} className="m-auto transition duration-200 bounce-in bg-gradient-to-r from-green-400 to-blue-500 hover:animate-bounce text-white p-3 rounded-lg font-medium cursor-pointer transform hover:-translate-y-1 hover:scale-110" style={{ maxWidth: "85%" }}>
				Create New Anonion
			</button>
		</div>
		<main style={{
			width: "100%",
			flex: 1,
			padding: "2rem 0 5rem 0",
			display: "grid",
			gridGap: 20,
			gridTemplateColumns: "repeat(auto-fill,minmax(360px,2fr))",
		}}>

			{anonions.length > 0 ?
				anonions.map((value, index) => {
					console.log(value)
					return <div key={value.id} className="rounded-lg shadow-lg float-left px-4 py-2 bg-gray-100 flex flex-col justify-center">
						<Link href={"/a/" + value.id}>
							<a className="border-b cursor-pointer block text-lg font-semibold">{value.question}</a>
						</Link>
						<div className="p-0.5 m-0.5">
							<Link href={"/a/" + value.id}>
								<a className="cursor-pointer">
									<span className="w-4 inline text-xs font-normal text-gray-400"> {relativeTimeString(value.createdAt)} </span>
									{/* <span className="ml-1 text-xs text-gray-500">2</span> */}
								</a>
							</Link>
							<button onClick={() => {
								confirmAlert({
									message: 'Are you sure to delete the question and all of its responses.',
									buttons: [
										{
											label: 'Yes',
											onClick: () => firestore.collection("anonions").doc(value.id).delete().then(() => {
												toast("Question deleted!");
												router.reload()
											})
										},
										{
											label: 'No',
											onClick: () => alert('Click No')
										}
									]
								});
							}} className="float-right"><img className="w-4 inline" src="/trash.png" alt="Delete" /></button>
						</div>
					</div>
				})
				: <></>}
			<Modal
				ariaHideApp={false}
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<h3 className="text-xl text-black font-bold">New Anonion</h3>
				<div style={{ margin: "auto", marginTop: 16, }}>
					<div className="text-lg text-left text-gray-500 font-medium m-1">Your Question</div>
					<textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} cols={40} style={{
						borderRadius: 6,
						width: "100%",
						backgroundColor: "#d5feff",
						paddingLeft: 4,
						paddingTop: 2
					}} ></textarea>
					<button className="bg-black text-white border-gray-900 border-2 rounded-full py-1 px-4 hover:shadow-md m-2" onClick={() => {
						firestore
							.collection("anonions")
							.add({
								uid: AuthUser.id,
								question: question,
								createdAt: (new Date()).getTime(),
								updatedAt: (new Date()).getTime(),
							}).then((value) => {
								toast.success("Question added successfully")
								setTimeout(() => router.push("/a/" + value.id), 1500);
							}).catch(e => window.alert("Error"))
					}}>
						Submit
					</button>
				</div>
			</Modal>
		</main>
		<ToastContainer
			autoClose={1500}
			closeOnClick
			pauseOnFocusLoss={false}
			pauseOnHover={false}
		/>
	</div>
}

export const getServerSideProps = withAuthUserTokenSSR({
	whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
	var anonions = await db
		.collection("anonions")
		.where("uid", "==", AuthUser.id)
		.orderBy("createdAt", "desc")
		.get()
		.then(querySnapshot => querySnapshot)
		.catch(e => e)
	var docs = []
	if (!anonions.empty)
		docs = anonions.docs.map(doc => {
			return {
				...doc.data(),
				id: doc.id
			}
		})
	return {
		props: {
			anonions: docs
		}
	}
})

export default withAuthUser()(Anonions)