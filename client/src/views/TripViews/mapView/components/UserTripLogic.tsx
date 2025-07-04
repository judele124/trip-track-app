import { useAuthContext } from '@/contexts/AuthContext';
import { useTripContext } from '@/contexts/TripContext';
import RouteAndNavigation from './RoutesAndNavigation/RouteAndNavigation';
import TripStartLocationMarker from './Markers/TripStartLocationMarker';
import TripStopsMarkers from './Markers/TripStopsMarkers';
import OtherUserMarker from './Markers/OtherUserMarker';
import CurrentUserMarker from './Markers/CurrentUserMarker';
import LoadingLocation from './LoadingLocation';
import { useEffect, useMemo } from 'react';
import { calculateDistanceOnEarth } from '@/utils/map.functions';
import { RANGE_STEP_THRESHOLD } from '../hooks/useNextStepIndex';
import { useTripSocket } from '@/contexts/socketContext/SocketContext';
import useToggle from '@/hooks/useToggle';
import Notification from './Notifications';
import { Trip } from '@/types/trip';
import useCurrentUserLocation from '../hooks/useCurrentUserLocation';
import { TrackingToggle } from './MapControls/TrackingToggle';
import { useTrackLocationContext } from '@/contexts/TrackLocationContext';

const STOP_MARKER_RANGE = 30;

const INACTIVE_ROUTE_OPACITY = 0.5;
const ROUTE_OPACITY = 1;

const INACTIVE_ROUTE_COLOR = '#3e5c76';
const ACTIVE_ROUTE_COLOR = '#1b4965';
const ROUTE_FILL_COLOR = '#5fa8d3';

const ROUTE_WIDTH = 6;
const ROUTE_FILL_WIDTH = 2;

