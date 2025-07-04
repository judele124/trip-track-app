import { ImgHTMLAttributes } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface IImageLightDarkProps extends ImgHTMLAttributes<HTMLImageElement> {
	srcDark: string;
	srcLight: string;
}
const ImageLightDark = ({
	srcDark,
	srcLight,
	...props
}: IImageLightDarkProps) => {
	const { isDarkMode } = useDarkMode();

	if (isDarkMode) {
		return <img src={srcDark} {...props} />;
	}

	return <img src={srcLight} {...props} />;
};

export default ImageLightDark;
