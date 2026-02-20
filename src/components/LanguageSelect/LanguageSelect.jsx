import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/language/language.actions';

const LanguageSelect = () => {
	const dispatch = useDispatch();
  	const language = useSelector((state) => state.lang.currentLang);

	// const handleChange = async (e) => {
	//     const selectedLang = e.target.value;
	//     const response = await fetch(`/locales/${selectedLang === 'es' ? 'sp' : 'en'}.json`);
	//     const translations = await response.json();
	//     dispatch(setLanguage(selectedLang, translations));
	// };

	const handleChange = async (e) => {
	  const selectedLang = e.target.value;

	  if (!selectedLang) return; // Prevent any invalid or undefined values

	  const fileName = selectedLang === 'es' ? 'sp' : 'en';
	  
	  try {
	    const response = await fetch(`/locales/${fileName}.json`);
	    const translations = await response.json();
	    dispatch(setLanguage(selectedLang, translations));
	  } catch (error) {
	    console.error("Error loading language file:", error);
	  }
	};

	useEffect(() => {
	    // Load default language
	    handleChange({ target: { value: 'en' } });
	}, []);

	return (
		<div className="fixed bottom-10 sm:bottom-4 left-4">
		  <select
		    className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		    name="language"
		    id="language-select"
		    value={language}
        	onChange={handleChange}
		  >
		    <option value="en">🇺🇸 English</option>
        	<option value="es">🇪🇸 Español</option>
		  </select>
		</div>
	)
}

export default LanguageSelect;