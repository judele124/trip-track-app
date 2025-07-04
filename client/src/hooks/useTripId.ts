import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import useParamFromURL from './useParamFromURL';
import { useSearchParams } from 'react-router-dom';

function useTripId(): string {
	const [tripIdFromStorage, setTripIdFromStorage] = useLocalStorage(
		'tripId',
		''
	);
	const tripIdFromParams = useParamFromURL('tripId');
	const [_, setSearchParams] = useSearchParams();
	const [finalTripId, setFinalTripId] = useState<string>('');

	useEffect(() => {
		if (tripIdFromParams) {
			setFinalTripId(tripIdFromParams);
			setTripIdFromStorage(tripIdFromParams);
		} else if (tripIdFromStorage) {
			setFinalTripId(tripIdFromStorage);
			setSearchParams({ tripId: tripIdFromStorage });
		} else {
			setFinalTripId('');
		}
	}, [tripIdFromParams, tripIdFromStorage, setTripIdFromStorage]);

	return finalTripId;
}

export default useTripId;
