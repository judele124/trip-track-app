import MapRoute from './MapRoute';
import { IRouteLayerSpecification } from '@/utils/map.functions';
import DirectionComponent from './DirectionComponent';
import useRouteAndNavigation from '../../hooks/useRouteAndNavigation';
import { useAuthContext } from '@/contexts/AuthContext';
import MapArrow from './MapArrow';
import FinalStepMarker from '../Markers/FinalStepMarker';

interface IRouteAndNavigationProps {
	routeId: string;
	originalPoints: { lon: number; lat: number }[];
	routeOptions?: IRouteLayerSpecification;
	fillRouteOption?: IRouteLayerSpecification;
	userLocation: { lat: number; lon: number } | null;
	active?: boolean;
	isTripRoute?: boolean;
}

export default function RouteAndNavigation({
	routeId,
	originalPoints,
	routeOptions,
	fillRouteOption,
	userLocation,
	active,
	isTripRoute,
}: IRouteAndNavigationProps) {
	const { user } = useAuthContext();

	const { routeData, nextStepIndex, walkedPath, userToStepNextDistance } =
		useRouteAndNavigation({
			userLocation,
			points: originalPoints,
			active,
		});

	if (!routeData || !userLocation || !user) return null;

	return (
		<>
			{active && (
				<>
					{nextStepIndex < routeData.routes[0].legs[0].steps.length - 1 && (
						<MapArrow
							outerId={`arrow-${routeId}`}
							maneuver={
								routeData.routes[0].legs[0].steps[nextStepIndex].maneuver
							}
							fillColor='#32adff'
							outlineColor='#264fa8'
						/>
					)}

					<MapRoute
						id={`walkedPath-${routeId}`}
						route={{
							code: '123',
							uuid: '123',
							waypoints: [],
							routes: [
								{
									distance: 0,
									duration: 0,
									geometry: { coordinates: walkedPath, type: 'LineString' },
									legs: [],
									weight: 0,
								},
							],
						}}
						options={fillRouteOption}
						beforeLayerIds={
							nextStepIndex < routeData.routes[0].legs[0].steps.length - 1
								? `arrow-${routeId}`
								: undefined
						}
					/>

					{isTripRoute && (
						<FinalStepMarker
							location={
								routeData.routes[0].legs[0].steps[
									routeData.routes[0].legs[0].steps.length - 1
								].maneuver.location
							}
						/>
					)}

					{/* Direction Info UI */}
					<DirectionComponent
						nextStepIndex={nextStepIndex}
						userToStepNextDistance={userToStepNextDistance}
						steps={routeData.routes[0].legs[0].steps}
					/>
				</>
			)}

			<MapRoute
				route={routeData}
				options={routeOptions}
				id={`route-${routeId}`}
				beforeLayerIds={active ? `walkedPath-${routeId}` : undefined}
			/>
		</>
	);
}
