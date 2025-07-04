import Icon from '@/components/icons/Icon';
import useToggle from '@/hooks/useToggle';
import { Trip } from '@/types/trip';
import { useRef } from 'react';
import TripActionsModal from './TripActionsModal';
import { useTripShowcase } from './TripsShowcase';

interface ITripRowOptions {
	trip: Trip;
	isCreator: boolean;
}

export default function TripRowOptions({ trip, isCreator }: ITripRowOptions) {
	const { isOpen, setIsOpen } = useToggle();
	const dotsRef = useRef<HTMLButtonElement>(null);
	const { getCreatedTripsData } = useTripShowcase();
	return (
		<>
			<button
				ref={dotsRef}
				className='m-0 -mx-2 p-0 transition-all hover:scale-110'
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(true);
				}}
			>
				<Icon name='threeDots' />
			</button>

			{isOpen && (
				<TripActionsModal
					anchorTo='right'
					trip={trip}
					isCreator={isCreator}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					encorElementRef={dotsRef}
					afterAction={getCreatedTripsData}
				/>
			)}
		</>
	);
}