export default function UserTripLogic() {
	const { user } = useAuthContext();
	const { trip } = useTripContext();
	const {
		usersLocations,
		currentExpIndex,
		isExperienceActive,
		setIsTripActive,
		socket,
		setExperienceActive,
		notificationQueue,
		removeLastNotificationFromQueue,
		removingLastNotificationFromQueue,
		usersInLiveTripExpData,
	} = useTripSocket();

	const { toggleTracking, isTracking, trackingTarget, centerOnLocation } =
		useTrackLocationContext();

	const { normalStops, lastStopLocation, stopsWithExperience } = useMemo(() => {
		return splitStopsByExperience(trip?.stops || []);
	}, [trip?.stops]);

	const { userCurrentLocation, initialUserLocation } = useCurrentUserLocation({
		onLocationUpdate: (location) => {
			if (!trip || !socket || !user) return;

			if (trackingTarget === 'current-user') {
				centerOnLocation(location);
			}

			const userPosition = [location.lon, location.lat];

			const isUserNearLastStop =
				lastStopLocation &&
				calculateDistanceOnEarth(userPosition, lastStopLocation) <
					STOP_MARKER_RANGE;

			if (isUserNearLastStop) {
				setIsTripActive(false);
				return;
			}

			socket.emit('updateLocation', trip._id, location);

			const stopLocation = stopsWithExperience[currentExpIndex]?.location;

			if (stopLocation) {
				const stopPosition = [stopLocation.lon, stopLocation.lat];

				const isUserNearStop =
					calculateDistanceOnEarth(userPosition, stopPosition) <
					STOP_MARKER_RANGE;

				if (isUserNearStop) {
					if (!isExperienceActive) {
						socket.emit(
							'userInExperience',
							trip._id,
							user._id,
							currentExpIndex
						);
					}
				} else {
					if (isExperienceActive) {
						setExperienceActive(false);
					}
				}
			}
		},
	});

	useEffect(() => {
		if (!lastStopLocation && currentExpIndex >= stopsWithExperience.length) {
			setIsTripActive(false);
		}
	}, [currentExpIndex]);

	const memoizedTripPoints = useMemo(
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

	const { isOpen: isAtTripRoute, setIsOpen: setIsAtTripRoute } = useToggle();

	useEffect(() => {
		if (!trip || !userCurrentLocation || !trip.stops[0].location) return;
		const distance = calculateDistanceOnEarth(
			[userCurrentLocation.lon, userCurrentLocation.lat],
			[trip.stops[0].location.lon, trip.stops[0].location.lat]
		);

		if (distance < RANGE_STEP_THRESHOLD) {
			setIsAtTripRoute(true);
		}
	}, [userCurrentLocation, trip?.stops]);

	return (
		<>
			{/* loading location */}
			{!userCurrentLocation && <LoadingLocation />}

			{userCurrentLocation && user && (
				<CurrentUserMarker location={userCurrentLocation} user={user} />
			)}

			{usersLocations.map(({ id, location }) => (
				<OtherUserMarker
					location={location}
					user={usersInLiveTripExpData.find((user) => user.userId === id)}
					key={id}
				/>
			))}

			{trip && userCurrentLocation && (
				<>
					<TrackingToggle
						isTracking={isTracking && trackingTarget === 'current-user'}
						onToggle={() => toggleTracking()}
					/>
					{isAtTripRoute ? (
						<TripStopsMarkers
							isExperienceActive={isExperienceActive}
							currentExpIndex={currentExpIndex}
							normalStops={normalStops}
							experienceStops={stopsWithExperience}
						/>
					) : (
						<TripStartLocationMarker location={trip.stops[0].location} />
					)}

					<Notification
						isModalOpen={
							notificationQueue.length > 0 && !removingLastNotificationFromQueue
						}
						notification={notificationQueue[notificationQueue.length - 1]}
						closeModal={() => removeLastNotificationFromQueue()}
					/>

					<RouteAndNavigation
						routeId='trip-route'
						originalPoints={memoizedTripPoints}
						routeOptions={{
							lineColor: isAtTripRoute
								? ACTIVE_ROUTE_COLOR
								: INACTIVE_ROUTE_COLOR,
							lineWidth: ROUTE_WIDTH,
							lineOpacity: isAtTripRoute
								? ROUTE_OPACITY
								: INACTIVE_ROUTE_OPACITY,
						}}
						fillRouteOption={{
							lineColor: ROUTE_FILL_COLOR,
							lineWidth: ROUTE_FILL_WIDTH,
							lineOpacity: ROUTE_OPACITY,
						}}
						userLocation={userCurrentLocation}
						active={isAtTripRoute}
						isTripRoute
					/>

					{!isAtTripRoute && (
						<RouteAndNavigation
							active={true}
							routeId='user-to-trip-route'
							originalPoints={memoizedUserToTripPoints}
							routeOptions={{
								lineColor: ACTIVE_ROUTE_COLOR,
								lineWidth: ROUTE_WIDTH,
								lineOpacity: ROUTE_OPACITY,
							}}
							fillRouteOption={{
								lineColor: ROUTE_FILL_COLOR,
								lineWidth: ROUTE_FILL_WIDTH,
								lineOpacity: ROUTE_OPACITY,
							}}
							userLocation={userCurrentLocation}
						/>
					)}
				</>
			)}
		</>
	);
}

type StopMarkerProps = Trip['stops'];

interface SplitStopsByExperienceValue {
	normalStops: StopMarkerProps;
	stopsWithExperience: StopMarkerProps;
	lastStopLocation: number[] | null;
}

const splitStopsByExperience = (
	stops: StopMarkerProps
): SplitStopsByExperienceValue => {
	const stopsWithExperience: StopMarkerProps = [];
	const normalStops: StopMarkerProps = [];
	let lastStopLocation: SplitStopsByExperienceValue['lastStopLocation'] = null;
	stops.forEach((stop, index) => {
		if (stop.experience) {
			stopsWithExperience.push(stop);
		} else {
			normalStops.push(stop);
			if (index === stops.length - 1) {
				//This variable is set to know if the last stop is just a stop or stop with experience.
				lastStopLocation = [stop.location.lon, stop.location.lat];
			}
		}
	});
	return { normalStops, stopsWithExperience, lastStopLocation };
};
