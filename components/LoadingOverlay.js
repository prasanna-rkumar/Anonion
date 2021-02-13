const LoadingOverlay = ({ isLoading }) => (
	<div className="flex flex-col justify-center items-center fixed top-0 w-screen h-screen z-10 bg-gray-500 bg-opacity-50 left-0" style={{
		display: isLoading ? "flex" : "none"
	}}>
		<div style={{
			borderTop: "8px solid #3b82f6",
		}} className="animate-spin w-16 h-16 rounded-full border-gray-300 border-8"></div>
		<div className="font-semibold text-2xl pt-2 text-white">Loading</div>
	</div>
);

export default LoadingOverlay;