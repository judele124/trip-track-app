import useAxios from '@/hooks/useAxios';
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapBoxDirectionsResponse } from '@/types/map';

interface IUseMapRoute {
	points: { lon: number; lat: number }[];
}

interface IUseMapRouteReturn {
	routeData: MapBoxDirectionsResponse | null | undefined;
}

export const useMapboxDirectionRoute = ({
	points,
}: IUseMapRoute): IUseMapRouteReturn => {
	const { data, activate } = useAxios<MapBoxDirectionsResponse>({
		method: 'GET',
		manual: true,
	});

	useEffect(() => {
		if (!points.length) return;

		const getDirectionsRoute = (points: IUseMapRoute['points']) => {
			const coords = points.map((p) => `${p.lon},${p.lat}`).join(';');
			activate({
				url: `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&access_token=${mapboxgl.accessToken}&steps=true&overview=full&language=${navigator.language}`,
				method: 'GET',
				withCredentials: false,
			});
		};

		getDirectionsRoute(points);
	}, [points]);

	return {
		routeData: data,
	};
};
