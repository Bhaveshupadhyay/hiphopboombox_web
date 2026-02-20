import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa';
import { FaThreads } from "react-icons/fa6";

const getPlatformIcon = (url, path) => {
  if (url.includes("instagram")) {
    return <FaInstagram className={`${path === 'video' ? 'text-black' : 'text-white'} hover:text-pink-500`} />;
  }
  if (url.includes("facebook")) {
    return <FaFacebook className={`${path === 'video' ? 'text-black' : 'text-white'} hover:text-blue-600`} />;
  }
  if (url.includes("tiktok")) {
    return <FaTiktok className={`${path === 'video' ? 'text-black' : 'text-white'} hover:text-black`} />;
  }
  if (url.includes("twitter")) {
    return <FaTwitter className={`${path === 'video' ? 'text-black' : 'text-white'} hover:text-sky-500`} />;
  }
  if (url.includes("threads")) {
    return <FaThreads className={`${path === 'video' ? 'text-black' : 'text-white'} hover:text-gray-800`} />;
  }
  if (url.includes("youtube")) {
    return <FaYoutube className={`${path === 'video' ? 'text-black' : 'text-white'} hover:text-red-600`} />;
  }
  return null;
};

const SocialMedia = ({ homeSocialData, path }) => {
  const links = homeSocialData.split(',');

  // console.log(homeSocialData);

  return (
    <div className={`flex ${path === 'posts' ? 'justify-center' : 'justify-start'} items-center gap-4`}>
      {links.map((url, index) => (
	    <Link
	        key={index}
	        to={url.trim()}
	        target="_blank"
	        rel="noopener noreferrer"
	        className="text-2xl hover:scale-110 transition-transform"
	    >
	      {getPlatformIcon(url, path)}
	    </Link>
      ))}
    </div>
  );
};

export default SocialMedia;
