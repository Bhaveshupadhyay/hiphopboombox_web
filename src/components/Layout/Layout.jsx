import { Navbar, LanguageSelect, TopBadge } from "../index";
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
	const location = useLocation();
	const isAudioRoute = location.pathname.startsWith('/audio');

	return (
		<div className="h-full bg-gray-50 dark:bg-black dark:h-full text-black dark:text-white transition-colors">
			<TopBadge />
			
			<header>
				<Navbar />
			</header>

			<section>
				{children}
			</section>

			{!isAudioRoute && (
				<section>
					<LanguageSelect />
				</section>
			)}

			<footer>
			</footer>
		</div>
	)
}

export default Layout;