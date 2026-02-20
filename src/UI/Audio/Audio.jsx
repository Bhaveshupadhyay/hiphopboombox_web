import { useState, useRef, useEffect } from 'react';
 
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { CiSearch, CiHome, CiVolumeHigh, CiVolumeMute } from "react-icons/ci";

import { FaPlay } from "react-icons/fa6";

import { Layout, Outer, AudioCard, AudioPlayer } from "../../components";

import ReactAudioPlayer from 'react-audio-player';

const Audio = () => {
	const { id } = useParams(); // Route param -> /audio/:id
	const location = useLocation(); // Gives you access to query string

	// Parsing query params
	const searchParams = new URLSearchParams(location.search);
	// check it
	const lang = searchParams.get('lang');
	const autoplay = searchParams.get('autoplay');

	const [ isMuted, setIsMuted ] = useState(false);

	const [ userInput, setUserInput ] = useState({
		searchInput: '',
		searchArtistInput: ''
	});

	const [ viewDropdown, setViewDropdown ] = useState({
		showDropdown: false,
		showArtistDropdown: false
	});

	const searchRef = useRef(null);
	const artistRef = useRef(null);

	const handleSearch = (e) => {
		setUserInput((prevState) => {
			return {
				...prevState,
				searchInput: e.target.value.trim()
			}
		});

		setViewDropdown((prevState) => {
			return {
				...prevState,
				showDropdown: e.target.value.trim() !== '' 
			}
		})
	}

	const handleArtistSearch = (e) => {
		setUserInput((prevState) => {
			return {
				...prevState,
				searchArtistInput: e.target.value.trim()
			}
		});

		setViewDropdown((prevState) => {
			return {
				...prevState,
				showArtistDropdown: e.target.value.trim() !== '' 
			}
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault();
	}

	// Handle search input focus
	const handleFocus = () => {
	    if (userInput.searchInput.trim() !== '') {
	      setViewDropdown((prevState) => {
	      	return {
	      		...prevState,
	      		showDropdown: true
	      	}
	      })
	    }
	};

	const handleArtistFocus = () => {
	    if (userInput.searchArtistInput.trim() !== '') {
	      setViewDropdown((prevState) => {
	      	return {
	      		...prevState,
	      		showArtistDropdown: true
	      	}
	      })
	    }
	};

	useEffect(() => {
	    const handleClickOutside = (event) => {
	      if (
	        searchRef.current &&
	        !searchRef.current.contains(event.target)
	      ) {
	        setViewDropdown({
	        	showDropdown: false,
	        	showArtistDropdown: false
	        })
	      }
	    };

	    document.addEventListener('click', handleClickOutside);
	    return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	const handleSearchText = (text) => {
	    if (text.trim() !== '') {
	      // setSearchInput(text.trim());
	      // setShowDropdown(false); // Hide dropdown after selecting a value

	    	console.log(text);

	      setUserInput((prevState) => {
	      	return {
	      		...prevState,
	      		searchInput: text.trim()
	      	}
	      })

	      setViewDropdown((prevState) => {
	      	return {
	      		...prevState,
	      		showDropdown: false
	      	}
	      })
	    }
	};

	const handleArtistText = (text) => {
		if (text.trim() !== '') {
			setUserInput((prevState) => {
		      	return {
		      		...prevState,
		      		searchArtistInput: text.trim()
		      	}
		    })

		    setViewDropdown((prevState) => {
		      	return {
		      		...prevState,
		      		showArtistDropdown: false
		      	}
		    })
		}
	}

	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	// Simulate data fetching (you can replace this with actual API calls)
	useEffect(() => {
	    setTimeout(() => {
	      setIsDataLoaded(true); // Simulate data being loaded after 3 seconds
	    }, 10000);
	}, []);

	const handleImageLoad = () => {
	    setIsImageLoaded(true); // Image is loaded
	};

	const toggleVolume = () => {
		setIsMuted(prevState => !prevState);
	}

	return (
		<Layout>
			<Outer className="min-h-full mt-15 md:mt-17 relative">
				<div className="text-black bg-white dark:bg-black dark:text-white sm:col-span-3 border-0" ref={artistRef}>
					<div className="mt-17 bg-gray-200 dark:bg-black dark:text-white pt-3 pe-3 ps-3 pb-1">
						<div className="text-lg mb-3">Your Library</div>

						<div className="flex gap-2 mb-3">
							<button className="bg-gray-300 rounded-full px-4 py-1 text-gray-800">Playlists</button>
							<button className="bg-gray-300 rounded-full px-4 py-1 text-gray-800">Artists</button>
						</div>

						<div className="relative flex mb-5">
							<form className="flex justify-start items-center">
							    <div className="relative">
							      <CiSearch className="text-black dark:text-white absolute left-3 top-1/2 transform -translate-y-1/2" fontSize={25} />

							      {/* Search Input */}
							      <input
							        type="search"
							        id="gsearch"
							        name="gsearch"
							        className="w-full pl-10 text-black bg-transparent border-2 border-black dark:border-2 dark:border-white dark:text-white p-2 rounded-full"
							        placeholder="Who do you want to listen?"
							        value={userInput.searchArtistInput}
							        onChange={handleArtistSearch}
							        onFocus={handleArtistFocus}
							      />
							    </div>
							</form>

						  	{userInput.searchArtistInput && viewDropdown.showArtistDropdown && (
							    <div className="bg-gray-200 absolute top-full left-0 w-full p-3 z-10 h-auto rounded-b-md shadow-lg">
							      <ul>
							        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleArtistText('Harry Styles')}>Harry Styles</li>
							        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleArtistText('Arijit Singh')}>Arijit Singh</li>
							        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleArtistText('Zayn Malik')}>Zayn Malik</li>
							        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleArtistText('Snoop Dogg')}>Snoop Dogg</li>
							      </ul>
							    </div>
						  	)}
						</div>

						<div className="flex flex-col gap-5 mb-5 h-[240px] overflow-y-auto overscroll-contain scroll-smooth">
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow p-2 bg-gray-100 dark:bg-transparent" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'Artist'} } imgUpload={handleImageLoad} />
						</div>
					</div>
				</div>

				<div ref={searchRef} className="text-black sm:col-span-6 bg-white dark:bg-black dark:text-white flex flex-col gap-3 p-3 md:py-3 border-0">
					<div className="relative flex justify-center">
						<form className="flex justify-start sm:justify-center items-center">
						    <div className="border-2 border-black dark:border-white flex items-center p-2 rounded-full">
						      <CiHome className="text-black dark:text-white text-[15px] sm:text-[25px]" />
						    </div>
						    <div className="relative ml-2 sm:ml-4">
						      <CiSearch className="text-black dark:text-white absolute left-3 top-1/2 transform -translate-y-1/2" fontSize={25} />

						      {/* Search Input */}
						      <input
						        type="search"
						        id="gsearch"
						        name="gsearch"
						        className="w-full pl-10 text-black bg-transparent border-2 border-black dark:border-2 dark:border-white dark:text-white p-2"
						        placeholder="What do you want to play?"
						        value={userInput.searchInput}
						        onChange={handleSearch}
						        onFocus={handleFocus}
						      />
						    </div>
						</form>

					  	{userInput.searchInput && viewDropdown.showDropdown && (
						    <div className="bg-gray-200 absolute top-full left-0 w-full p-3 z-10 h-auto rounded-b-md shadow-lg">
						      <ul>
						        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleSearchText('Apple')}>Apple</li>
						        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleSearchText('Mango')}>Mango</li>
						        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleSearchText('Banana')}>Banana</li>
						        <li className="p-2 rounded shadow cursor-pointer mb-2" onClick={() => handleSearchText('Pineapples')}>Pineapple</li>
						      </ul>
						    </div>
					  	)}
					</div>

					<div className="border-0">
						<div className="mb-2">
							<img src="https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
								alt="Keyboard"
								onLoad={handleImageLoad}
								style={{ width: '100%', height: '200px', objectFit: 'cover' }}
							/>
						</div>

						<div className="mb-0 flex flex-col gap-1 pl-3">
							<div className="flex gap-5 items-center justify-start">
								<div className="border-2 rounded-full p-2">
									<FaPlay className="text-black dark:text-white" fontSize={15} />
								</div>
								<button className="text-white bg-pink-500 px-6 py-2 rounded-full">Following</button>
							</div>
							<p className="text-lg">Popular</p>
						</div>

						<div className="flex flex-col gap-5 p-3 h-[140px] overflow-y-auto overscroll-contain scroll-smooth">
							<AudioCard className="shadow" rounded isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Song Name 1', views: 578556, duration: 5.78, description: 'artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow" rounded isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 12, name: 'Song Name 2', views: 578556, duration: 5.78, description: 'artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow" rounded isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 13, name: 'Song Name 3', views: 578556, duration: 5.78, description: 'artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow" rounded isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 14, name: 'Song Name 4', views: 578556, duration: 5.78, description: 'artist'} } imgUpload={handleImageLoad} />
							<AudioCard className="shadow" rounded isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 15, name: 'Song Name 5', views: 578556, duration: 5.78, description: 'artist'} } imgUpload={handleImageLoad} />
						</div>
					</div>
				</div>

				<div ref={searchRef} className="text-black bg-white dark:bg-black dark:text-white sm:col-span-3 border-0">
					<div className="mt-17 bg-gray-200 dark:bg-black dark:text-white">
						<div className="h-[500px] hidden sm:flex  overflow-y-auto overscroll-contain scroll-smooth">
							<img src="https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
								alt="Keyboard"
								onLoad={handleImageLoad}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
						<div className="h-[120px] flex sm:hidden"></div>
					</div>
				</div>

				{/*audio player*/}

				<div className="fixed bottom-0 left-0 border-0 w-full h-40 sm:h-20 flex gap-5 sm:gap-0 sm:justify-evenly flex-col justify-center items-center sm:flex-row px-3 sm:items-center text-black bg-white dark:bg-black dark:border-1 dark:border-gray-50 dark:text-white">
					<div className="flex-1 sm:flex-1">
						<AudioCard className="p-2" rounded={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Song Name', views: 0, description: 'Artist Name'} } imgUpload={handleImageLoad} />
					</div>

					<div className="flex-1 sm:flex-2">
						<AudioPlayer
					        src="/audio/sample.mp3"
					        title="Good Vibes"
					        artist="Lo-Fi Beats"
					    />
					</div>

					<div className="flex-1 sm:flex-1 sm:justify-center sm:items-center">
						<button
				          onClick={toggleVolume}
				          className="bg-transparent hover:scale-105 transition cursor-pointer"
				        >
				          {isMuted ? <CiVolumeMute fontSize={20} className="text-black dark:text-white" /> : <CiVolumeHigh fontSize={20} className="text-black dark:text-white" />}
				        </button>
					</div>
				</div>
			</Outer>
		</Layout>
	)
}

export default Audio;