import { Trip } from '@/types/trip';
import { useMapContext } from '@/contexts/MapContext/MapContext';
import useDrawRangeAroundStop from '../../hooks/useDrawRangeAroundStop';
import GeneralMarker from './GeneralMarker';
import StopMarker from './StopMarker';

interface ITripStopsMarkersProps {
	currentExpIndex: number;
	isExperienceActive?: boolean;
	normalStops: Trip['stops'];
	experienceStops: Trip['stops'];
}

export default function TripStopsMarkers({
	currentExpIndex,
	isExperienceActive,
	normalStops,
	experienceStops,
}: ITripStopsMarkersProps) {
	return (
		<>
			{experienceStops.length > 0 && (
				<StopsWithExperienceMarker
					currentExpIndex={currentExpIndex}
					isExperienceActive={isExperienceActive}
					experienceStops={experienceStops}
				/>
			)}
			{normalStops.map((stop, i) => (
				<GeneralMarker
					key={`norm-${stop.location.lat}-${stop.location.lon}-${i}`}
					location={stop.location}
				>
					<StopMarker
						disableExperience={false}
						isExperienceActive={false}
						stop={stop}
						index={i}
					/>
				</GeneralMarker>
			))}
		</>
	);
}

interface IStopsWithExperienceMarker {
	currentExpIndex: number;
	isExperienceActive?: boolean;
	experienceStops: Trip['stops'];
}

function StopsWithExperienceMarker({
	currentExpIndex,
	isExperienceActive,
	experienceStops,
}: IStopsWithExperienceMarker) {
	const { mapRef, isMapReady } = useMapContext();
	const safeExpIndex = Math.min(currentExpIndex, experienceStops.length - 1);
	useDrawRangeAroundStop({
		isMapReady,
		mapRef,
		location: [
			experienceStops[safeExpIndex].location.lon,
			experienceStops[safeExpIndex].location.lat,
		],
		circleRadius: 40,
	});

	return (
		<>
			{experienceStops.map((stop, i) => (
				<GeneralMarker
					key={`exp-${stop.location.lat}-${stop.location.lon}-${i}`}
					location={stop.location}
				>
					<StopMarker
						disableExperience={currentExpIndex !== i}
						isExperienceActive={isExperienceActive}
						stop={stop}
						index={i}
					/>
				</GeneralMarker>
			))}
		</>
	);
}
