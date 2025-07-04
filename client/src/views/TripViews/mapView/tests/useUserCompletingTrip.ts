import { Trip } from '@/types/trip';
import useFakeUserLocation from './useFakeUserLocation';
import { useMapboxDirectionRoute } from '../hooks/useMapboxDirectionRoute';
import { useEffect, useMemo } from 'react';
import { calculateDistanceOnEarth } from '@/utils/map.functions';
import useToggle from '@/hooks/useToggle';
import { RANGE_STEP_THRESHOLD } from '../hooks/useNextStepIndex';

type Point = {
	lon: number;
	lat: number;
};

interface IUseUserCompletingTripProps {
	trip: Trip | null;
	initialUserLocation: { lat: number; lon: number } | null;
	onLocationUpdate?: (location: Point) => void;
	speed?: number;
	updateIntervalMs?: number;
}

export default function useUserCompletingTrip({
	trip,
	initialUserLocation,
	onLocationUpdate,
	speed = 200,
	updateIntervalMs = 50,
}: IUseUserCompletingTripProps) {
	const { isOpen: isAtTripRoute, setIsOpen: setIsAtTripRoute } = useToggle();

	const memoizedPoints = useMemo(
		() => trip?.stops.map((stop) => stop.location) || [],
		[trip]
	);

	const memoizedUserToTripPoints = useMemo(
		() =>
			trip && initialUserLocation
				? [initialUserLocation, trip.stops[0].location]
				: [],
		[trip, initialUserLocation]
	);

	const { routeData } = useMapboxDirectionRoute({
		points: memoizedPoints,
	});

	const { routeData: userToTripRouteData } = useMapboxDirectionRoute({
		points: memoizedUserToTripPoints,
	});

	const fakePoints =
		routeData && userToTripRouteData
			? [
					...userToTripRouteData.routes[0].geometry.coordinates.map(
						(point) => ({
							lat: point[1],
							lon: point[0],
						})
					),
					...routeData.routes[0].geometry.coordinates.map((point) => ({
						lat: point[1],
						lon: point[0],
					})),
				]
			: [];

	const fakeUserLocation = useFakeUserLocation({
		points: fakePoints,
		speed,
		updateIntervalMs,
		onLocationUpdate,
	});

	useEffect(() => {
		if (!trip || !fakeUserLocation || !trip.stops[0].location) return;

		const steps = userToTripRouteData?.routes[0].legs[0].steps;
		const lastStep = steps?.[steps.length - 1];

		if (!lastStep) return;

		const distance = calculateDistanceOnEarth(
			[fakeUserLocation.lon, fakeUserLocation.lat],
			lastStep.maneuver.location
		);

		if (distance < RANGE_STEP_THRESHOLD) {
			setIsAtTripRoute(true);
		}
	}, [fakeUserLocation, trip?.stops, userToTripRouteData, routeData]);

	return {
		fakeUserLocation,
		isAtTripRoute,
	};
}
