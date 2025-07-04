import { MapBoxDirectionsResponse } from '@/types/map';
import {
	Map,
	LayerSpecification,
	CircleLayerSpecification,
	GeoJSONSourceSpecification,
	LineLayerSpecification,
	FillLayerSpecification,
} from 'mapbox-gl';

export type Point = [number, number] | number[];

export interface IRouteLayerSpecification {
	lineColor: string;
	lineWidth: number;
	lineOpacity: number;
}

// map drawing functions
export function addSourceAndLayerToMap(
	key: string,
	map: Map,
	sourceData: GeoJSONSourceSpecification,
	layerData: LayerSpecification,
	beforeLayerId?: string
) {
	if (!sourceData.data) {
		throw new Error("sourceData.data doesn't exist");
	}

	const existingSource = map.getSource(key);

	if (existingSource) {
		if (existingSource.type === 'geojson') {
			try {
				existingSource.setData(sourceData.data);
				return;
			} catch (error) {
				console.error('Error updating existing route:', error);
			}
		} else {
			try {
				map.removeLayer(key);
				map.removeSource(key);
			} catch (error) {
				console.error('Error removing existing route:', error);
			}
		}
	}

	try {
		map.addSource(key, sourceData);
	} catch (error) {
		console.error('Error adding source:', error);
	}

	try {
		if (!map.getLayer(key)) {
			map.addLayer(layerData, beforeLayerId);
		}
	} catch (error) {
		console.error('Error adding layer:', error);
	}
}

export function removeSourceAndLayerFromMap(map: Map, key: string) {
	try {
		if (map.getLayer(key)) {
			map.removeLayer(key);
		}

		if (map.getSource(key)) {
			map.removeSource(key);
		}
	} catch (error) {
		console.error('Error removing source and layer:', error);
	}
}

export function addPolygonFillAndOuterFillToMap({
	outerId,
	map,
	fillPointsInOrder,
	strokePointsInOrder,
	fillOptions,
	strokeOptions,
}: {
	outerId: string;
	map: Map;
	fillPointsInOrder: Point[];
	strokePointsInOrder: Point[];
	fillOptions?: FillLayerSpecification['paint'];
	strokeOptions?: FillLayerSpecification['paint'];
}) {
	addSourceAndLayerToMap(
		`${outerId}-fill`,
		map,
		{
			type: 'geojson',
			data: {
				type: 'Polygon',
				coordinates: [fillPointsInOrder],
			},
		},
		{
			id: `${outerId}-fill`,
			type: 'fill',
			source: `${outerId}-fill`,
			paint: fillOptions,
		}
	);

	addSourceAndLayerToMap(
		outerId,
		map,
		{
			type: 'geojson',
			data: {
				type: 'Polygon',
				coordinates: [strokePointsInOrder],
			},
		},
		{
			id: outerId,
			type: 'fill',
			source: outerId,
			paint: strokeOptions,
		},
		`${outerId}-fill`
	);
}

export function removePolygonFillAndOuterFillFromMap(
	map: Map,
	outerId: string
) {
	removeSourceAndLayerFromMap(map, outerId);
	removeSourceAndLayerFromMap(map, `${outerId}-fill`);
}

export function addRouteToMap(
	key: string,
	map: Map,
	routeData: MapBoxDirectionsResponse,
	{ lineColor, lineWidth, lineOpacity }: IRouteLayerSpecification,
	beforeLayerId?: string
) {
	const sourceData: GeoJSONSourceSpecification = {
		type: 'geojson',
		data: {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates: routeData.routes[0].geometry.coordinates,
			},
		},
	};

	const layerData: LineLayerSpecification = {
		id: key,
		type: 'line',
		source: key,
		layout: {
			'line-join': 'round',
			'line-cap': 'round',
		},
		paint: {
			'line-color': lineColor,
			'line-width': lineWidth,
			'line-opacity': lineOpacity,
		},
	};

	addSourceAndLayerToMap(key, map, sourceData, layerData, beforeLayerId);
}

export function removeRouteFromMap(map: Map, key: string) {
	removeSourceAndLayerFromMap(map, key);
}

export function updateRouteLayerStyle(
	map: Map,
	key: string,
	style: {
		lineColor: string;
		lineWidth: number;
		lineOpacity: number;
	}
) {
	if (!map.getLayer(key)) {
		return;
	}

	map.setPaintProperty(key, 'line-color', style.lineColor);
	map.setPaintProperty(key, 'line-width', style.lineWidth);
	map.setPaintProperty(key, 'line-opacity', style.lineOpacity);
}

export function updateRouteSource(
	map: Map,
	key: string,
	sourceData: MapBoxDirectionsResponse
) {
	const existingSource = map.getSource(key);

	if (existingSource) {
		if (existingSource.type === 'geojson') {
			try {
				existingSource.setData({
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: sourceData.routes[0].geometry.coordinates,
					},
				});
				return;
			} catch (error) {
				console.error('Error updating existing route:', error);
			}
		}
	}
}

export function addCircleRadiusToLocation<K extends string>(
	key: K,
	map: Map,
	coordinates: Point,
	circleData: CircleLayerSpecification
) {
	const sourceData: GeoJSONSourceSpecification = {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Point',
						coordinates,
					},
				},
			],
		},
	};

	addSourceAndLayerToMap(key, map, sourceData, circleData);
}

