const AudioCard = ({ rounded, isDataLoaded, isImageLoaded, imgUpload, className, ...rest }) => {
	return (
		<div className={`flex items-center cursor-pointer ${className} ${!isDataLoaded ? 'animate-pulse' : ''}`}>
			<div
				className={`${!rounded ? 'rounded-full' : 'rounded-sm flex-none'} w-10 h-10 bg-gradient-to-r`}
				style={{ backgroundSize: '100% 100%' }}
			>
				{/* Skeleton Placeholder for Image */}
				{!isImageLoaded && (
					<div className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 animate-pulse w-10 h-10 ${!rounded ? 'rounded-full' : 'rounded-sm'}`} />
				)}
				<img
					className={`w-10 h-10 ${!rounded ? 'rounded-full' : 'rounded-sm'} ${isImageLoaded ? '' : 'hidden'}`}
					src="https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
					alt="Keyboard"
					onLoad={imgUpload}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			</div>
			<div className={`wrap-anywhere flex-1 ml-2 ${!isDataLoaded ? 'animate-pulse' : ''}`}>
				{!rounded ? (
					<>
			    		<p className={`text-sm text-nowrap ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
			    			{rest.data.name}
			    		</p>
			    		<p className={`text-xs text-nowrap ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
			    			{rest.data.description}
			    		</p>
			    	</>
			    ) : (
			    	<div className="border-0 flex items-center justify-between px-2">
			    		<p>{rest.data.name}</p>
			    		<p>{rest.data.views}</p>
			    		<p>{rest.data.duration}</p>
			    	</div>
			    )}
			</div>
		</div>
	)
}

export default AudioCard;