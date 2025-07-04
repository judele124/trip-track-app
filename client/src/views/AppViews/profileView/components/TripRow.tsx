import { Trip } from '@/types/trip';
import TripStatusButton from './TripStatusButton';
import { Types } from 'trip-track-package';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';
import TripRowOptions from './TripRowOptions';
import { useAuthContext } from '@/contexts/AuthContext';

interface TripRowProps {
	trip: Trip;
	i: number;
	isCreator: boolean;
}

export default function TripRow({ trip, i, isCreator }: TripRowProps) {
	const nav = useNavigate();
	const { user } = useAuthContext();

	return (
		<>
			<div
				onClick={() => nav(`${navigationRoutes.tripDetails}/${trip._id}`)}
				key={i}
				className={`flex cursor-pointer items-center rounded-2xl border-2 border-primary bg-white px-4 py-2 text-left hover:bg-opacity-50 dark:bg-secondary dark:hover:bg-opacity-50`}
			>
				<div className='w-[50%]'>
					<h5 className='-mb-1'>
						{trip.name[0].toUpperCase() + trip.name.slice(1)}
					</h5>
					<div className='flex items-center justify-start gap-1'>
						<AddressOrLocation stop={trip.stops[0]} />
						<span>to</span>
						<AddressOrLocation stop={trip.stops[trip.stops.length - 1]} />
					</div>
				</div>
				<div className='flex w-[50%] items-center justify-between gap-2 pl-2'>
					<TripStatusButton status={trip.status} />
					{trip.reward && <span className='text-lg'>🏆</span>}
					{(trip.status !== 'completed' || user?.role === 'developer') && (
						<TripRowOptions trip={trip} isCreator={isCreator} />
					)}
				</div>
			</div>
		</>
	);
}

function AddressOrLocation({ stop }: { stop: Types['Trip']['Stop']['Model'] }) {
	return stop.address ? (
		<p
			title={stop.address}
			className='overflow-hidden text-ellipsis whitespace-nowrap text-sm'
		>
			{stop.address}
		</p>
	) : (
		<p
			title={`${stop.location.lon}-${stop.location.lat}`}
			className='overflow-hidden text-ellipsis whitespace-nowrap text-sm'
		>
			{stop.location.lon}-{stop.location.lat}
		</p>
	);
}
