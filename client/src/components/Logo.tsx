import darkLogo from '../assets/logo-dark.svg';
import lightLogo from '../assets/logo-light.svg';
import { useDarkMode } from '../contexts/DarkModeContext';
const Logo = () => {
	const { isDarkMode } = useDarkMode();

	const img = isDarkMode ? darkLogo : lightLogo;
	return (
		<img
			width={'100%'}
			src={img}
			className='max-h-[20vh]'
			alt={isDarkMode ? 'logo dark mode' : 'logo light mode'}
		></img>
	);
};
export default Logo;
