import Header from '../components/Header'
import styles from '../styles/Home.module.css'
import firestore from '../utils/db-client'
import db from '../utils/db-server'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Modal from "react-modal";
import { withAuthUser, useAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'

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
		<Header email={AuthUser.email} signOut={AuthUser.signOut} />
		<main style={{
			width: "100%",
			flex: 1,
			padding: "5rem 0",
			display: "grid",
			gridGap: 20,
			gridTemplateColumns: "repeat(auto-fill,minmax(270px,2fr))"
		}}>
			{anonions.length > 0 ?
				<>
					<button onClick={() => setModalOpen(true)} className="transition duration-200 bounce-in bg-gradient-to-r from-green-400 to-blue-500 hover:animate-bounce text-white p-3 rounded-lg font-medium cursor-pointer transform hover:-translate-y-1 hover:scale-110">
						Create New Anonion
					</button>
					{
						anonions.map((value, index) => {
							return <Link  key={value.id} href={"/a/" + value.id}>
							<a className=" cursor-pointer rounded-lg shadow-xl float-left p-4 bg-gray-100">{value.question}</a></Link>
						})
					}</>
				: "No Anonions"}
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
							}).then((value) => router.reload()).catch(e => window.alert("Error"))
					}}>
						Submit
				</button>
				</div>
			</Modal>
		</main>
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
	console.log(anonions)
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