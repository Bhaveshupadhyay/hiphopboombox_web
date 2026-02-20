import { Fragment, useRef, useState, useEffect } from 'react';

import { CiSearch, CiHome } from "react-icons/ci";

import { Layout, Outer, Footer, Card} from "../../components";

const Music = () => {
	const [ searchInput, setSearchInput ] = useState('');
	const [ showDropdown, setShowDropdown ] = useState(false);
	const searchRef = useRef(null);

	const handleSearch = (e) => {
		setSearchInput(e.target.value.trim());
		setShowDropdown(e.target.value.trim() !== '');
	}

	const handleSubmit = (e) => {
		e.preventDefault();
	}

	// Handle search input focus
	const handleFocus = () => {
	    if (searchInput.trim() !== '') {
	      setShowDropdown(true);
	    }
	};

	useEffect(() => {
	    const handleClickOutside = (event) => {
	      if (searchRef.current && !searchRef.current.contains(event.target)) {
	        setShowDropdown(false);
	      }
	    };

	    // Add event listener
	    document.addEventListener('click', handleClickOutside);

	    // Cleanup event listener on component unmount
	    return () => {
	      document.removeEventListener('click', handleClickOutside);
	    };
	}, []);

	const handleSearchText = (text) => {
	    if (text.trim() !== '') {
	      setSearchInput(text.trim());
	      setShowDropdown(false); // Hide dropdown after selecting a value
	    }
	};

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

	return (
		<Layout>
			<Outer className="min-h-full mt-15 md:mt-17">
				<div className="text-black sm:col-span-2 border-0" ref={searchRef}></div>

				<div ref={searchRef} className="text-black sm:col-span-8 bg-white dark:bg-black dark:text-white flex flex-col gap-3 justify-between p-3 md:py-6 border-0">
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
						        value={searchInput}
						        onChange={handleSearch}
						        onFocus={handleFocus}
						      />
						    </div>
						</form>

					  	{searchInput && showDropdown && (
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

					<div className="border-0 mt-5 border-black">
						<div className="flex flex-col mb-8">
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold">Popular artists</p>
								<a href="#" className="text-base text-pink-500 font-medium text-nowrap">Show all</a>
							</div>

							{/*<div className="flex gap-5 lg:gap-3 pb-5 pl-1 mt-5 overflow-x-auto whitespace-nowrap hide-scrollbar">*/}
							<div className="flex overflow-x-auto gap-0 pb-5 mt-5 pl-3 sm:pl-0 hide-scrollbar gap-3 xd:gap-1 sm:gap-4 lg:gap-5 lg:grid lg:grid-cols-3 lg:grid-cols-4">
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 11, name: 'Artist Name', title: 'Artist Name', title_translate: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'artist'} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 12, name: 'Artist Name', title: 'Artist Name', title_translate: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'artist'} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 13, name: 'Artist Name', title: 'Artist Name', title_translate: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'artist'} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 14, name: 'Artist Name', title: 'Artist Name', title_translate: 'Artist Name', views: 0, social_media: 'twitter handle', description: 'artist'} } imgUpload={handleImageLoad} />
							</div>
						</div>


						<div className="flex flex-col mb-8">
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold">Popular albums and singles</p>
								<a href="#" className="text-base text-pink-500 font-medium text-nowrap">Show all</a>
							</div>

							<div className="flex overflow-x-auto gap-4 md:gap-5 lg:gap-3 pb-5 mt-5 pl-3 sm:pl-0 hide-scrollbar lg:grid lg:grid-cols-3 lg:grid-cols-4">
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} 
									data={ { id: 15, name: 'Album Name', views: 0,
										title: 'Album Name', title_translate: 'Album Name', 
										social_media: 'twitter handle lorem ipsum dolor sit amet', 
										description: 'artist name'} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} 
									data={ { id: 16, name: 'Album Name', views: 0, 
										title: 'Album Name', title_translate: 'Album Name',
										social_media: 'twitter handle lorem ipsum dolor sit amet', 
										description: 'artist name'} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} 
									data={ { id: 17, name: 'Album Name', views: 0, 
										title: 'Album Name', title_translate: 'Album Name',
										social_media: 'twitter handle lorem ipsum dolor sit amet', 
										description: 'artist name'} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} 
									data={ { id: 18, name: 'Album Name', views: 0, 
										title: 'Album Name', title_translate: 'Album Name',
										social_media: 'twitter handle lorem ipsum dolor sit amet', 
										description: 'artist name'} } imgUpload={handleImageLoad} />
							</div>
						</div>

						<div className="flex flex-col mb-8">
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold">Popular radio</p>
								<a href="#" className="text-base text-pink-500 font-medium text-nowrap">Show all</a>
							</div>

							<div className="flex overflow-x-auto gap-4 md:gap-5 lg:gap-3 pb-5 mt-5 pl-3 sm:pl-0 hide-scrollbar lg:grid lg:grid-cols-3 lg:grid-cols-4">
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 15, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 16, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 17, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 18, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
							</div>
						</div>

						<div className="flex flex-col mb-8">
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold">Featured Charts</p>
								<a href="#" className="text-base text-pink-500 font-medium text-nowrap">Show all</a>
							</div>

							<div className="flex overflow-x-auto gap-4 md:gap-5 lg:gap-3 pb-5 mt-5 pl-3 sm:pl-0 hide-scrollbar lg:grid lg:grid-cols-3 lg:grid-cols-4">
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 15, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 16, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 17, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 18, name: 'Album Name', title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', views: 0, social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
							</div>
						</div>

						<div className="flex flex-col mb-8">
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold">Playlists from our editors</p>
								<a href="#" className="text-base text-pink-500 font-medium text-nowrap">Show all</a>
							</div>

							<div className="flex overflow-x-auto gap-4 md:gap-5 lg:gap-3 pb-5 mt-5 pl-3 sm:pl-0 hide-scrollbar lg:grid lg:grid-cols-3 lg:grid-cols-4">
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 15, name: 'Album Name', views: 0, title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 16, name: 'Album Name', views: 0, title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 17, name: 'Album Name', views: 0, title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
								<Card className="shrink-0 sm:shrink-1 w-[45%] sm:w-[35%] md:w-[40%] lg:w-full" isMusic rounded={false} isHome={false} isDataLoaded={isDataLoaded} isImageLoaded={isImageLoaded} data={ { id: 18, name: 'Album Name', views: 0, title: 'lorem ipsum dolor sit amet', title_translate: 'lorem ipsum dolor sit amet', social_media: 'twitter handle lorem ipsum dolor sit amet', description: ''} } imgUpload={handleImageLoad} />
							</div>
						</div>
					</div>
				</div>

				<div className="text-black sm:col-span-2 border-0" ref={searchRef}></div>
			</Outer>
		</Layout>
	)
}

export default Music;