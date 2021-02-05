import { useRouter } from 'next/router'

function AnonionPage() {
	const router = useRouter()
	const { anonionID } = router.query
	return <div>Anonion { anonionID } Page</div>
}

export default AnonionPage