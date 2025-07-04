import {
	calculateShortestDistancePointToSegment,
	calculateDistanceOnEarth,
	offsetLocationByMeters,
	getBearing,
	Point,
	closestPointOnSegment,
} from '@/utils/map.functions';
import { useEffect, useRef, useState } from 'react';

export interface IUseRouteProgressProps {
	routeCoordinates: Point[];
	userLocation: Point | null;
	active?: boolean;
}

export interface IUseRouteProgressReturn {
	walkedPath: Point[];
	resetWalkedPath: () => void;
}

const DISTANCE_THRESHOLD = 10; // meters
const MIN_MOVEMENT = 2; // meters - minimum movement to record

export function useRouteProgress({
	routeCoordinates,
	userLocation,
	active,
}: IUseRouteProgressProps): IUseRouteProgressReturn {
	const [walkedPath, setWalkedPath] = useState<Point[]>([]);
	const lastPoint = useRef<Point | null>(null);
	const lastSegmentIndex = useRef<number | null>(null);
	const lastUserLocation = useRef<Point | null>(null);

	useEffect(() => {
		if (!active || !userLocation || routeCoordinates.length < 2) return;

		// Skip if we haven't moved enough
		if (
			lastUserLocation.current &&
			calculateDistanceOnEarth(lastUserLocation.current, userLocation) <
				MIN_MOVEMENT
		) {
			return;
		}

		const { closestSegment, segmentStartIndex } = findClosestSegment(
			routeCoordinates,
			userLocation
		);

		if (!closestSegment) return;

		const closedPoint = closestPointOnSegment(userLocation, closestSegment);

		const isOnExistingPath = walkedPath.some((point, index) => {
			if (index === walkedPath.length - 1) return false;
			return isPointOnSegment(closedPoint, point, walkedPath[index + 1]);
		});

		if (isOnExistingPath) {
			lastUserLocation.current = userLocation;
			return;
		}

		if (!lastPoint.current) {
			lastPoint.current = closedPoint;
			setWalkedPath(interpolatePoints(routeCoordinates[0], closedPoint));
			lastUserLocation.current = userLocation;
			return;
		}

		const distanceFromClosest = calculateDistanceOnEarth(
			userLocation,
			closedPoint
		);

		if (distanceFromClosest < DISTANCE_THRESHOLD && segmentStartIndex < 0) {
			return;
		}

		const newPoints: Point[] = [];

		const { segmentStartIndex: lastSegmentStartIndex } = findClosestSegment(
			routeCoordinates,
			lastPoint.current
		);

		for (let i = lastSegmentStartIndex; i < segmentStartIndex; i++) {
			newPoints.push(
				...interpolatePoints(routeCoordinates[i], routeCoordinates[i + 1])
			);
			lastPoint.current = routeCoordinates[i + 1];
		}

		newPoints.push(...interpolatePoints(lastPoint.current, closedPoint));

		setWalkedPath((prev) => [...prev, ...newPoints.slice(1)]);
		lastUserLocation.current = userLocation;
		lastPoint.current = closedPoint;
		lastSegmentIndex.current = segmentStartIndex;
	}, [userLocation, routeCoordinates, active]);

	return {
		walkedPath,
		resetWalkedPath: () => {
			setWalkedPath([]);
			lastPoint.current = null;
			lastSegmentIndex.current = null;
			lastUserLocation.current = null;
		},
	};
}

function interpolatePoints(start: Point, end: Point): Point[] {
	const distance = calculateDistanceOnEarth(start, end);
	if (distance <= DISTANCE_THRESHOLD) {
		return [start, end];
	}

	const numPoints = Math.floor(distance / DISTANCE_THRESHOLD);
	const bearing = getBearing(start, end);
	const points: Point[] = [start];

	for (let i = 1; i < numPoints; i++) {
		const point = offsetLocationByMeters(
			start,
			i * DISTANCE_THRESHOLD,
			bearing
		);
		points.push(point);
	}
	points.push(end);

	return points;
}

const findClosestSegment = (points: Point[], location: Point) => {
	let minDistance = Infinity;
	let closestSegment: [Point, Point] | null = null;
	let segmentStartIndex = -1;

	for (let i = 0; i < points.length - 1; i++) {
		const segment: [Point, Point] = [points[i], points[i + 1]];
		const distance = calculateShortestDistancePointToSegment(location, segment);

		if (distance < minDistance) {
			minDistance = distance;
			closestSegment = segment;
			segmentStartIndex = i;
		}
	}

	return { closestSegment, segmentStartIndex };
};

function isPointOnSegment(p: Point, a: Point, b: Point): boolean {
	const epsilon = 1e-6;

	// cross product to check colinearity
	const cross = (p[1] - a[1]) * (b[0] - a[0]) - (p[0] - a[0]) * (b[1] - a[1]);
	if (Math.abs(cross) > epsilon) return false;

	// check if p is between a and b
	const withinLat =
		p[1] >= Math.min(a[1], b[1]) - epsilon &&
		p[1] <= Math.max(a[1], b[1]) + epsilon;
	const withinLng =
		p[0] >= Math.min(a[0], b[0]) - epsilon &&
		p[0] <= Math.max(a[0], b[0]) + epsilon;

	return withinLat && withinLng;
}
