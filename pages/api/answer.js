import admin from '../../utils/db-server'
import { verifyIdToken } from 'next-firebase-auth'
import initAuth from '../../utils/initAuth'

initAuth()

const answer = (req, res) => {
	if (!(req.body && req.body.firebaseIdToken)) {
		return res.status(400).json({ error: 'Please login to continue' })
	}
	if (!(req.body.anonionID && req.body.answer)) {
		return res.status(500).json({ error: 'Something went wrong! Please try again.' })
	}
	let { anonionID, answer } = req.body
	return verifyIdToken(req.body.firebaseIdToken)
		.then(AuthUser => {
			admin.firestore().collection("anonions").doc(anonionID).collection("responses").where("uid", "==", AuthUser.id).get().then(snapshot => {
				if (snapshot.docs.length == 0) {
					let createdAt = Date.now()
					admin.firestore().collection("anonions").doc(anonionID).collection("responses").doc(AuthUser.id).set({
						uid: AuthUser.id,
						answer,
						createdAt,
						updatedAt: createdAt
					}).then(() => {
						admin.firestore().collection("anonions").doc(anonionID).update({
							responsesCount: firestore.FieldValue.increment(1)
						})
						return res.status(200).json({ msg: 'Success' })
					})
				} else {
					return res.status(400).json({ error: 'You cannot send more than one response' })
				}
			}).catch(e => {
				console.log(e)
			})
		})
		.catch(e => {
			console.log(e)
			return res.status(400).json({ error: 'Please login to continue' })
		})
}

export default (answer)
