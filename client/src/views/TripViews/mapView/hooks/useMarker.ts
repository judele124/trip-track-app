import { Map, Marker } from 'mapbox-gl';
import { RefObject, useEffect, useRef } from 'react';

interface IUseMarketProps {
	ref: RefObject<HTMLElement | null>;
	isMapReady: boolean;
	mapRef: RefObject<Map | null>;
	location: { lat: number; lon: number };
	toCenter?: boolean;
}

interface IUseMarketReturn {}

export default function useMarker({
	ref,
	isMapReady,
	mapRef,
	location: { lat, lon },
}: IUseMarketProps): IUseMarketReturn {
	const marker = useRef<Marker | null>(null);
	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;
		if (!ref.current) return;
		marker.current = new Marker({
			element: ref.current,
		})
			.setLngLat([lon, lat])
			.addTo(mapRef.current);
		return () => {
			if (!marker.current) return;
			marker.current.remove();
		};
	}, [isMapReady]);

	useEffect(() => {
		if (!marker.current) return;
		marker.current.setLngLat([lon, lat]);
	}, [lon, lat]);

	return {};
}
