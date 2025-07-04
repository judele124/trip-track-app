import Button from '@/components/ui/Button';
import InputFeildError from '@/components/ui/InputFeildError';
import { useAuthContext } from '@/contexts/AuthContext';
import useAxios from '@/hooks/useAxios';
import useParamFromURL from '@/hooks/useParamFromURL';
import { navigationRoutes } from '@/Routes/routes';
import { startTrip, tripGet } from '@/servises/tripService';
import { Trip } from '@/types/trip';
import { getErrorMessage } from '@/utils/errorMessages';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareTripHeader from './ShareTripHeader.tsx';
import ShareTripMethods from './ShareTripMethods.tsx';

export default function ShareTrip() {
	const { user } = useAuthContext();
	const nav = useNavigate();
	const tripId = useParamFromURL('tripId', () =>
		nav(navigationRoutes.notFound)
	);
	const {
		activate: getTripActivate,
		data: tripData,
		error: getTripError,
		loading: getTripLoading,
		status: getTripStatus,
	} = useAxios<Trip>({
		manual: true,
	});

	const {
		activate: startTripActivate,
		loading: startTripLoading,
		error: startTripError,
		status: startTripStatus,
	} = useAxios<Trip>({
		manual: true,
	});

	useEffect(() => {
		if (tripId) {
			tripGet(getTripActivate, tripId);
		}
	}, [tripId]);

	useEffect(() => {
		if (!startTripStatus) return;
		if (startTripStatus < 200 || startTripStatus >= 300) return;
		nav(`${navigationRoutes.joinTrip}?tripId=${tripData?._id}`);
	}, [startTripStatus]);

	const handleStartTripNow = async () => {
		if (!user || !tripData) return;
		await startTrip(startTripActivate, tripData._id);
	};

	if (getTripError && getTripStatus) {
		return (
			<div className='text-center'>
				<p>{getErrorMessage(getTripStatus)}</p>
				<Button
					primary
					className='mt-5 w-full'
					onClick={() => nav(navigationRoutes.app)}
				>
					Home
				</Button>
			</div>
		);
	}

	if (getTripLoading) {
		return <p>Loading...</p>;
	}

	if (!tripData) return null;

	const isCreator = tripData.creator.toString() === user?._id;

	return (
		<>
			<div className='flex h-full w-full flex-col gap-4'>
				<ShareTripHeader name={tripData.name} />
				{/* share methods */}
				<ShareTripMethods trip={tripData} />
				{isCreator ? (
					<>
						<Button onClick={handleStartTripNow} primary>
							{startTripLoading ? 'Loading...' : 'Start trip now'}
						</Button>
						<Button onClick={() => nav(navigationRoutes.app)}>
							Start later
						</Button>
						{startTripError && startTripStatus && (
							<InputFeildError message={getErrorMessage(startTripStatus)} />
						)}
					</>
				) : (
					<>
						<Button
							onClick={() =>
								nav(`${navigationRoutes.joinTrip}?tripId=${tripData._id}`)
							}
						>
							Navigate to join
						</Button>
					</>
				)}{' '}
			</div>
		</>
	);
}
