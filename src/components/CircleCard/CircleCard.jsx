const CircleCard = ({ children, className }) => {
	return (
		<li 
			className={`text-lg sm:text-base text-black dark:text-white transition-colors hover:text-blue-400 cursor-pointer ${className}`}
		>
			{children}
		</li>
	)
}

export default CircleCard;