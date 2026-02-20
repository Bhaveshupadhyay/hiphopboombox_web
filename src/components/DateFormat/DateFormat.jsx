const DateFormat = ({ homeDate, path }) => {
	const date = new Date(homeDate);
  	const month = date.toLocaleString('en-US', { month: 'long' }); // "April"
  	const day = date.getDate(); // 12
  	const year = date.getFullYear(); // 2025

	return (
	    <h5 className={`uppercase ${path === "video" ? 'text-lg font-normal' : 'text-xl font-bold'} text-center`}>
	      <span className={`${path === "video" ? 'text-black dark:text-white' : 'text-[#00e5fa]'}`}>{month}</span>{' '}
	      <span className={`${path === "video" ? 'text-black dark:text-white' : 'text-[#00e5fa]'}`}>{day}</span>{' '}
	      <span className={`${path === "video" ? 'text-black dark:text-white' : 'text-[#00e5fa]'}`}>{year}</span>
	    </h5>
	);
}

export default DateFormat;