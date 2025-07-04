import { useEffect, useState } from 'react';

interface IUseCurrentUserLocationProps {
	onLocationUpdate?: (location: { lon: number; lat: number }) => void;
}
interface IUseCurrentUserLocationReturn {
	userCurrentLocation: null | { lon: number; lat: number };
	initialUserLocation: null | { lon: number; lat: number };
}
export default function useCurrentUserLocation({
	onLocationUpdate,
}: IUseCurrentUserLocationProps = {}): IUseCurrentUserLocationReturn {
	const [userCurrentLocation, setUserCurrentLocation] = useState<null | {
		lon: number;
		lat: number;
	}>(null);
	const [initialUserLocation, setInitialUserLocation] = useState<null | {
		lon: number;
		lat: number;
	}>(null);

	useEffect(() => {
		const watchId = navigator.geolocation.watchPosition((pos) => {
			setUserCurrentLocation({
				lon: pos.coords.longitude,
				lat: pos.coords.latitude,
			});
			onLocationUpdate?.({
				lon: pos.coords.longitude,
				lat: pos.coords.latitude,
			});

			if (!initialUserLocation) {
				setInitialUserLocation({
					lon: pos.coords.longitude,
					lat: pos.coords.latitude,
				});
			}
		});

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, []);

	return {
		userCurrentLocation,
		initialUserLocation,
	};
}
