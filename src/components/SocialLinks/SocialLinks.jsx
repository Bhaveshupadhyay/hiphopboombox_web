import { FaInstagram, FaFacebook, FaLink } from 'react-icons/fa'; // Import icons from React Icons
import { useState, useEffect } from 'react';

const SocialLinks = ({ link }) => {
  // console.log(link);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Split the links by commas
    setLinks(link ? link.split(',').map(l => l.trim()) : []);
  }, [link]);

  return (
    <p>
        {links.map((link, index) => {
          if (link.includes('instagram.com')) {
            return (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl text-blue-600" />
              </a>
            );
          }
          if (link.includes('facebook.com')) {
            return (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl text-blue-800" />
              </a>
            );
          }
          if (link.includes('funmesocial.com')) {
            return (
              <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                <img
                  className="bg-transparen"
                  src="https://i.ibb.co/C2nmQQB/fms.jpg"
                  width="30"
                  height="30"
                  alt="FUNMESOCIAL"
                  style={{ borderRadius: '50%' }}  // Corrected inline style
                />
              </a>
            );
          }
          return (
            <a key={index} href={link} target="_blank" rel="noopener noreferrer">
              <FaLink className="text-2xl text-gray-700" />
            </a>
          );
        })}
    </p>
  );
};

export default SocialLinks;
