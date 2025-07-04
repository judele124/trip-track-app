import { DirectionStep } from '@/types/map';
import {
	calculateDistanceOnEarth,
	getBearingDiff,
} from '@/utils/map.functions';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import useCurrentUserBearing from './useCurrentUserBearing';

interface IUseNextStepIndexProps {
	userLocation: { lon: number; lat: number } | null;
	steps: DirectionStep[] | undefined;
	active?: boolean;
}

interface IUseNextStepIndexReturn {
	nextStepIndex: number;
	userToStepNextDistance: MutableRefObject<number>;
}

export const RANGE_STEP_THRESHOLD = 5; // in meters
export const ANGLE_STEP_THRESHOLD = 20; // degrees

export default function useNextStepIndex({
	userLocation,
	steps,
	active,
}: IUseNextStepIndexProps): IUseNextStepIndexReturn {
	const [nextStepIndex, setNextStepIndex] = useState<number>(1);
	const wasInStepRange = useRef<boolean[]>([]);
	const userToStepNextDistance = useRef(0);

	const bearing = useCurrentUserBearing({ userLocation });

	useEffect(() => {
		if (!active || !userLocation || !steps?.[nextStepIndex]) return;
		const { lat, lon } = userLocation;

		const currentStep = steps[nextStepIndex];

		userToStepNextDistance.current = calculateDistanceOnEarth(
			[lon, lat],
			currentStep.maneuver.location
		);

		if (userToStepNextDistance.current < RANGE_STEP_THRESHOLD) {
			wasInStepRange.current[nextStepIndex] = true;
		}

		const bearingToCompare = currentStep.maneuver.bearing_after;

		if (wasInStepRange.current[nextStepIndex] && steps[nextStepIndex + 1]) {
			const userDistanceToNextPoint = calculateDistanceOnEarth(
				[lon, lat],
				steps[nextStepIndex + 1].maneuver.location
			);
			if (userDistanceToNextPoint < RANGE_STEP_THRESHOLD) {
				wasInStepRange.current[nextStepIndex + 1] = true;
				setNextStepIndex((prev) => prev + 1);
			} else if (
				getBearingDiff(bearing, bearingToCompare) < ANGLE_STEP_THRESHOLD
			) {
				setNextStepIndex((prev) => prev + 1);
			}
		}
	}, [userLocation, active, steps]);

	return { nextStepIndex, userToStepNextDistance };
}
