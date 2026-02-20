import { useState, useEffect, useRef } from 'react';

const TopBadge = () => {
  const [isVisible, setIsVisible] = useState(true); // Track visibility of TopBadge
  const [browserIcon, setBrowserIcon] = useState(""); // Store the browser icon to display
  const badgeRef = useRef(null); // Reference to TopBadge element

  // Close the TopBadge when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target)) {
        setIsVisible(false); // Hide the TopBadge if clicked outside
      }
    };

    // Listen for clicks on the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Detect device type and set the browser icon accordingly
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setBrowserIcon("https://i.ibb.co/7tXRyNpn/chrome-removebg-preview.png"); // Chrome for Android
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setBrowserIcon("https://i.ibb.co/B5y6w6QK/safari-removebg-preview.png"); // Safari for iOS
    } else {
      setBrowserIcon(""); // Fallback: No icon for other devices
    }
  }, []);

  if (!isVisible) return null; // If TopBadge is not visible, don't render it

  // Function to handle redirection based on device type (for Get button)
  const handleRedirect = (url) => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check if the device is Android
    if (/android/i.test(userAgent)) {
      window.open("https://play.google.com/store/apps/details?id=com.hiphop.boombox", "_blank"); // Android Play Store link in a new tab
    }
    // Check if the device is iPhone
    else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      window.open("https://apps.apple.com/us/app/hiphopboombox/id6680194519", "_blank"); // iPhone App Store link in a new tab
    } else {
      window.open(url, "_blank"); // Fallback: Open the URL in a new tab
    }
  };

  return (
    <div
      ref={badgeRef}
      className="w-full h-20 flex flex-col md:flex-row items-center justify-between p-1 bg-black text-white transition-colors fixed top-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Left section: Logo and App button */}
      <div className="w-full flex flex-row items-center justify-between text-sm uppercase">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src="https://i.ibb.co/YTG0NWH/removal-ai-05798ca5-1590-4c7f-ba40-4de1847cf462-hiphop3.png"
            width="30"
            height="20"
            alt="Hiphopboombox Logo"
          />
          <span>Hiphopboombox</span>
        </div>

        <div
          onClick={() => handleRedirect("https://hiphopboombox.com")}
          className="cursor-pointer hover:underline text-pink-500 mb-2 border bg-white py-1 px-4 rounded-2xl"
        >
          Get
        </div>
      </div>

      {/* Right section: Website link with Browser Image */}
      <div className="w-full flex flex-row items-center justify-between text-sm uppercase">
        <div className="flex items-center space-x-2 mb-2">
          {browserIcon && (
            <img
              src={browserIcon} // Dynamically set the browser icon based on device type
              alt="Browser Icon"
              width="30"
              height="20"
            />
          )}
          <span>website</span>
        </div>

        <div
          onClick={() => window.open("https://hiphopboombox.com", "_blank")}
          className="cursor-pointer hover:underline text-white border border-white py-1 px-4 rounded-2xl"
        >
          website
        </div>
      </div>
    </div>
  );
};

export default TopBadge;