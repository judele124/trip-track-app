import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopNavigation from './componenets/TopNavigationBar';
import BottomNavigation from './componenets/BottomNavigation';
import { useTripContext } from '@/contexts/TripContext';
import { navigationRoutes } from '@/Routes/routes';
import Button from '@/components/ui/Button';
import Icon from '@/components/icons/Icon';
import TripNotActiveMessage from '@/components/TripNotActiveMessage';
import { createContext, MutableRefObject, useContext, useRef } from 'react';
import DevPanel from '@/components/DevPanel';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTripSocket } from '@/contexts/socketContext/SocketContext';
import FinishTripModal from '@/components/FinishTripModal';
import Map from '@/views/TripViews/mapView/Map';
import UserTripLogic from '@/views/TripViews/mapView/components/UserTripLogic';

interface TripLayoutContextValue {
	topNavigationRef: MutableRefObject<HTMLDivElement | null>;
	bottomNavigationRef: MutableRefObject<HTMLDivElement | null>;
	pageContentRef: MutableRefObject<HTMLDivElement | null>;
}

const TripLayoutContext = createContext<TripLayoutContextValue | null>(null);

const TripLayout = () => {
	let { pathname } = useLocation();
	const title = titleFromPath(pathname);
	const { trip, tripId, loadingTrip, status } = useTripContext();
	const { isTripActive } = useTripSocket();
	const nav = useNavigate();
	const { user } = useAuthContext();

	const topNavigationRef = useRef<HTMLDivElement | null>(null);
	const bottomNavigationRef = useRef<HTMLDivElement | null>(null);
	const pageContentRef = useRef<HTMLDivElement | null>(null);

	return (
		<div className='page-colors relative z-0 mx-auto flex h-dvh max-w-[450px] flex-col'>
			{/* top navigation */}
			<TopNavigation
				setRef={(node) => (topNavigationRef.current = node)}
				title={title.replace('-', ' ')}
			/>

			{user?.role === 'developer' && trip && <DevPanel tripId={trip._id} />}

			{/* main content */}
			<TripLayoutContext.Provider
				value={{ topNavigationRef, bottomNavigationRef, pageContentRef }}
			>
				<div
					ref={pageContentRef}
					className='relative -z-10 grow overflow-hidden bg-secondary/20'
				>
					{loadingTrip && (
						<div className='flex h-full items-center justify-center'>
							<Icon size='50' className='fill-primary' name='spinner' />
						</div>
					)}

					{status && (
						<>
							{!trip ? (
								<div className='page-padding relative text-center'>
									<p>
										{!tripId
											? '⚠️ Oops! No trip was found.'
											: '🚨 Error: The trip could not be loaded.'}
									</p>
									<Button
										className='mt-5 w-full'
										onClick={() => nav(navigationRoutes.app)}
										primary
									>
										Go Home
									</Button>
								</div>
							) : trip.status !== 'started' ? (
								<TripNotActiveMessage trip={trip} />
							) : (
								<>
									{!isTripActive && <FinishTripModal tripId={tripId} />}
									<Outlet />
									<div className='page-colors absolute inset-0 z-0'>
										<Map>
											<UserTripLogic />
										</Map>
									</div>
								</>
							)}
						</>
					)}
				</div>
			</TripLayoutContext.Provider>

			{/* bottom navigation */}
			<BottomNavigation
				setRef={(node) => (bottomNavigationRef.current = node)}
			/>
		</div>
	);
};

export default TripLayout;

export function useTripLayout() {
	const context = useContext(TripLayoutContext);
	if (!context) {
		throw new Error('useTripLayout must be used within a TripLayout');
	}
	return context;
}

const titleFromPath = (path: string) => {
	const arr = path.split('/');
	path = arr[arr.length - 1];
	return path.charAt(0).toUpperCase() + path.slice(1);
};
