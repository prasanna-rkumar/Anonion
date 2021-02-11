import firestore from '../utils/db-client'
import { useForm } from "react-hook-form";

const AnswerForm = ({ anonionID, onSuccess, onError }) => {
	const { register, errors, handleSubmit, reset } = useForm();
	const onSubmit = data => {
		const datetime = (new Date()).getTime()
		firestore
			.collection("anonions")
			.doc(anonionID)
			.collection("responses")
			.add({
				answer: data.answer,
				createdAt: datetime,
				updatedAt: datetime,
			}).then((value) => {
				onSuccess()
				reset()
			}).catch(e => {
				console.log(e);
				onError();
			})
	};

	return <div>
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