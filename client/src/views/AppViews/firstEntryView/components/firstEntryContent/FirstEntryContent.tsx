import s1ImgSrcLight from '../../assets/s1-map-light.svg';
import s2ImgSrcLight from '../../assets/s2-phone-light.svg';
import s3ImgSrcLight from '../../assets/s3-trophy-light.svg';
import s1ImgSrcDark from '../../assets/s1-map-dark.svg';
import s2ImgSrcDark from '../../assets/s2-phone-dark.svg';
import s3ImgSrcDark from '../../assets/s3-trophy-dark.svg';
import Button from '@/components/ui/Button';
import useFirstEntry from '../../hooks/useFirstEntry';
import ImageLightDark from '@/components/ui/ImageLightDark';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';

interface FirstEntryContent {
	imgSrc: { dark: string; light: string };
	imgAlt: string;
	text: string;
}

const firstEntryContentData: FirstEntryContent[] = [
	{
		imgSrc: { dark: s1ImgSrcDark, light: s1ImgSrcLight },
		imgAlt: 'map img',
		text: 'Managing group trips can be a hassle keep everyone *together and *engaged',
	},
	{
		imgSrc: { dark: s2ImgSrcDark, light: s2ImgSrcLight },
		imgAlt: 'phone img',
		text: 'Stay organized on your trips with *live *tracking and trip planning',
	},
	{
		imgSrc: { dark: s3ImgSrcDark, light: s3ImgSrcLight },
		imgAlt: 'trophy img',
		text: 'Make your own *adventure complete challenges, collect points, and compete for *rewards.',
	},
];

interface LocationState {
	params: string;
	redirectRoute: string;
}

const FirstEntryContent = () => {
	const { state } = useLocation() as { state: LocationState | null };
	const nav = useNavigate();
	const { index, handleNext, endFirstEntry } = useFirstEntry(
		firstEntryContentData.length,
		() => {
			localStorage.setItem('notFirstEntry', 'true');

			if (!state || !state.redirectRoute || state.redirectRoute === '/') {
				nav(navigationRoutes.app);
				return;
			}

			const { params, redirectRoute } = state;
			nav(`${redirectRoute}${params}`);
		}
	);

	return (
		<div className='flex grow flex-col gap-4 overflow-hidden'>
			<p className='h-[64px] text-center text-lg font-semibold leading-tight'>
				{renderText(firstEntryContentData[index].text)}
			</p>
			<ImageLightDark
				className='break-x-padding h-full max-h-56 w-[100vw] max-w-none object-contain text-center sm:w-auto'
				srcDark={firstEntryContentData[index].imgSrc.dark}
				srcLight={firstEntryContentData[index].imgSrc.light}
				alt={firstEntryContentData[index].imgAlt}
			/>
			<div className='max-w-[600px]'>
				<Button onClick={handleNext} primary className='w-full'>
					Next
				</Button>
				<Button
					onClick={endFirstEntry}
					className='w-full bg-transparent text-dark underline underline-offset-2 dark:text-light'
				>
					skip
				</Button>
			</div>
		</div>
	);
};

export default FirstEntryContent;

const renderText = (text: string) => {
	return text.split(' ').map((word, i) =>
		word[0] === '*' ? (
			<span key={word + i} className='text-lg leading-tight text-primary'>
				{word.slice(1) + ' '}
			</span>
		) : (
			`${word} `
		)
	);
};
