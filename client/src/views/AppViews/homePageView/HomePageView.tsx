import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import imgSrcLight from './assets/start-screen-light.svg';
import imgSrcDark from './assets/start-screen-dark.svg';
import Button from '@/components/ui/Button';
import ImageLightDark from '@/components/ui/ImageLightDark';
import { navigationRoutes } from '@/Routes/routes';

const HomePageView = () => {
	return (
		<>
			<div className='flex flex-col gap-4 overflow-hidden'>
				<Logo />
				<ImageLightDark
					className='mx-auto size-full'
					srcDark={imgSrcDark}
					srcLight={imgSrcLight}
					alt='illustration of a map'
				/>
				<Link to={navigationRoutes.createTrip}>
					<Button primary className='mb-1 w-full'>
						Create a new trip
					</Button>
				</Link>
			</div>
		</>
	);
};

export default HomePageView;
