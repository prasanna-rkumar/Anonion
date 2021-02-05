import React from 'react'
import Link from 'next/link'

const styles = {
	container: {
		display: 'flex',
		width: "100%",
		justifyContent: 'space-between',
		alignItems: 'start',
		padding: 16,
	},
	button: {
		marginLeft: 16,
		cursor: 'pointer',
	},
}

const Header = ({ email, signOut }) => (
	<div style={styles.container}>
		<h3 className="text-2xl font-bold">Anonion</h3>
		{email ? (
			<div>
				<Link href="/anonions">
					<button type="button" className="bg-black text-white border-gray-900 border-2 rounded-full py-2 px-4 hover:shadow-md" style={styles.button}>
						My Anonions
          </button>
				</Link>
				<button
					type="button"
					onClick={() => {
						signOut()
					}}
					style={styles.button}
					className="border-gray-900 border-2 rounded-full py-2 px-4 hover:shadow-md"
				>
					Logout
        </button>
			</div>
		) : (
				<>
					<Link href="/login">
						<button type="button" className="border-gray-900 border-2 rounded-full py-2 px-4 hover:shadow-md" style={styles.button}>
							Login
            </button>
					</Link>

				</>
			)}
	</div>
)

export default Header