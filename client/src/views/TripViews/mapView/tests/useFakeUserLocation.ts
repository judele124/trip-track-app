import { useEffect, useRef, useState } from 'react';

type Point = {
	lon: number;
	lat: number;
};

interface Props {
	points: Point[];
	speed?: number; // km/h
	onLocationUpdate?: (location: Point) => void;
	updateIntervalMs?: number;
}

function haversineDistance(p1: Point, p2: Point) {
	const toRad = (x: number) => (x * Math.PI) / 180;
	const R = 6371e3; // Earth's radius in meters

	const dLat = toRad(p2.lat - p1.lat);
	const dLon = toRad(p2.lon - p1.lon);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLon / 2) ** 2;

	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function interpolate(p1: Point, p2: Point, t: number): Point {
	return {
		lon: p1.lon + (p2.lon - p1.lon) * t,
		lat: p1.lat + (p2.lat - p1.lat) * t,
	};
}

export default function useFakeUserLocation({
	points,
	speed = 30,
	onLocationUpdate,
	updateIntervalMs = 1000,
}: Props) {
	const [location, setLocation] = useState<Point | null>(null);
	const indexRef = useRef(0);
	const progressRef = useRef(0);

	useEffect(() => {
		if (points.length < 2) return;

		const interval = setInterval(() => {
			const from = points[indexRef.current];
			const to = points[indexRef.current + 1];
			if (!from || !to) {
				clearInterval(interval);
				return;
			}
			const distance = haversineDistance(from, to);
			const speedPerMs = (speed * 1000) / 3600000;
			const step = speedPerMs * updateIntervalMs;

			const totalSteps = distance / step;
			progressRef.current += 1 / totalSteps;

			if (progressRef.current >= 1) {
				indexRef.current++;
				progressRef.current = 0;

				if (indexRef.current >= points.length - 1) {
					setLocation(to);
					onLocationUpdate?.(to);
					clearInterval(interval);
					return;
				}
			}

			const newLocation = interpolate(from, to, progressRef.current);
			setLocation(newLocation);
			onLocationUpdate?.(newLocation);
		}, updateIntervalMs);

		return () => clearInterval(interval);
	}, [points, speed, updateIntervalMs, onLocationUpdate]);

	return location;
}