export function closestPointOnSegment(
	point: Point,
	segment: [Point, Point]
): Point {
	const [px, py] = point;
	const [[x1, y1], [x2, y2]] = segment;

	const dx = x2 - x1;
	const dy = y2 - y1;

	const lengthSquared = dx * dx + dy * dy;

	if (lengthSquared === 0) {
		return segment[0];
	}

	let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
	t = Math.max(0, Math.min(1, t));

	const closest: Point = [x1 + t * dx, y1 + t * dy];

	return closest;
}

// map calculation functions

export function findClosestSegment(
	geometryPoints: Point[],
	userLocation: { lon: number; lat: number },
	pointIndexBefore: number,
	pointIndexAfter: number,
	segmentsToCheck: number
): [number, number] {
	const { lon, lat } = userLocation;
	let closestDistance = Infinity;
	let closestBeforeIndex = pointIndexBefore;
	let closestAfterIndex = pointIndexAfter;

	const startCheckIndex = Math.max(0, pointIndexBefore - segmentsToCheck);
	const endCheckIndex = Math.min(
		geometryPoints.length - 2,
		pointIndexAfter + segmentsToCheck
	);

	for (let i = startCheckIndex; i <= endCheckIndex; i++) {
		const segment = [geometryPoints[i], geometryPoints[i + 1]] as [
			Point,
			Point,
		];
		const distanceToSegment = calculateShortestDistancePointToSegment(
			[lon, lat],
			segment
		);

		if (distanceToSegment < closestDistance) {
			closestDistance = distanceToSegment;
			closestBeforeIndex = i;
			closestAfterIndex = i + 1;
		}
	}

	return [closestBeforeIndex, closestAfterIndex];
}

/**
 * Calculates the shortest distance from a point (lon, lat) to a segment (two lon-lat points),
 * and returns the distance in meters using Haversine formula.
 */
export function calculateShortestDistancePointToSegment(
	point: Point,
	segment: [Point, Point]
): number {
	// Find the closest point on the segment
	const closest = closestPointOnSegment(point, segment);

	// Use your haversine-based function to get distance in meters
	return calculateDistanceOnEarth(point, closest);
}

export function metersToPixels(
	map: mapboxgl.Map,
	meters: number,
	[lon, lat]: Point
): number {
	const metersPerDegreeLat = 111320; // 1 degree ≈ 111.32 km
	const metersPerDegreeLon = (40075000 * Math.cos((lat * Math.PI) / 180)) / 360;

	const deltaLat = meters / metersPerDegreeLat;
	const deltaLon = meters / metersPerDegreeLon;

	const origin = map.project([lon, lat]);
	const pointNorth = map.project([lon, lat + deltaLat]);
	const pointEast = map.project([lon + deltaLon, lat]);

	const distNorth = Math.hypot(
		pointNorth.x - origin.x,
		pointNorth.y - origin.y
	);
	const distEast = Math.hypot(pointEast.x - origin.x, pointEast.y - origin.y);

	return Math.max(distNorth, distEast);
}

/**
 * Returns a new [lon, lat] coordinate offset by a given distance and direction.
 *
 * @param lat - Starting latitude
 * @param lon - Starting longitude
 * @param distanceMeters - Distance in meters to move
 * @param directionDegrees - Direction to move, in degrees (0 = north, 90 = east)
 * @returns [lon, lat] - New coordinate
 */
export function offsetLocationByMeters(
	[lon, lat]: Point,
	distanceMeters: number,
	directionDegrees: number
): Point {
	const R = 6378137; // Earth's radius in meters (WGS-84)
	const delta = distanceMeters / R; // angular distance in radians
	const theta = (directionDegrees * Math.PI) / 180; // convert to radians

	const latRad = (lat * Math.PI) / 180;
	const lonRad = (lon * Math.PI) / 180;

	const newLatRad = Math.asin(
		Math.sin(latRad) * Math.cos(delta) +
			Math.cos(latRad) * Math.sin(delta) * Math.cos(theta)
	);

	const newLonRad =
		lonRad +
		Math.atan2(
			Math.sin(theta) * Math.sin(delta) * Math.cos(latRad),
			Math.cos(delta) - Math.sin(latRad) * Math.sin(newLatRad)
		);

	const newLat = (newLatRad * 180) / Math.PI;
	const newLon = (newLonRad * 180) / Math.PI;

	return [newLon, newLat];
}

export function getBearing([lon1, lat1]: Point, [lon2, lat2]: Point): number {
	const toRadians = (deg: number) => (deg * Math.PI) / 180;
	const toDegrees = (rad: number) => (rad * 180) / Math.PI;

	const φ1 = toRadians(lat1);
	const φ2 = toRadians(lat2);
	const Δλ = toRadians(lon2 - lon1);

	const y = Math.sin(Δλ) * Math.cos(φ2);
	const x =
		Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
	const θ = Math.atan2(y, x);

	const bearing = (toDegrees(θ) + 360) % 360;
	return bearing;
}

export function getBearingDiff(b1: number, b2: number) {
	const diff = Math.abs(b1 - b2);
	return diff > 180 ? 360 - diff : diff;
}

export function calculateDistanceOnEarth(
	[lon1, lat1]: Point,
	[lon2, lat2]: Point
) {
	const R = 6378137; // Radius of Earth in meters
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in meters
}
