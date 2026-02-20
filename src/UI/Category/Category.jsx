import { useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import axios from '../../api/axios';

const Category = ({ categoryData, catLoading }) => {
	// console.log(catLoading);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

	const handleClick = (id, title) => {
		navigate(`/posts/${id}?title=${title}&type=category`);
	}
	
	return (
		<div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
			{!catLoading ? (
		        // Skeleton loader, you can style it to look like a link
		        <div className="flex gap-4">
		          {/* Skeleton loader */}
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
		        </div>
		    ) : (
		    	<>
					{categoryData.length >= 1 && categoryData.map(i => (
						<button 
							key={i.id} 
							className="uppercase px-4 py-2 rounded-full text-black dark:text-white text-base sm:text-sm text-nowrap border-1 dark:border-white cursor-pointer hover:text-blue-600"
							onClick={() => handleClick(i.id, i.name)}
						>
							{i.name}
						</button>
					))}
				</>
			)}
		</div>
	)
}

export default Category;
