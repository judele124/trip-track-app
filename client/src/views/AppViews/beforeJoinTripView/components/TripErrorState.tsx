import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { navigationRoutes } from '@/Routes/routes';

interface TripErrorStateProps {
	hasTripId: boolean;
}

export default function TripErrorState({ hasTripId }: TripErrorStateProps) {
	const nav = useNavigate();

	return (
		<div className='text-center'>
			<p>
				{!hasTripId
					? '⚠️ Oops! No trip was found.'
					: '🚨 Error: The trip could not be loaded.'}
			</p>
			<Button
				className='mt-5 w-full'
				onClick={() => nav(navigationRoutes.app)}
				primary
			>
				Go Home
			</Button>
		</div>
	);
}
