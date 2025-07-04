import { useCallback, useEffect, useRef, useState } from 'react';
import { useMapContext } from '@/contexts/MapContext/MapContext';
import { useTripSocket } from '@/contexts/socketContext/SocketContext';

interface MapTrackingOptions {
	zoom?: number;
	speed?: number;
	duration?: number;
	trackingTarget: 'current-user' | string;
	setTrackingToCurrentUser: () => void;
}

export function useMapTracking({
	zoom = 16,
	speed = 1.5,
	duration = 1000,
	trackingTarget,
	setTrackingToCurrentUser,
}: MapTrackingOptions) {
	const { mapRef, isMapReady } = useMapContext();
	const [isTracking, setIsTracking] = useState(true);
	const isUserInteractingWithMap = useRef(false);
	const { usersLocations } = useTripSocket();

	const centerOnLocation = useCallback(
		(location: { lon: number; lat: number }) => {
			if (!mapRef.current || isUserInteractingWithMap.current) return;
			if (!isTracking) return;

			const currentZoom = mapRef.current.getZoom();
			const currentBearing = mapRef.current.getBearing();
			const currentPitch = mapRef.current.getPitch();

			mapRef.current.flyTo({
				center: [location.lon, location.lat],
				zoom: currentZoom,
				bearing: currentBearing,
				pitch: currentPitch,
				speed,
				essential: true,
				duration,
			});
		},
		[mapRef, zoom, speed, duration, isTracking]
	);

	const toggleTracking = useCallback(
		(value?: boolean) => {
			if (trackingTarget !== 'current-user') {
				setTrackingToCurrentUser();
				setIsTracking(true);
				return;
			}

			const newValue = value ?? !isTracking;
			setIsTracking(newValue);
		},
		[isTracking, setTrackingToCurrentUser, trackingTarget]
	);

	const handleDragStart = useCallback(() => {
		if (isTracking) {
			toggleTracking(false);
		}
	}, [isTracking, toggleTracking]);

	useEffect(() => {
		if (!isMapReady) return;
		if (trackingTarget === 'current-user') return;

		const userLocation = usersLocations.find(
			(user) => user.id === trackingTarget
		);

		if (!userLocation) return;

		centerOnLocation(userLocation.location);
	}, [isMapReady, trackingTarget, usersLocations, centerOnLocation]);

	useEffect(() => {
		if (!mapRef.current) return;

		const map = mapRef.current;

		map.on('dragstart', handleDragStart);
		map.on('zoomstart', () => {
			isUserInteractingWithMap.current = true;
		});
		map.on('pitchstart', () => {
			isUserInteractingWithMap.current = true;
		});
		map.on('rotatestart', () => {
			isUserInteractingWithMap.current = true;
		});
		map.on('zoomend', () => {
			isUserInteractingWithMap.current = false;
		});
		map.on('pitchend', () => {
			isUserInteractingWithMap.current = false;
		});
		map.on('rotateend', () => {
			isUserInteractingWithMap.current = false;
		});

		return () => {
			map.off('dragstart', handleDragStart);
			map.off('zoomstart', () => {
				isUserInteractingWithMap.current = true;
			});
			map.off('pitchstart', () => {
				isUserInteractingWithMap.current = true;
			});
			map.off('rotatestart', () => {
				isUserInteractingWithMap.current = true;
			});
			map.off('zoomend', () => {
				isUserInteractingWithMap.current = false;
			});
			map.off('pitchend', () => {
				isUserInteractingWithMap.current = false;
			});
			map.off('rotateend', () => {
				isUserInteractingWithMap.current = false;
			});
		};
	}, [isMapReady, handleDragStart, toggleTracking]);

	return {
		isTracking,
		toggleTracking,
		centerOnLocation,
	};
}
