import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { IoEyeSharp } from "react-icons/io5";

import { SocialMedia } from "../index";

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const Card = ({ lang, isPosts, path, rounded, isMusic, isHome, isDataLoaded, isImageLoaded, imgUpload, className = '', trending, ...rest}) => {
	// console.log(isDataLoaded, isImageLoaded);
	// console.log(rest.data);

	const navigate = useNavigate();
	// const location = useLocation();
	// const from = location.state?.from?.pathname || '/';

	const handleClick = (id, title) => {
		// console.log(id);
		// navigate(`/audio/${id}`)
		path ? navigate(`/video/${id}?title=${title.slice(0, 5)}`) : navigate(`/audio/${id}`);
	}

	const truncateText = (text, maxLength) => 
  		text?.length > maxLength ? `${text.split('').slice(0, maxLength).join('')}...` : text;

	return (
		<div
		    onClick={() => handleClick(rest.data.id, rest.data.title)}
		    className={`
		        flex flex-col 
		        ${isHome || isPosts ? 'gap-0' : 'gap-4'} 
		        p-0 cursor-pointer 
		        dark:shadow-md dark:shadow-white dark:border-0 rounded-md
		        ${!isDataLoaded ? 'animate-pulse' : ''} 
		        transition-colors duration-300
		        ${className} 
		    `}
		>
			<div
				// ${rounded && trending ? 'rounded-full w-30 h-30' : 'rounded-sm h-48'} ${trending && !rounded ? 'w-50 h-48' : 'w-full h-48'}
				className={`
					${rounded ? 'rounded-full' : 'rounded-sm h-30 xd:h-35 xm:h-40 md:h-48'} 
					${trending ? 'w-full' : 'w-full'} 
					${isMusic ? 'w-30 h-30 xd:w-35 xd:h-35 xm:w-40 xm:h-40 md:w-50 md:h-48' : 'h-35'} 
					lg:w-full bg-gradient-to-r
					relative overflow-hidden
				`}
				style={{ backgroundSize: '100% 100%' }}
			>
				 {/*Skeleton Placeholder for Image */}
				{!isImageLoaded && (
					<div className={`w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 animate-pulse ${rounded ? 'rounded-full' : 'rounded-sm'}`} />
				)}
				<img
					className={`w-full h-full object-cover overflow-hidden lg:w-full ${rounded ? 'rounded-full' : ''} ${isImageLoaded ? '' : 'hidden'}`}
					src={rest.data?.portrait_image ? `${IMG_BASE_URL}/${rest.data?.portrait_image}` : "https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
					alt="hiphopboombox"
					onLoad={imgUpload}
					style={{ width: '100%', height: '100%', objectFit: 'fill' }}
				/>
			</div>

			<div className={`font-medium ${isHome && isDataLoaded ? 'bg-[#343434] p-3 h-20' : ''} ${isPosts && isDataLoaded ? 'bg-[#343434] pt-3 h-30 flex flex-col justify-between' : ''} ${!isDataLoaded ? 'animate-pulse' : ''}`}>
				<p className={`text-sm px-2 text-black text-wrap uppercase dark:text-white ${isHome || isPosts ? 'text-white text-center' : 'text-black'} ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
					{truncateText(rest.data?.name || lang == 'en' ? rest.data?.title : rest.data?.title_translate, 30)}
				</p>

				{rest.data?.description && (
					<p className={`text-xs px-2 text-gray-400 text-wrap capitalize dark:text-white ${isHome || isPosts ? 'text-white text-center' : 'text-black'} ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
						{truncateText(rest.data?.name || lang == 'en' ? rest.data?.description : rest.data?.description, 30)}
					</p>
				)}

				{isPosts && (
					<>
						<div className={`mt-2 px-2 ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
							<SocialMedia homeSocialData={rest.data?.social_media} path="posts" />
						</div>
						{/*<hr className="bg-black/90 w-full h-1 mt-2" />*/}
						<div className={`mt-2 border-1 bg-[#343434] border-black p-2 text-sm flex justify-center items-center text-black dark:text-white ${isHome || isPosts && 'text-white text-center'} ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
							<IoEyeSharp fontSize={20} className="text-white mr-2" /> {rest.data?.views || 30}
						</div>
					</>
				)}
			</div>

			 {/*Text Skeleton */}
			{/*<div className={`font-medium ${isHome && isDataLoaded ? 'bg-black p-3': ''} ${!isDataLoaded ? 'animate-pulse' : ''}`}>
				<p className={`font-mono text-black break-words whitespace-normal text-xs uppercase dark:text-white ${isHome && 'text-white'} ${!isDataLoaded ? 'bg-gray-400' : ''}w-full`}>
					{rest.data?.name || rest.data?.title}
				</p>
				<p className={`mt-2 text-base text-black break-words whitespace-normal dark:text-gray-300 ${isHome && 'text-white'} ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
					{rest.data?.social_media}
				</p>
				<p className={`mt-1 text-sm break-words whitespace-normal leading-relaxed text-balance text-black dark:text-white ${isHome && 'text-white'} ${!isDataLoaded ? 'bg-gray-400' : ''}`}>
					{rest.data?.description}
				</p>
			</div>*/}
		</div>
	)
}

export default Card;