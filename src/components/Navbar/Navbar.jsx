import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaPoll, FaUserCircle, FaSearch, FaTwitter, FaFacebook, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaThreads } from "react-icons/fa6";
import { CgToggleOff, CgToggleOn } from "react-icons/cg";

import { Link } from "react-router-dom";

import hiphop from '../../assets/hiphopimg1.png';

import CircleCard from '../CircleCard/CircleCard';

import { useSelector } from 'react-redux';

const Navbar = ({ currentUser }) => {
	const [theme, setTheme] = useState(() => {
	    return localStorage.getItem('theme') || 'light';
	});

	useEffect(() => {
	    document.documentElement.setAttribute('data-theme', theme);
	    localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
	    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	const { translations } = useSelector((state) => state.lang);

	const [isOpen, setIsOpen] = useState(false);

	const handleClick = () => {
	    setIsOpen((prevState) => !prevState);
	};

	// console.log(translations.login_h1);

	return (
		<div className="responsive">
			<nav className="w-full flex items-center justify-between px-4 py-4 fixed top-0 left-0 border-b-1 border-gray-200 z-11 bg-white dark:bg-black text-black dark:text-white transition-colors">
		      	<Link to="/" className="flex items-center justify-start">
		        	<img src={hiphop} alt="App Logo" className="xs:w-45 xs:h-8 xl:w-65 xl:h-10" />
		      	</Link>

		      	<ul className="flex items-center justify-center max-sm:hidden space-x-4">
		        	<CircleCard className="font-bold text-black dark:text-white tracking-wider">
		        		<a href="#">{translations.nav_h1}</a>
		        	</CircleCard>
		        	<CircleCard className="font-bold text-black dark:text-white tracking-wider">
		        		<a href="#">{translations.nav_h2}</a>
		        	</CircleCard>
		        	<CircleCard className="font-bold text-black dark:text-white tracking-wider">
		        		<Link to="/music">{translations.nav_h3}</Link>
		        	</CircleCard>
		        	<CircleCard className="font-bold text-black dark:text-white tracking-wider">
		        		<a href="#">{translations.nav_h4}</a>
		        	</CircleCard>
		        	<CircleCard>
		        		<a href="#">
		        			<FaPoll className="text-black dark:text-white transition-colors hover:text-blue-400" fontSize={23} cursor="pointer" />
		        		</a>
		        	</CircleCard>
		        	<CircleCard>
		        		<Link to="/login">
		        			<FaUserCircle className="text-black dark:text-white transition-colors hover:text-blue-400" fontSize={23} cursor="pointer" />
		        		</Link>
		        	</CircleCard>
		        	<CircleCard>
		        		<Link to="/posts?type=search">
		        			<FaSearch className="text-black dark:text-white transition-colors hover:text-blue-400" fontSize={23} cursor="pointer" />
		        		</Link>
		        	</CircleCard>
		      	</ul>

		      	<ul className="flex items-center justify-center space-x-4">
		        	{ theme === 'light' ? (
			        	<CircleCard className="font-bold tracking-wider">
						    <CgToggleOn 
						    	className="rounded text-black dark:text-white transition" 
						    	fontSize={35} 
						    	onClick={toggleTheme} 
						    	cursor="pointer"
						    />
			        	</CircleCard>
			        ) : (
			        	<CircleCard className="font-bold tracking-wider">
			        		<CgToggleOff 
						    	className="rounded text-black dark:text-white transition" 
						    	fontSize={35} 
						    	onClick={toggleTheme} 
						    	cursor="pointer"
						    />
						</CircleCard>
					)}
		        </ul>

		      	<ul className="flex items-center justify-center max-lg:hidden space-x-6">
		        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
		        		<a href="#">
		        			<FaTwitter color="#1DA1F2" fontSize={17} cursor="pointer" />
		        		</a>
		        	</CircleCard>
		        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
		        		<Link to="https://www.facebook.com/profile.php?id=61556088652649" target="_blank" rel="noopener noreferrer">
		        			<FaFacebook color="#1877F2" fontSize={17} cursor="pointer" />
		        		</Link>
		        	</CircleCard>
		        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
		        		<Link to="https://www.instagram.com/hip.hop.boombox/profilecard/?igsh=ZTJld3plbjJyNTM3" target="_blank" rel="noopener noreferrer">
		        			<FaInstagram color="#E1306C" fontSize={17} cursor="pointer" />
		        		</Link>
		        	</CircleCard>
		        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
		        		<Link to="https://www.tiktok.com/@hiphopboombox?_t=8qHKndysIl4&_r=1" target="_blank" rel="noopener noreferrer">
		        			<FaTiktok color="#00f2ea" fontSize={17} cursor="pointer" />
		        		</Link>
		        	</CircleCard>
		        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
		        		<a href="#">
		        			<FaYoutube color="#FF0000" fontSize={17} cursor="pointer" />
		        		</a>
		        	</CircleCard>
		        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
		        		<Link to="https://www.threads.net/@hip.hop.boombox" target="_blank" rel="noopener noreferrer">
		        			<FaThreads className="text-black dark:text-white" fontSize={17} cursor="pointer" />
		        		</Link>
		        	</CircleCard>
		      	</ul>

		      	<div className="lg:hidden">
			        <FaBars className="text-black dark:text-white" fontSize={27} cursor="pointer" onClick={handleClick} />
			        { isOpen && (
			          <div className="fixed top-17 left-0 w-full h-auto bg-white dark:bg-black border-1 border-x-0 border-b-white-300 text-black dark:text-white transition-colors bg-opacity-90 flex flex-col space-y-3 p-8 z-50">
			            <FaTimes 
			              className="hidden absolute top-4 right-4 text-black dark:text-white text-3xl cursor-pointer" 
			              onClick={handleClick} 
			            />

			            <ul className="flex flex-col justify-start items-start md:hidden space-y-2">
			              	<CircleCard className="font-medium tracking-wider">
				        		<a href="#">{translations.nav_h1}</a>
				        	</CircleCard>
				        	<CircleCard className="font-medium tracking-wider">
				        		<a href="#">{translations.nav_h2}</a>
				        	</CircleCard>
				        	<CircleCard className="font-medium tracking-wider">
				        		<Link to="/music">{translations.nav_h3}</Link>
				        	</CircleCard>
				        	<CircleCard className="font-medium tracking-wider">
				        		<a href="#">{translations.nav_h4}</a>
				        	</CircleCard>
				        	<CircleCard className="font-medium tracking-wider">
				        		<a href="#">{translations.nav_h7}</a>
				        	</CircleCard>
			            </ul>

			            <div className="flex flex-col justify-start items-start">
			              	{!currentUser ? 
					        	<Link to="/login" className="text-black dark:text-white mb-2 border-1 px-4 py-2 rounded-full cursor-pointer font-medium">
					        		{translations.nav_h6}
					        	</Link> :
					        	<a href="#" className="text-black dark:text-white mb-2 cursor-pointer font-medium">
					        		{translations.nav_h8}
					        	</a>
					        }
			              {/*<a href="/" className="text-white">Book Table</a>*/}
			            </div>

			            <ul className="flex items-center justify-center space-x-2 md:space-x-6">
				        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
				        		<a href="#">
				        			<FaTwitter color="#1DA1F2" className="text-[17px] md:text-[20px]" cursor="pointer" />
				        		</a>
				        	</CircleCard>
				        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
				        		<Link to="https://www.facebook.com/profile.php?id=61556088652649" target="_blank" rel="noopener noreferrer">
				        			<FaFacebook color="#1877F2" className="text-[17px] md:text-[20px]" cursor="pointer" />
				        		</Link>
				        	</CircleCard>
				        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
				        		<Link to="https://www.instagram.com/hip.hop.boombox/profilecard/?igsh=ZTJld3plbjJyNTM3" target="_blank" rel="noopener noreferrer">
				        			<FaInstagram color="#E1306C" className="text-[17px] md:text-[20px]" cursor="pointer" />
				        		</Link>
				        	</CircleCard>
				        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
				        		<Link to="https://www.tiktok.com/@hiphopboombox?_t=8qHKndysIl4&_r=1" target="_blank" rel="noopener noreferrer">
				        			<FaTiktok color="#00f2ea" className="text-[17px] md:text-[20px]" cursor="pointer" />
				        		</Link>
				        	</CircleCard>
				        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
				        		<a href="#">
				        			<FaYoutube color="#FF0000" className="text-[17px] md:text-[20px]" cursor="pointer" />
				        		</a>
				        	</CircleCard>
				        	<CircleCard className="border-1 border-gray-600 dark:border-gray-50 dark:border-2 hover:border-blue-500 p-2 rounded-full flex items-center">
				        		<Link to="https://www.threads.net/@hip.hop.boombox" target="_blank" rel="noopener noreferrer">
				        			<FaThreads className="text-black dark:text-white text-[17px] md:text-[20px]" cursor="pointer" />
				        		</Link>
				        	</CircleCard>
				      	</ul>
			          </div>
			        )}
		      	</div>
		    </nav>
		</div>
	)
}

export default Navbar;