import { useMapTracking } from '@/views/TripViews/mapView/hooks/useMapTracking';
import { createContext, useContext, useState } from 'react';

interface LocationContextType {
	trackingTarget: 'current-user' | string;
	setTrackingTarget: (target: 'current-user' | string) => void;
	toggleTracking: (value?: boolean) => void;
	isTracking: boolean;
	centerOnLocation: (location: { lon: number; lat: number }) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
	undefined
);

export const TrackLocationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [trackingTarget, setTrackingTarget] = useState<'current-user' | string>(
		'current-user'
	);

	const { toggleTracking, isTracking, centerOnLocation } = useMapTracking({
		trackingTarget,
		setTrackingToCurrentUser: () => setTrackingTarget('current-user'),
	});

	return (
		<LocationContext.Provider
			value={{
				trackingTarget,
				setTrackingTarget,
				toggleTracking,
				isTracking,
				centerOnLocation,
			}}
		>
			{children}
		</LocationContext.Provider>
	);
};

export const useTrackLocationContext = (): LocationContextType => {
	const context = useContext(LocationContext);
	if (!context) {
		throw new Error(
			'useLocationContext must be used within a LocationProvider'
		);
	}
	return context;
};
