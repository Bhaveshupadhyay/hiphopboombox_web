import { Fragment, useRef, useState, useEffect } from 'react';

import { Layout, Outer, Footer, Card, DateFormat, Pagination } from "../../components";

import { useSelector } from 'react-redux';

import { FaPlay, FaVolumeMute } from "react-icons/fa";

import Category from '../Category/Category';

import axios from '../../api/axios';

import { Link, useNavigate } from "react-router-dom";

const getArrayFromData = (statusObj) => {
  if (!statusObj || statusObj.status !== "fulfilled") return [];
  const val = statusObj.value?.data;
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.data)) return val.data;
  return [];
};



const Home = () => {
	const { translations, currentLang } = useSelector((state) => state.lang);

	const navigate = useNavigate();

	const [ trendingNow, setTrendingNow ] = useState('now');
	const [ page, setPage ] = useState(1);

	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [homeData, setHomeData] = useState({
		categories: [],
		trendingNow: [],
		trendingWeek: [],
		trendingMonth: [],
		trendingYear: [],
		posts: [],
		featured: [],
		polls: [],
		popdown: [],
		desktopAds: [],
		mobileAds: []
	})

	const [dataLoading, setDataLoading] = useState({
		catLoading: false,
		nowLoading: false,
		weekLoading: false,
		monthLoading: false,
		postsLoading: false,
		featuredLoading: false,
		pollsLoading: false,
		popdownLoading: false,
		desktopAdsLoading: false,
		mobileAdsLoading: false
	})

	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const scrollContainerRef = useRef(null);
  const isManualChange = useRef(true);

  const handleChange = (e) => {
		isManualChange.current = true;
		setTrendingNow(e.target.value);
		setIsLoading(true);
	}

	// Simulate data fetching (you can replace this with actual API calls)
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

	    const fetchData = async () => {
      	try {
			    const [
		          categoryData,
		          featuredData,
		          pollsData,
		          popdownData,
		          desktopAdsData,
		          mobileAdsData
		        ] = await Promise.allSettled([
		          axios.get("/api/v1/user_web/category"),
		          axios.get("/api/v1/user_web/featured"),
		          axios.get("/api/v1/user_web/poll"),
		          axios.get("/api/v1/user_web/popdown"),
		          axios.get("/api/v1/user_web/desktopAds/1"),
		          axios.get("/api/v1/user_web/mobileAds/1")
		        ]);

		        // console.log(categoryData);

		        setHomeData((prevState) => {
		        	return {
		        		...prevState,
						categories: isMounted ? getArrayFromData(categoryData) : [],
						featured: isMounted ? getArrayFromData(featuredData) : [],
						polls: isMounted ? getArrayFromData(pollsData) : [],
						popdown: isMounted ? getArrayFromData(popdownData) : [],
						desktopAds: isMounted ? getArrayFromData(desktopAdsData) : [],
						mobileAds: isMounted ? getArrayFromData(mobileAdsData) : []
					}
				});

				setDataLoading((prevState) => {
		        	return {
		        		...prevState,
						catLoading: categoryData.status === "fulfilled",
						featuredLoading: featuredData.status === "fulfilled",
						pollsLoading: pollsData.status === "fulfilled",
						popdownLoading: popdownData.status === "fulfilled",
						desktopAdsLoading: desktopAdsData.status === "fulfilled",
						mobileAdsLoading: mobileAdsData.status === "fulfilled"
					}
				});

		        setIsLoading(false);
		    } 

		    catch (error) {
		        console.error("Error fetching home data:", error);
		        // setError("Failed to load data");
		        setIsLoading(false);
		    }
		};

		fetchData();

		return () => {
			isMounted = false;
			controller.abort();
		}
	}, []);

	
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (term = trendingNow) => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/v1/user_web/trending?term=${term}`, {
          signal: controller.signal,
        });

        const resData = response.data;
        let trendingList = [];
        if (Array.isArray(resData)) {
          trendingList = resData;
        } else if (resData && Array.isArray(resData.data)) {
          trendingList = resData.data;
        }

        if (isMounted && trendingList.length > 0) {
          setHomeData((prev) => {
            const newState = { ...prev };
            if (term === 'now') newState.trendingNow = trendingList;
            else if (term === 'week') newState.trendingWeek = trendingList;
            else if (term === 'month') newState.trendingMonth = trendingList;
            else if (term === 'year') newState.trendingYear = trendingList;
            return newState;
          });
        }
      } catch (error) {
        console.error(`Error fetching trending data for ${term}:`, error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const tryFallbackData = async () => {
      // If 'now' has no data, try the fallback terms
      if (homeData.trendingNow.length === 0) {
        const fallbackTerms = ['week', 'month', 'year'];
        for (const term of fallbackTerms) {
          await fetchData(term);
          if (homeData[`trending${term.charAt(0).toUpperCase() + term.slice(1)}`].length > 0) {
            break;  // Exit loop once we find data
          }
        }
      } else {
        // If 'now' has data, load the initial term
        await fetchData('now');
      }
    };

    tryFallbackData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [trendingNow]);
  

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

	  const fetchData = async () => {
      try {
			  const postsData = await axios.get(`/api/v1/user_web/posts/?page=${page}`, {
					signal: controller.signal,
				});

				// console.log(postsData.data?.today);

		    // console.log(postsData.data?.isSuccess && postsData.data?.data !== '');

		    if (postsData.data?.isSuccess && postsData.data?.data !== '') {
			    isMounted && setHomeData((prevState) => {
						return {
							...prevState,
							posts: isMounted && postsData.data?.data !== '' ? {
								today: {
									date: postsData.data?.today,
									data: postsData.data?.data.today
								},
								day_before_yesterday: {
									date: postsData.data?.day_before_yesterday,
									data: postsData.data?.data.day_before_yesterday
								},
								yesterday: {
									date: postsData.data?.yesterday,
									data: postsData.data?.data.yesterday
								},
								current_page: postsData.data?.current_page
							} || [] : []
						}
					});

					isMounted && setDataLoading((prevState) => {
			      return {
							...prevState,
							postsLoading: postsData.data?.isSuccess
						}
					});

			    isMounted && setIsLoading(false);
			  }

			  else throw new Error("Failed...");
			  // console.log(homeData.posts);
		  } 

		  catch (error) {
		    console.error("Error fetching posts data:", error.message);
		    // setError("Failed to load data");
				if (isMounted) setIsLoading(false);
		  }
		};

		fetchData();

		return () => {
			isMounted = false;
			controller.abort();
		}
	}, [page])

	const handleImageLoad = () => {
	    setIsImageLoaded(true); // Image is loaded
	};

	const getTrendingData = () => {
	    switch (trendingNow) {
	      case 'now':
	        return homeData.trendingNow;
	      case 'week':
	        return homeData.trendingWeek;
	      case 'month':
	        return homeData.trendingMonth;
	      case 'year':
	        return homeData.trendingYear;
	      default:
	        return [];
	    }
	};
	  
	const getFirstNonEmptyTrending = () => {
	    const currentData = getTrendingData();
	    // console.log("currentData", currentData);
	    if (currentData?.length > 0) return currentData;
	    if (homeData.trendingNow.length > 0) return homeData.trendingNow;
	    if (homeData.trendingWeek.length > 0) return homeData.trendingWeek;
	    if (homeData.trendingMonth.length > 0) return homeData.trendingMonth;
	    if (homeData.trendingYear.length > 0) return homeData.trendingYear;
	    return [];
	};

  const trendingToShow = getFirstNonEmptyTrending();

	// const trendingToShow = getFirstNonEmptyTrending();

	const handlePageClick = (pageNum) => {
	  // console.log("Clicked page:", pageNum);
	  setPage(pageNum);

	  window.scrollTo({
	    top: 0,
	    behavior: 'smooth',
	  });
	};

	const handleAllClick = (id) => {
		navigate(`/posts/${id}?title=${id}&type=all`);
	}

	// console.log(homeData.featured);

	// console.log("trending now: ", homeData.trendingNow, trendingToShow);

	// console.log("posts loading", dataLoading.postsLoading);
	// console.log("posts", homeData.posts);

	// console.log(homeData.categories);
	// console.log(dataLoading.featuredLoading, homeData.featured, homeData.categories);
	// console.log(homeData.trendingNow.length, homeData.trendingWeek.length, homeData.trendingMonth.length, dataLoading.nowLoading);

	return (
		<Layout>
			<Outer className="min-h-full mt-15 md:mt-18">
				<div className="text-black sm:col-span-2 border-0"></div>
				<div className="text-black sm:col-span-8 bg-gray-50 dark:bg-black flex flex-col justify-start p-1 md:pt-2 lg:pt-2 border-0 shadow-xl rounded">
					{/*category*/}
					<Category categoryData={homeData.categories} catLoading={dataLoading.catLoading} />

					<div className="bg-gray-300 h-4 w-full" />

					{/*trending*/}
					<div className="mt-10">
						<div className="flex items-center justify-between">
							<p></p>
							<h5 className="uppercase text-lg md:text-xl font-bold text-center">
								<span className="text-[#ee3483]">trending</span>
								<span className="text-[#00e5fa] ml-2">now</span>
							</h5>
							<div className="mr-2 md:mr-2">
								<select
								    className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								    name="language"
								    id="language-select"
								    value={trendingNow}
								    onChange={handleChange}
								>
								    <option value="now">{translations.home_h1}</option>
								    <option value="week">{translations.home_h2}</option>
								    <option value="month">{translations.home_h3}</option>
								    <option value="year">{translations.home_h4}</option>
								</select>
							</div>
						</div>

						<div ref={scrollContainerRef} className="flex gap-5 lg:gap-3 px-7 xm:px-8 sm:px-0 pb-5 mt-5 overflow-x-auto whitespace-nowrap hide-scrollbar">
						  {isLoading ? (
						    <div className="flex gap-4">
						      {/* Skeleton loader */}
						      {[...Array(9)].map((_, index) => (
						        <div key={index} className="h-48 w-50 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"></div>
						      ))}
						    </div>
						  ) : (
						    <Fragment>
						      {trendingToShow &&
						        trendingToShow.map((i) => (
						          <Card
						            key={i.id}
						            lang={currentLang}
						            className="inline-block border-0 shrink-0 max-w-[65%] xd:max-w-[53%] xm:max-w-[47%] sm:min-w-[20%] md:max-w-[25%] lg:max-w-[25%]" 
						            trending
						            rounded={false}
						            isHome
						            isDataLoaded={!isLoading}
						            isImageLoaded={isImageLoaded}
						            data={i}
						            imgUpload={handleImageLoad}
						            path="/video"
						          />
						        ))}
						    </Fragment>
						  )}
						</div>
					</div>


					{/*featured*/}
					<div className="mt-10">
						<div className="flex items-center justify-center">
							<h5 className="uppercase text-xl font-bold text-center">
								<span className="text-[#ee3483]">Featured</span>
								<span className="text-[#00e5fa] ml-2">videos</span>
							</h5>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 xm:px-8 sm:px-2 pt-3">
							{!dataLoading.featuredLoading ? (
								<>
								      {/* Skeleton loader */}
								      {[...Array(4)].map((_, index) => (
								        <div key={index} className="h-75 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"></div>
								      ))}
								</>
							) : (
									<>
										{homeData.featured && homeData.featured.map(i => (
											<Link to={`/video/${i.id}?title=${i.title.slice(0, 5)}`} key={i.id} className="h-75 sm:h-80 relative dark:shadow-md rounded-lg dark:shadow-white">
										    	<img
												    src={i?.portrait_image ? i?.portrait_image : "https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
												    alt="Portrait"
												    className="block md:hidden w-full h-full object-fill rounded"
													/>

													<img
													  src={i?.image ? i?.image : "https://images.pexels.com/photos/30892416/pexels-photo-30892416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
													  alt="Landscape"
													  className="hidden md:block w-full h-full object-fill rounded"
													/>

										      <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
											      	<div className="bg-[#645047] p-4 flex justify-center items-center rounded-full">
											      		<FaPlay fontSize={20} className="text-white hover:text-red-500" />
											      	</div>
											  	</div>

											  	{/* Volume Icon (bottom-right) */}
											  	<div className="absolute bottom-2 right-2 cursor-pointer">
											      	<div className="bg-[#645047] p-4 flex justify-center items-center rounded-full">
											     		<FaVolumeMute fontSize={20} className="text-white hover:text-red-500" />
											     	</div>
											  	</div>
										  </Link>
										))}
									</>
								)
							}
						</div>
					</div>


					{/*date wise data*/}
					<div className="mt-10">
						<Fragment>
							{homeData.posts && (
								<>
									{/* Today */}
									{homeData.posts.today?.data?.length > 0 && (
										<Fragment>
										  	{!dataLoading.postsLoading ? (
													<div className="flex gap-4 mb-10">
													  {[...Array(4)].map((_, index) => (
													    <div key={index} className="h-48 w-50 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"></div>
													  ))}
													</div>
											) : (
														<Fragment>
													    <div className="flex items-center justify-between">
													      <p></p>
															 	<div className="uppercase text-xl font-bold text-center">
																	<DateFormat homeDate={homeData.posts.today.date} path="posts" />
															  </div>
														    <div 
														    	onClick={() => handleAllClick(homeData.posts.today.date)} 
														    	className="text-base font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
														    >
														    	All
														    </div>
														  </div>
													    <div className="border-0 flex flex-wrap justify-between sm:justify-start grid grid-cols-1 xd:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-3 sm:px-0 gap-4 md:gap-5 lg:gap-5 mt-5">
													      {homeData.posts.today.data.map((item) => (
													            <Card
													              key={item.id}
													              lang={currentLang}
													              className=""
													              trending={false}
													              rounded={false}
													              isPosts
													              isDataLoaded={dataLoading.postsLoading}
													              isImageLoaded={isImageLoaded}
													              data={item}
													              imgUpload={handleImageLoad}
													              path="/video"
													            />
													      ))}
													    </div>
													  </Fragment>
											)}
										</Fragment>
									)}

									{/* Yesterday */}
									{homeData.posts.yesterday?.data?.length > 0 && (
										<Fragment>
										  	{!dataLoading.postsLoading ? (
													<div className="flex gap-4 mb-10">
													  {/* Skeleton loader */}
													  {[...Array(4)].map((_, index) => (
													    <div key={index} className="h-48 w-50 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"></div>
													  ))}
													</div>
												) : (
													<Fragment>
										        <div className="flex items-center justify-between mt-10">
										        	<p></p>
										          	<div className="uppercase text-xl font-bold text-center">
										            	<DateFormat homeDate={homeData.posts.yesterday.date} path="posts" />
										          	</div>
										          	<div 
														    	onClick={() => handleAllClick(homeData.posts.yesterday.date)} 
														    	className="text-base font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
														    >
														    	All
														    </div>
										        </div>
										        <div className="border-0 flex flex-wrap justify-between sm:justify-start grid grid-cols-1 xd:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-3 sm:px-0 gap-4 md:gap-5 lg:gap-5 mt-5">
										          {homeData.posts.yesterday.data.map((item) => (
										            <Card
										              key={item.id}
										              lang={currentLang}
										              className=""
										              trending={false}
										              rounded={false}
										              isPosts
										              isDataLoaded={dataLoading.postsLoading}
										              isImageLoaded={isImageLoaded}
										              data={item}
										              imgUpload={handleImageLoad}
										              path="/video"
										            />
										          ))}
										        </div>
										      </Fragment>
										    )}
										</Fragment>
									)}

									{/* Day Before Yesterday */}
									{homeData.posts.day_before_yesterday?.data?.length > 0 && (
										<Fragment>
										  	{!dataLoading.postsLoading ? (
													<div className="flex gap-4 mb-10">
													  {/* Skeleton loader */}
													  {[...Array(4)].map((_, index) => (
													    <div key={index} className="h-48 w-50 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"></div>
													  ))}
													</div>
												) : (
													<Fragment>
										    		<div className="flex items-center justify-between mt-10">
										        	<p></p>
										          	<div className="uppercase text-xl font-bold text-center">
										            	<DateFormat homeDate={homeData.posts.day_before_yesterday.date} path="posts" />
										          	</div>
										          	<div 
														    	onClick={() => handleAllClick(homeData.posts.day_before_yesterday.date)} 
														    	className="text-base font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
														    >
														    	All
														    </div>
										   			</div>
										    		<div className="border-0 flex flex-wrap justify-between sm:justify-start grid grid-cols-1 xd:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-3 sm:px-0 gap-4 md:gap-5 lg:gap-3 mt-5">
										          {homeData.posts.day_before_yesterday.data.map((item) => (
										            <Card
										              key={item.id}
										              lang={currentLang}
										              className=""
										              trending={false}
										              rounded={false}
										              isPosts
										              isDataLoaded={dataLoading.postsLoading}
										              isImageLoaded={isImageLoaded}
										              data={item}
										              imgUpload={handleImageLoad}
										              path="/video"
										            />
										          ))}
										    		</div>
										    	</Fragment>
										    )}
										</Fragment>
									)}
								</>
							)}
						</Fragment>
					</div>


					<div className="mt-10 flex justify-center items-center">
						<Pagination isLoading={dataLoading.postsLoading} currentPage={homeData.posts?.current_page || 1} onClick={handlePageClick} />
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

export default Home;