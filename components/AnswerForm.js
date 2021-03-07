import { useState } from 'react'
import firestore from '../utils/db-client'
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { CgCloseO } from 'react-icons/cg'
import LoginCard from './LoginCard'
import { useAuthUser } from 'next-firebase-auth'
import axios from 'axios'


const AnswerForm = ({ anonionID, onSuccess, onError }) => {
	const user = useAuthUser()
	const [modalIsOpen, setModalIsOpen] = useState(false)

	const { register, errors, handleSubmit, reset } = useForm();
	const onSubmit = async (data) => {
		if (user.email == null) {
			setModalIsOpen(true)
			return
		} else {
			let firebaseIdToken = await user.getIdToken()
			axios.post("/api/answer", {
				anonionID: anonionID, 
				answer: data.answer, 
				firebaseIdToken
			}).then(resp => console.log("OK"))
			return 
		}
	};

	return <div>
		<Modal
			ariaHideApp={false}
			isOpen={modalIsOpen}
			style={{
				content: {
					textAlign: "center",
					margin: "auto",
					inset: "5%",
					maxWidth: 400,
					border: "none",
					display: "flex"
				},
			}}
		>
			<div className="flex flex-col justify-center items-start" style={{ height: "fit-content" }}>
				<button onClick={() => {
					setModalIsOpen(false)
				}}>
					<CgCloseO size={20} />
				</button>
				<LoginCard />
			</div>
		</Modal>
		<form onSubmit={handleSubmit(onSubmit)}>
			<textarea placeholder="Send your anonymous message" name="answer" className="my-2 mt-6" ref={register({
				required: {
					value: true,
					message: "Answer cannot be empty"
				}, minLength: {
					value: 1,
					message: "Answer cannot be empty"
				}, maxLength: {
					value: 128,
					message: "Your answer cannot exceed 128 characters"
				}
			})} rows={4} cols={40} style={{
				borderRadius: 6,
				width: "100%",
				backgroundColor: "#d5feff",
				paddingLeft: 6,
				paddingTop: 2
			}} ></textarea>
			{errors && errors.answer ? <div className="text-red-500 font-semibold text-lg pl-2 text-left">{errors.answer.message}</div> : <></>}
			<input className="bg-black cursor-pointer text-white border-gray-900 border-2 rounded-full py-1 px-4 hover:shadow-md m-2" type="submit" value="Send" />
		</form>
	</div>
}

export default AnswerForm