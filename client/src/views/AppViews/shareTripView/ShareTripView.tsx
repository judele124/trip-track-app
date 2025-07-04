import ProgressLine from '../createTripView/components/ProgressLine';
import ShareTrip from './components/ShareTrip';

export default function ShareTripView() {
	return (
		<>
			<ShareTrip />
			<ProgressLine
				className='absolute bottom-5 mt-auto w-full'
				length={3}
				index={3}
			/>
		</>
	);
}
