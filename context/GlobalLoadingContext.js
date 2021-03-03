import { useState, createContext } from 'react'
import LoadingOverlay from '../components/LoadingOverlay'

export const LoadingContext = createContext()

export const LoadingOverlayProvider = ({ children }) => {
	const [isLoading, setLoading] = useState(false)
	return (
		<LoadingContext.Provider value={{ isLoading, setLoading }}>
			<div>
				<LoadingOverlay isLoading={isLoading} />
				{children}
			</div>
		</LoadingContext.Provider>
	)
}
