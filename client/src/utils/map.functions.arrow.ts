import * as turf from '@turf/turf';
import { Map } from 'mapbox-gl';
import {
	addPolygonFillAndOuterFillToMap,
	offsetLocationByMeters,
	Point,
	removePolygonFillAndOuterFillFromMap,
} from './map.functions';

interface IAddArrowToMap {
	outerId: string;
	map: Map;
	fillColor?: string;
	outlineColor?: string;
	location: Point;
	bearing_after: number;
	bearing_before: number;
	length: number;
	width: number;
}

export function addArrowToMap({
	outerId,
	map,
	fillColor,
	outlineColor,
	location,
	bearing_after,
	bearing_before,
	length,
	width,
}: IAddArrowToMap) {
	// arrow body points
	const {
		backCenter,
		backLeft,
		backRight,
		centerLeft,
		centerRight,
		frontLeft,
		frontRight,
		frontCenter,
	} = getArrowBasePoints({
		location,
		length,
		width,
		bearing_before,
		bearing_after,
	});

	// arrow head points
	const { arrowHeadBackLeft, arrowHeadBackRight, arrowHeadTop } =
		getArrowHeadPoints({
			baseCenterLocation: frontCenter,
			bearingTop: bearing_after,
			length: width * 1.5,
			width: width * 1.2,
		});

	const pointsInOrder = [
		backCenter,
		backLeft,
		centerLeft,
		frontLeft,
		arrowHeadBackLeft,
		arrowHeadTop,
		arrowHeadBackRight,
		frontRight,
		centerRight,
		backRight,
		backCenter,
	];

	addPolygonFillAndOuterFillToMap({
		outerId,
		map,
		fillPointsInOrder: pointsInOrder,
		strokePointsInOrder: getArrowOutlineWithTurf(pointsInOrder, 0.7),
		fillOptions: {
			'fill-color': fillColor,
		},
		strokeOptions: {
			'fill-color': outlineColor,
		},
	});
}

export function removeArrowFromMap(map: Map, outerId: string) {
	removePolygonFillAndOuterFillFromMap(map, outerId);
}

function getArrowBasePoints({
	bearing_after,
	bearing_before,
	length,
	location,
	width,
}: {
	location: Point;
	length: number;
	width: number;
	bearing_before: number;
	bearing_after: number;
}) {
	const backCenter = offsetLocationByMeters(
		location,
		length / 2,
		bearing_before + 180
	);
	const backRight = offsetLocationByMeters(
		backCenter,
		width / 2,
		bearing_before + 90
	);
	const backLeft = offsetLocationByMeters(
		backCenter,
		width / 2,
		bearing_before - 90
	);

	const frontCenter = offsetLocationByMeters(
		location,
		length / 2 / 2,
		bearing_after
	);

	const frontRight = offsetLocationByMeters(
		frontCenter,
		width / 2,
		bearing_after + 90
	);

	const frontLeft = offsetLocationByMeters(
		frontCenter,
		width / 2,
		bearing_after - 90
	);

	const { left, right } = getLeftAndRightAngles(bearing_before, bearing_after);

	const centerRight = offsetLocationByMeters(location, width / 2, right);

	const centerLeft = offsetLocationByMeters(location, width / 2, left);

	return {
		backCenter,
		backRight,
		centerRight,
		frontRight,
		frontLeft,
		centerLeft,
		backLeft,
		frontCenter,
	};
}

function getArrowHeadPoints({
	baseCenterLocation,
	bearingTop,
	length,
	width,
}: {
	baseCenterLocation: Point;
	bearingTop: number;
	length: number;
	width: number;
}) {
	const arrowHeadBackLeft = offsetLocationByMeters(
		baseCenterLocation,
		width,
		bearingTop - 90
	);
	const arrowHeadBackRight = offsetLocationByMeters(
		baseCenterLocation,
		width,
		bearingTop + 90
	);

	const arrowHeadTop = offsetLocationByMeters(
		baseCenterLocation,
		length,
		bearingTop
	);

	return {
		arrowHeadBackLeft,
		arrowHeadBackRight,
		arrowHeadTop,
	};
}

function getArrowOutlineWithTurf(
	pointsInOrder: Point[],
	offset: number
): Point[] {
	const coordinates = pointsInOrder.map((point) => [point[0], point[1]]);
	coordinates.push(coordinates[0]); // To close the polygon
	const polygon = turf.polygon([coordinates]);

	const offsetPolygon = turf.buffer(polygon, offset, { units: 'meters' });

	if (
		!offsetPolygon ||
		!offsetPolygon.geometry ||
		!offsetPolygon.geometry.coordinates
	) {
		throw new Error('Failed to calculate the offset polygon');
	}

	const offsetCoordinates = offsetPolygon.geometry.coordinates[0];

	return offsetCoordinates.map(([lon, lat]) => [lon, lat] as [number, number]);
}

function getLeftAndRightAngles(bearingBefore: number, bearingAfter: number) {
	const delta = (bearingAfter - bearingBefore + 360) % 360;
	let direction: 'left' | 'right' = 'left';

	if (delta <= 180) {
		direction = 'right';
	}

	const bearingBeforeReversed = (bearingBefore + 180) % 360;

	const middle = getAverageAngle(bearingBeforeReversed, bearingAfter);

	if (direction === 'left') {
		return { left: middle, right: (middle + 180) % 360 };
	} else {
		return { left: (middle + 180) % 360, right: middle % 360 };
	}
}

function getAverageAngle(bearingBefore: number, bearingAfter: number): number {
	const toRad = (deg: number): number => (deg * Math.PI) / 180;
	const toDeg = (rad: number): number => ((rad * 180) / Math.PI + 360) % 360;

	const x1 = Math.cos(toRad(bearingBefore));
	const y1 = Math.sin(toRad(bearingBefore));
	const x2 = Math.cos(toRad(bearingAfter));
	const y2 = Math.sin(toRad(bearingAfter));

	const xAvg = (x1 + x2) / 2;
	const yAvg = (y1 + y2) / 2;

	const average = toDeg(Math.atan2(yAvg, xAvg));

	return Number(average.toFixed(2));
}
