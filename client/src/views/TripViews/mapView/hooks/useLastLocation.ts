import { useEffect, useRef } from 'react';

interface IUseLastUserLocationProps {
	currentLocation: { lat: number; lon: number } | null;
}

export default function useLastUserLocation({
	currentLocation,
}: IUseLastUserLocationProps) {
	const lastLocationRef = useRef<{ lat: number; lon: number } | null>(null);

	useEffect(() => {
		return () => {
			if (!currentLocation) return;
			lastLocationRef.current = currentLocation;
		};
	}, [currentLocation]);

	return lastLocationRef.current;
}
