import { Maneuver, MapBoxDirectionsResponse } from '@/types/map';
import { IRouteLayerSpecification } from '@/utils/map.functions';
import useMapInit from '@/views/TripViews/mapView/hooks/useMapInit';
import { Map } from 'mapbox-gl';
import {
	createContext,
	MutableRefObject,
	ReactNode,
	RefObject,
	useContext,
	useState,
} from 'react';

export interface MapContextValue {
	isMapReady: boolean;
	mapRef: MutableRefObject<Map | null>;
	setMapContainerRef: (ref: HTMLDivElement) => void;
	error: boolean;
}

export interface MapRouteData {
	id: string;
	route: MapBoxDirectionsResponse;
	options: IRouteLayerSpecification;
	beforeLayerIds?: string;
}

export interface MapArrowData {
	outerId: string;
	maneuver: Maneuver;
	fillColor: string;
	outlineColor: string;
}

export interface MapMarkerData {
	id: string;
	ref: RefObject<HTMLElement | null>;
	isMapReady: boolean;
	mapRef: RefObject<Map | null>;
	location: { lat: number; lon: number };
}

const MapContext = createContext<MapContextValue | null>(null);

export const MapContextProvider = ({ children }: { children: ReactNode }) => {
	const [mapContainerRef, setMapContainerRef] = useState<HTMLDivElement | null>(
		null
	);
	const { isMapReady, mapRef, error } = useMapInit(mapContainerRef);

	return (
		<MapContext.Provider
			value={{
				isMapReady,
				mapRef,
				setMapContainerRef,
				error,
			}}
		>
			{children}
		</MapContext.Provider>
	);
};

export const useMapContext = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error('useMapContext must be used within a MapContextProvider');
	}
	return context;
};
