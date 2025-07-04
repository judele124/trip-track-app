import { useMapContext } from '@/contexts/MapContext/MapContext';
import { MapBoxDirectionsResponse } from '@/types/map';
import {
	addRouteToMap,
	IRouteLayerSpecification,
	removeRouteFromMap,
	updateRouteLayerStyle,
	updateRouteSource,
} from '@/utils/map.functions';
import { useEffect } from 'react';

interface IMapRouteProps {
	id: string;
	route: MapBoxDirectionsResponse;
	options?: IRouteLayerSpecification;
	beforeLayerIds?: string;
}

export default function MapRoute({
	id,
	route,
	options = {
		lineColor: '#1b4965',
		lineOpacity: 1,
		lineWidth: 4,
	},
	beforeLayerIds,
}: IMapRouteProps) {
	const { mapRef, isMapReady } = useMapContext();

	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;
		addRouteToMap(id, mapRef.current, route, options, beforeLayerIds);
		return () => {
			if (!mapRef.current) return;
			removeRouteFromMap(mapRef.current, id);
		};
	}, [id]);

	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;
		updateRouteLayerStyle(mapRef.current, id, options);
	}, [options]);

	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;
		updateRouteSource(mapRef.current, id, route);
	}, [route]);

	return null;
}
