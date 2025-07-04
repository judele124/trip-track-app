import useAxios from '@/hooks/useAxios';
import {
	createContext,
	useContext,
	ReactNode,
	useState,
	FC,
	useEffect,
} from 'react';
import useTripId from '@/hooks/useTripId';
import { tripGet } from '@/servises/tripService';
import { Trip } from '@/types/trip';
import { useAuthContext } from './AuthContext';

interface TripContextValue {
	trip: Trip | null;
	setTrip: (trip: Trip | null) => void;
	loadingTrip: boolean;
	errorTrip: Error | null;
	tripId: string;
	status: number | undefined;
	isGuide: boolean | null;
}

const TripContext = createContext<TripContextValue | null>(null);

interface TripProviderProps {
	children: ReactNode;
}

const checkIfIsGuide = (userId: string, trip: Trip) => {
	if (
		trip.guides.flatMap((g) => g._id).includes(userId) ||
		trip.creator._id === userId
	) {
		return true;
	}
	return false;
};

const TripProvider: FC<TripProviderProps> = ({ children }) => {
	const { user } = useAuthContext();
	const tripId = useTripId();
	const [trip, setTrip] = useState<Trip | null>(null);

	let isGuide = null;
	if (trip && user) isGuide = checkIfIsGuide(user._id, trip);

	const {
		activate,
		loading: loadingTrip,
		error: errorTrip,
		status,
	} = useAxios<Trip>({
		manual: true,
		onSuccess: ({ data }) => data && setTrip(data),
	});

	useEffect(() => {
		if (tripId && !trip) tripGet(activate, tripId);
	}, [tripId]);

	return (
		<TripContext.Provider
			value={{
				trip,
				setTrip,
				loadingTrip,
				errorTrip,
				tripId,
				status,
				isGuide,
			}}
		>
			{children}
		</TripContext.Provider>
	);
};

export default TripProvider;

export const useTripContext = () => {
	const context = useContext(TripContext);
	if (!context) {
		throw new Error('useTripContext must be used within a TripProvider');
	}
	return context;
};
