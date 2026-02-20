import { Link } from 'react-router-dom';

import { useState } from 'react';

import { useSelector } from 'react-redux';

import hiphop from '../../assets/hiphopimg1.png';

const Footer = () => {
	const { translations } = useSelector((state) => state.lang);

	return (
		<div className="relative">
			<nav className="w-full px-2 sm:px-4 py-2 bg-gray-200 dark:bg-transparent dark:border-2 dark:border-white dark:text-white text-black dark:text-white transition-colors">
			    <ul className="flex items-center justify-around flex-wrap space-x-6 md:space-x-5 h-15 w-full">
			    	<Link to="/" className="hidden md:flex items-center justify-start">
			        	<img src={hiphop} alt="App Logo" className="xs:w-45 xs:h-8 xl:w-65 xl:h-10" />
			      	</Link>
			      	<li className="text-black dark:text-white text-nowrap hover:text-blue-500 uppercase cursor-pointer text-sm xm:text-base md:text-lg">
				        <a href="#" rel="noopener noreferrer">
				        	{translations.footer_h2}
				        </a>
				    </li>
				    <li className="text-black dark:text-white text-nowrap hover:text-blue-500 uppercase cursor-pointer text-sm xm:text-base md:text-lg">
				        <a href="#" rel="noopener noreferrer">
				        	{translations.footer_h3}
				        </a>
				    </li>
				    <li className="text-black dark:text-white text-nowrap hover:text-blue-500 uppercase cursor-pointer text-sm xm:text-base md:text-lg">
				        <a href="#" rel="noopener noreferrer">
				        	{translations.footer_h4}
				        </a>
				    </li>
				    <li className="text-black dark:text-white text-nowrap hover:text-blue-500 uppercase cursor-pointer text-sm xm:text-base md:text-lg">
				        <a href="#" rel="noopener noreferrer">
				        	{translations.footer_h5}
				        </a>
				    </li>
				    <li className="text-black dark:text-white text-nowrap hover:text-blue-500 uppercase cursor-pointer text-sm xm:text-base md:text-lg">
				        <a href="#" rel="noopener noreferrer">
				        	{translations.footer_h6}
				        </a>
				    </li>
			    </ul>
			</nav>
		</div>
	)
}

export default Footer;