import MapModal from '@/components/MapModal';
import Button from '@/components/ui/Button';
import useToggle from '@/hooks/useToggle';
import { Trip } from '@/types/trip';

interface IShowTripOnMapBtnProps {
	trip: Trip;
}

export default function ShowTripOnMapBtn({ trip }: IShowTripOnMapBtnProps) {
	const { isOpen: mapOpen, toggle: toggleMap } = useToggle();

	return (
		<>
			<Button
				className='bg-transparent text-sm text-dark underline dark:text-light'
				onClick={toggleMap}
			>
				Show trip on map
			</Button>

			<MapModal
				key={`map-modal-${trip._id}`}
				mapOpen={mapOpen}
				toggleMap={toggleMap}
				disableExperiences
				stops={trip.stops}
			/>
		</>
	);
}
