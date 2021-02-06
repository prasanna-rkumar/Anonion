import { useRouter } from 'next/router'
import { useState } from 'react'
import { withAuthUser, useAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
import db from '../../utils/db-server'
import firestore from '../../utils/db-client'
import Header from '../../components/Header'

function AnonionPage({ isOwner, anonion, responses }) {
	console.log(isOwner, anonion, responses)
	const router = useRouter()
	const AuthUser = useAuthUser()
	const [answer, setAnswer] = useState("")
	const { anonionID } = router.query
	return <div className="bg-gray-100 h-screen">
		<Header email={AuthUser.email} signOut={AuthUser.signOut} />
		<main className="w-11/12 m-auto max-w-screen-md">
			<div style={{ boxShadow: "0 2px 13px -2px rgb(0 0 0 / 10%)" }} className="bg-white w-full rounded-lg p-4 text-center">
				<span className="text-4xl font-bold">{anonion.question}</span>
				{isOwner ? responses.length > 0 ? <div style={{
					width: "100%",
					flex: 1,
					padding: "3rem 0",
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
					: <></> : <>
						<textarea className="my-4 mt-6" maxLength={128} value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} cols={40} style={{
							borderRadius: 6,
							width: "100%",
							backgroundColor: "#d5feff",
							paddingLeft: 4,
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
								}).then((value) => console.log(value)).catch(e => window.alert("Error"))
						}}>
							Submit
						</button>
					</>}
			</div>
		</main>
	</div>
}

export const getServerSideProps = withAuthUserTokenSSR({
})(async ({ query, AuthUser }) => {
	var anonion = await db
		.collection("anonions")
		.doc(query.anonionID)
		.get()
		.then(querySnapshot => querySnapshot)
		.catch(e => e)
	var props = {
		isOwner: false,
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
		}
	}
	return { props }
})

export default withAuthUser()(AnonionPage)