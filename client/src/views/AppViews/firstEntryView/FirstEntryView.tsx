import Logo from '@/components/Logo.tsx';
import FirstEntryContent from './components/firstEntryContent/FirstEntryContent';

const FirstEntryView = () => {
	return (
		<>
			<div className='flex h-full flex-col gap-4 overflow-hidden'>
				<div>
					<h3 className='text-xl font-bold'>Welcome to</h3>
					<Logo />
				</div>
				<FirstEntryContent />
			</div>
		</>
	);
};

export default FirstEntryView;
