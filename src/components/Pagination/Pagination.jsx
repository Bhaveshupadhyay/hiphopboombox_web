import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ isLoading, currentPage, onClick }) => {
	// console.log(currentPage);
  const [startPage, setStartPage] = useState(currentPage || 1);

  useEffect(() => {
    // Sync startPage with currentPage if changed from parent
    setStartPage(currentPage);
  }, [currentPage]);

  const handleClick = (page) => {
    if (startPage < 1) return;
    setStartPage(page);
    onClick(page);
  };

  const handlePrevGroup = () => {
    if (startPage < 1) return;
    setStartPage((prev) => Math.max(prev - 1, 1))
    handleClick(startPage-1);
  };

  const handleNextGroup = () => {
    setStartPage(prevState => prevState+1);
    handleClick(startPage+1);
  };

  const pageNumbers = [startPage, startPage + 1, startPage + 2];

  return (
  	<>
		{!isLoading ? (
			<div className="flex gap-4">
			    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
			    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
			    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
			    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
			    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
			  </div>
		) : (
			<div className="flex items-center justify-center">
			      <button
			        className="border border-gray-200 hover:bg-blue-500 hover:text-white px-2 py-3"
			        onClick={handlePrevGroup}
			      >
			        <IoIosArrowBack className="text-blue-700 hover:text-white" />
			      </button>

			      {pageNumbers.map((num, index) => (
			        <button
			          key={index}
			          onClick={() => handleClick(num)}
			          className={`border border-gray-200 px-4 py-2 font-semibold ${
			            num === startPage
			              ? "bg-blue-500 text-white"
			              : "text-blue-500 hover:bg-blue-500 hover:text-white"
			          }`}
			        >
			          {num}
			        </button>
			      ))}

			      <button
			        className="border border-gray-200 hover:bg-blue-500 hover:text-white px-2 py-3"
			        onClick={handleNextGroup}
			      >
			        <IoIosArrowForward className="text-blue-700 hover:text-white" />
			      </button>
			</div>
		)}
	</>
  )
}

export default Pagination;

