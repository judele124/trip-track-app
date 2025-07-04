import { useEffect } from 'react';
import { useMapContext } from '@/contexts/MapContext/MapContext';
import { Maneuver } from '@/types/map';
import { addArrowToMap, removeArrowFromMap } from '@/utils/map.functions.arrow';

interface IMapArrowProps {
	outerId: string;
	maneuver: Maneuver;
	fillColor?: string;
	outlineColor?: string;
}

function MapArrow({
	outerId,
	maneuver,
	fillColor = '#32adff',
	outlineColor = 'white',
}: IMapArrowProps) {
	const { mapRef, isMapReady } = useMapContext();

	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;
		addArrowToMap({
			outerId,
			map: mapRef.current!,
			fillColor,
			outlineColor,
			location: maneuver.location,
			bearing_after: maneuver.bearing_after,
			bearing_before: maneuver.bearing_before,
			length: 15,
			width: 3,
		});

		return () => {
			if (!mapRef.current) return;
			removeArrowFromMap(mapRef.current, outerId);
		};
	}, [mapRef, isMapReady, maneuver, fillColor, outlineColor]);

	return null;
}

export default MapArrow;
