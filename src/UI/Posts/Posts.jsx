import { Fragment, useRef, useState, useEffect, useCallback } from 'react';

import { Layout, Outer, Footer, Card, DateFormat, Pagination } from "../../components";

import { useSelector } from 'react-redux';

import { FaSearch } from "react-icons/fa";

import { Category } from '../index';

import axios from '../../api/axios';

import { useParams, useNavigate, useLocation } from 'react-router-dom';

import debounce from 'lodash.debounce';

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const Posts = () => {
	const { translations, currentLang } = useSelector((state) => state.lang);

	const [ searchInput, setSearchInput ] = useState('');
	const [ searchResults, setSearchResults ] = useState([]);
	const [ showDropdown, setShowDropdown ] = useState(false);
	const searchRef = useRef(null);
	const controllerRef = useRef(null);

	const { id } = useParams(); // This will give you the id from the URL like /posts/:id
  	const location = useLocation(); // Gives you access to the query string

	// Parsing query params
	const searchParams = new URLSearchParams(location.search);

	const title = searchParams.get("title");
	const type = searchParams.get("type");

	// console.log(id, title, type);

  	const [ isValid, setIsValid ] = useState(false);

	useEffect(() => {
		if (type === 'search') { 
			setIsValid(true);
			setHomeData(p => {
				return {
					...p,
					posts: ''
				}
			})
		}

		else if (id && title) {
			const isValidId = typeof id === "string" && /^[^<>]*$/.test(id);
			const isValidTitle = typeof title === "string" && /^[^<>]*$/.test(title);

			// console.log("ID valid:", isValidId);
			// console.log("Title valid:", isValidTitle);

			setIsValid(isValidId && isValidTitle);
		}

		else {
			return;
		}
	}, [id, title, location.search]);

	const [ page, setPage ] = useState(1);
	const [ items, setItems ] = useState(10);

	const [isLoading, setIsLoading] = useState(true);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const [homeData, setHomeData] = useState({
		categories: [],
		posts: [],
		postsDate: [],
		desktopAdsData: [],
		mobileAdsData: []
	})

	const [dataLoading, setDataLoading] = useState({
		catLoading: false,
		postsLoading: false,
		postsDateLoading: false,
		desktopAdsLoading: false,
		mobileAdsLoading: false
	})

	const handleSearchData = useCallback(
	    debounce(async (query) => {
	      if (!query.trim()) return;

	      // Cancel previous request if it's still running
	      if (controllerRef.current) {
	        controllerRef.current.abort();
	      }

	      // Create a new AbortController
	      const controller = new AbortController();
	      controllerRef.current = controller;

	      try {
	        const res = await axios.get(`/api/v1/user_web/search?term=${query}`, {
	          signal: controller.signal,
	        });

	        // console.log(res.data);
	        setSearchResults(res.data);
	      } catch (err) {
	        if (err.name === 'CanceledError') {
	          console.log('Previous search request canceled');
	        } else {
	          console.error('Search error:', err.message);
	        }
	      }
	    }, 300),
	    []
  	);

	const handleImageLoad = () => {
	    setIsImageLoaded(true); // Image is loaded
	};

	const handleSearch = (e) => {
	    const value = e.target.value;
	    setSearchInput(value);  // Allow spaces

	    if (value.trim()) {
	        handleSearchData(value.trim());  // Trim only for the request
	        setShowDropdown(true);  // Show dropdown if there's any input
	    } else {
	        setShowDropdown(false);  // Hide dropdown if input is empty or just spaces
	    }
	};

	// const handleSearch = (e) => {
	// 	if (e.target.value.trim() === "") {
	// 		setSearchInput('');
	// 		return;
	// 	}

	// 	setSearchInput(e.target.value.trim());
	// 	handleSearchData(e.target.value.trim());
	// 	setShowDropdown(e.target.value.trim() !== '');
	// }

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

	const handleSearchText = (data) => {
		// console.log(data);
	    if (data.title.trim() !== '') {
	      setSearchInput(data.title.trim());
	      setShowDropdown(false); // Hide dropdown after selecting a value
	      setHomeData(p => {
	      	return {
	      		...p,
	      		posts: {
		      		data: [data],
		      		count: 1
		      	}
	      	}
	      })
	      setDataLoading(p => {
	      	return {
	      		...p,
	      		postsLoading: true
	      	}
	      })
	    }
	};

	useEffect(() => {
		let isMounted = true;
    	const controller = new AbortController();

		const fetchData = async () => {
			try {
			    const [
		          categoryData,
		          desktopAdsData,
		          mobileAdsData
		        ] = await Promise.allSettled([
		          axios.get("/api/v1/user_web/category"),
		          axios.get("/api/v1/user_web/desktopAds/1"),
		          axios.get("/api/v1/user_web/mobileAds/1")
		        ]);

		        // console.log(categoryData, trendingMonthData);

		        setHomeData((prevState) => {
		        	return {
		        		...prevState,
						categories: isMounted &&  categoryData.status === "fulfilled" ? categoryData.value.data?.data || [] : [],
						desktopAds: isMounted &&  desktopAdsData.status === "fulfilled" ? desktopAdsData.value.data?.data || [] : [],
						mobileAds: isMounted &&  mobileAdsData.status === "fulfilled" ? mobileAdsData.value.data?.data || [] : []
					}
				});

				setDataLoading((prevState) => {
		        	return {
		        		...prevState,
						catLoading: categoryData.status === "fulfilled",
						desktopAdsLoading: desktopAdsData.status === "fulfilled",
						mobileAdsLoading: mobileAdsData.status === "fulfilled"
					}
				});

		        setIsLoading(false);
		    } 

		    catch (error) {
		        console.error("Error fetching all ads/category data data:", error);
		        // setError("Failed to load data");
		        setIsLoading(false);
		    }
		}

		fetchData(); 

		return () => {
	      isMounted = false;
	      controller.abort();
	    };
	}, []);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchData = async () => {
			try {
				const postsData = await axios.get(
					`/api/v1/user_web/category_post/${parseInt(id)}?page=${page}&items=${items}&filter=n`,
					{ signal: controller.signal }
				);

				if (isMounted && postsData.data?.isSuccess) {
					setHomeData(p => ({
						...p,
						posts: {
							data: postsData.data?.data,
							count: postsData.data?.totalCount,
						},
					}));

					setDataLoading(p => ({
						...p,
						postsLoading: postsData.data?.isSuccess || false,
					}));

					setIsLoading(true);
				} else {
					throw new Error("failed...");
				}
			} catch (error) {
				console.error("Error fetching category posts data: ", error.message);
				setIsLoading(false);
			}
		};

		const fetchData2 = async () => {
			try {
				const postsData = await axios.get(
					`/api/v1/user_web/post_date/${id}?page=${page}&items=${items}`,
					{ signal: controller.signal }
				);

				// console.log(postsData.data);

				if (isMounted && postsData.data?.isSuccess) {
					setHomeData(p => ({
						...p,
						posts: {
							data: postsData.data?.data,
							count: postsData.data?.totalCount,
						},
					}));

					setDataLoading(p => ({
						...p,
						postsLoading: postsData.data?.isSuccess || false,
					}));

					setIsLoading(true);
				} else {
					throw new Error("failed...");
				}
			} catch (error) {
				console.error("Error fetching category posts data: ", error.message);
				setIsLoading(false);
			}
		};

		if (type === 'search') return;

		else if (id && type === 'category') {
			fetchData();
		}

		else if (id && type === 'all') {
			fetchData2();
		}

		else return;

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [id, page, items, type]);


	const handlePageClick = (page) => {
		setPage(page);

		window.scrollTo({
		    top: 0,
		    behavior: 'smooth',
		});
	}

	useEffect(() => {
	    return () => {
	      if (controllerRef.current) {
	        controllerRef.current.abort(); // Cancel request on unmount
	      }
	    };
  	}, []);

  	// console.log(homeData.posts);

	return (
		<Layout>
			<Outer className="min-h-full mt-15 md:mt-18">
				<div className="text-black sm:col-span-2 border-0"></div>
				<div className="text-black sm:col-span-8 bg-gray-50 dark:bg-black flex flex-col justify-start p-1 md:pt-2 lg:pt-2 border-0 rounded">
					<Category categoryData={homeData.categories} catLoading={dataLoading.catLoading} />

					<div className="bg-gray-300 h-4 w-full" />

					<div ref={searchRef} className="w-full mt-10">
						<form onSubmit={handleSubmit}>
							<div className="relative ml-2 sm:ml-4">
						      	<FaSearch className="text-black dark:text-white absolute left-3 top-1/2 transform -translate-y-1/2" fontSize={25} />

						      	{/* Search Input */}
						      	<input
							        type="search"
							        id="gsearch"
							        name="gsearch"
							        className="w-full pl-10 text-black bg-transparent border-2 border-black dark:border-2 dark:border-white dark:text-white p-2"
							        placeholder="Search news, topics and more"
							        value={searchInput}
							        onChange={handleSearch}
							        onFocus={handleFocus}
						      	/>

							    {searchResults && showDropdown && (
								    <div className="bg-gray-200 absolute top-full left-0 w-full p-3 z-10 h-auto rounded-b-md shadow-lg">
								      <ul>
								      	{searchResults.isSuccess && searchResults.data.map((i, index) => (
								        	<li 
								        		key={`${i.id}-${index}`}
								        		className="p-2 rounded shadow cursor-pointer mb-2" 
								        		onClick={() => handleSearchText(i)}
								        	>
								        		{i.title}
								        	</li>
								        ))}
								      </ul>
								    </div>
							  	)}
							</div>
						</form>
					</div>

					<div className="mt-10">
						{title && (
							<div className="flex justify-between items-center">
								<div></div>
								<div className="text-center text-2xl uppercase font-semibold text-[#00e5fa]">
									{type === 'category' ? title : <DateFormat homeDate={title} path="posts" />}
								</div>
								<div className="text-gray-600">{homeData.posts?.count} videos</div>
							</div>
						)}

						{dataLoading.postsLoading && homeData.posts?.data.length === 0 ? (
							    <div className="flex flex-row flex-wrap gap-4">
							      {[...Array(8)].map((_, index) => (
							        <div
							          key={index}
							          className="h-30 w-50 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse shrink-0 sm:shrink"
							        ></div>
							      ))}
							    </div>
							) : (
								<div className="border-0 flex flex-wrap justify-between sm:justify-start grid grid-cols-1 xd:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6 sm:px-0 gap-4 md:gap-5 lg:gap-5 mt-5">									
									{homeData.posts?.data?.map((item, index) => (
									    <Card
											key={item.id}
											lang={currentLang}
											className=""
											trending={false}
											rounded={false}
											isPosts
											isDataLoaded={true}
											isImageLoaded={isImageLoaded}
											data={item}
											imgUpload={handleImageLoad}
											path="/video"
										/>
									))}
								</div>
							)
						}
					</div>

					<div className="mt-10 flex justify-center items-center">
						{homeData.posts?.count >= 10 && 
							<Pagination isLoading={dataLoading.postsLoading} currentPage={page || 1} onClick={handlePageClick} />
						}
					</div>

					<div className="mt-10 mb-10 sm:mb-0">
						<Footer/>
					</div>
				</div>
				<div className="text-black sm:col-span-2 border-0"></div>
			</Outer>
		</Layout>
	)
}

export default Posts;