import Modal from './ui/Modal';
import GeneralMarker from '@/views/TripViews/mapView/components/Markers/GeneralMarker';
import Map from '@/views/TripViews/mapView/Map';
import StopMarker from '@/views/TripViews/mapView/components/Markers/StopMarker';
import { Types } from 'trip-track-package';
import MapRoute from '@/views/TripViews/mapView/components/RoutesAndNavigation/MapRoute';
import { useMapboxDirectionRoute } from '@/views/TripViews/mapView/hooks/useMapboxDirectionRoute';
import { useMemo } from 'react';
import { Trip } from '@/types/trip';
import { MapContextProvider } from '@/contexts/MapContext/MapContext';

interface IMapModalProps {
	mapOpen: boolean;
	toggleMap: () => void;
	stops: Trip['stops'];
	disableExperiences?: true;
}

export default function MapModal({
	mapOpen,
	toggleMap,
	stops,
	disableExperiences,
}: IMapModalProps) {
	const points = useMemo(() => stops.map((stop) => stop.location), [stops]);

	const { routeData } = useMapboxDirectionRoute({
		points,
	});

	return (
		<Modal open={mapOpen} center onBackdropClick={() => toggleMap()}>
			<div className='h-[80vh] w-[90vw] overflow-hidden rounded-2xl'>
				<MapContextProvider>
					<Map>
						{routeData && <MapRoute id='modal-route' route={routeData} />}
						{stops.map((stop: Types['Trip']['Stop']['Model'], i) => (
							<GeneralMarker
								key={`${stop.location.lon}-${stop.location.lat}-${i}`}
								location={stop.location}
							>
								<StopMarker
									index={i}
									disableExperience={disableExperiences}
									isTripActive={false}
									stop={stop}
								/>
							</GeneralMarker>
						))}
					</Map>
				</MapContextProvider>
			</div>
		</Modal>
	);
}
