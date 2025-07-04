import Button from '@/components/ui/Button';
import useAxios from '@/hooks/useAxios';
import { API_BASE_URL } from '@/env.config';
import TripsList from './TripsList';
import { createContext, useContext, useEffect, useState } from 'react';
import { Trip } from '@/types/trip';
import { useAuthContext } from '@/contexts/AuthContext';

const filterList = ['createdTrips', 'joinedTrips'] as const;

const tripsShowcaseContext = createContext<{
	getCreatedTripsData: () => void;
} | null>(null);

export default function TripsShowcase() {
	const {
		activate,
		data: createdTripsData = [],
		loading: createdTripsLoading,
		error: createdTripsError,
		status: createdTripsStatus,
	} = useAxios<Trip[]>({
		url: `${API_BASE_URL}/trip/getAll`,
		manual: true,
	});

	const {
		data: joinedTripsData = [],
		loading: joinedTripsLoading,
		error: joinedTripsError,
		status: joinedTripsStatus,
	} = useAxios<Trip[]>({
		url: `${API_BASE_URL}/trip/user-in-participants`,
	});

	const { user } = useAuthContext();

	const [filter, setFilter] = useState<(typeof filterList)[number]>(
		filterList[0]
	);

	const getCreatedTripsData = () => {
		activate();
	};

	useEffect(() => {
		getCreatedTripsData();
	}, []);

	return (
		<tripsShowcaseContext.Provider value={{ getCreatedTripsData }}>
			{/* buttons */}
			<div className='mt-2'>
				<Button
					onClick={() => setFilter('createdTrips')}
					primary={filter === 'createdTrips'}
					className={`mr-2 rounded-lg px-2 py-1 text-sm font-normal text-white dark:text-dark ${filter === 'createdTrips' ? 'dark:text-white' : ''}`}
				>
					Created trips
				</Button>
				<Button
					onClick={() => setFilter('joinedTrips')}
					primary={filter === 'joinedTrips'}
					className={`rounded-lg px-2 py-1 text-sm font-normal text-white dark:text-dark ${filter === 'joinedTrips' ? 'dark:text-white' : ''}`}
				>
					Joined trips
				</Button>
			</div>

			{/* heading */}
			<h3 className='py-3'>
				{filter === 'createdTrips' ? 'Created Trips' : 'Joined trips'}
			</h3>

			<div className='no-scrollbar flex w-full flex-col gap-2 overflow-y-auto pb-10'>
				{!createdTripsLoading && (
					<TripsList
						isCreatedTrips={filter === 'createdTrips'}
						data={
							filter === 'createdTrips'
								? createdTripsData
								: joinedTripsData.filter(
										(trip) => trip.creator._id !== user?._id
									)
						}
						loading={
							filter === 'createdTrips'
								? createdTripsLoading
								: joinedTripsLoading
						}
						status={
							filter === 'createdTrips' ? createdTripsStatus : joinedTripsStatus
						}
						hasError={
							(filter === 'createdTrips'
								? createdTripsError
								: joinedTripsError) != undefined
						}
					/>
				)}
			</div>
		</tripsShowcaseContext.Provider>
	);
}

export const useTripShowcase = () => {
	const context = useContext(tripsShowcaseContext);
	if (!context) {
		throw new Error(
			'useTripShowcase must be used inside of a TripsShowcaseProvider'
		);
	}
	return context;
};
