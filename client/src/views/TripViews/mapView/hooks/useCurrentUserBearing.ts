import { getBearing } from '@/utils/map.functions';
import { useEffect, useRef } from 'react';
import useLastUserLocation from './useLastLocation';

interface IuseCurrentUserBearingProps {
	userLocation: { lat: number; lon: number } | null;
}

export default function useCurrentUserBearing({
	userLocation,
}: IuseCurrentUserBearingProps): number {
	const lastLocation = useLastUserLocation({ currentLocation: userLocation });
	const bearingRef = useRef<number>(0);

	useEffect(() => {
		if (!userLocation || !lastLocation) return;

		const bearing = getBearing(
			[lastLocation.lon, lastLocation.lat],
			[userLocation.lon, userLocation.lat]
		);

		bearingRef.current = bearing;
	}, [userLocation, lastLocation]);

	return bearingRef.current;
}
