import { getErrorMessage } from '@/utils/errorMessages';
import Guides from './components/Guides';
import TripErrorState from './components/TripErrorState';
import Header from './components/Header';
import JoinButton from './components/Buttons';
import Reward from './components/Reward';
import ShowTripOnMapBtn from '../../../components/ShowTripOnMapBtn';
import useAxios from '@/hooks/useAxios';
import { Trip } from '@/types/trip';
import { API_BASE_URL } from '@/env.config';
import useParamFromURL from '@/hooks/useParamFromURL';

export default function BeforeJoinTripView() {
	const tripId = useParamFromURL('tripId');

	const {
		data: trip,
		loading: loadingTrip,
		error: errorTrip,
		status,
	} = useAxios<Trip>({
		url: `${API_BASE_URL}/trip/
		${tripId}`,
	});

	return (
		<div className='flex flex-col gap-4 overflow-y-auto'>
			{loadingTrip && <p>Loading...</p>}
			{errorTrip && status && (
				<>
					{status === 404 ? (
						<TripErrorState hasTripId={false} />
					) : (
						<p>{getErrorMessage(status)}</p>
					)}
				</>
			)}
			{trip && (
				<>
					<Header description={trip.description || ''} name={trip.name} />

					<Guides guides={trip.guides} />

					<Reward reward={trip.reward} />

					<JoinButton trip={trip} />

					<ShowTripOnMapBtn trip={trip} />
				</>
			)}
		</div>
	);
}
