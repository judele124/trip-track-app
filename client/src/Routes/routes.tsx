import NavbarLayout from '@/components/layouts/NavbarLayout';
import PageLayout from '@/components/layouts/PageLayout';
import TripLayout from '@/components/layouts/TripLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import TripProtectedRoute from '@/components/TripProtectedRoute';
import { MapContextProvider } from '@/contexts/MapContext/MapContext';
import SocketProvider from '@/contexts/socketContext';
import { TrackLocationProvider } from '@/contexts/TrackLocationContext';
import TripProvider from '@/contexts/TripContext';
import BeforeJoinTripView from '@/views/AppViews/beforeJoinTripView';
import CreateTripView from '@/views/AppViews/createTripView';
import FirstEntryView from '@/views/AppViews/firstEntryView/FirstEntryView';
import HomePageView from '@/views/AppViews/homePageView';
import LoginView from '@/views/AppViews/loginView/LoginView';
import LogoutView from '@/views/AppViews/logoutView';
import ProfileView from '@/views/AppViews/profileView';
import ShareTripView from '@/views/AppViews/shareTripView';
import TripDetailsView from '@/views/AppViews/TripDetailsView';
import PageNotFoundView from '@/views/pageNotFoundView';
import ChatView from '@/views/TripViews/chatView';
import LoadingTripDataView from '@/views/TripViews/loadingTripDataView';
import MapView from '@/views/TripViews/mapView';
import ParticipantsView from '@/views/TripViews/participantsView';
import UrgentNotificationsView from '@/views/TripViews/UrgentNotificationsView';
import { RouteObject } from 'react-router-dom';

const baseRoutes = {
	app: '/app',
	trip: '/trip',
} as const;

const tripRoutes = {
	map: `map`,
	participants: `participants`,
	chat: `chat`,
	urgentNotifications: 'urgent-notifications',
	notFound: 'not-found',
} as const;

const appRoutes = {
	login: `login`,
	logout: `logout`,
	firstEntry: `first-entry`,
	createTrip: `create-trip`,
	shareTrip: `share-trip`,
	joinTrip: `join-trip`,
	profile: 'profile',
	trip: 'trip',
	notFound: 'not-found',
} as const;

export const navigationRoutes = {
	login: `${baseRoutes.app}/${appRoutes.login}`,
	firstEntry: `${baseRoutes.app}/${appRoutes.firstEntry}`,
	createTrip: `${baseRoutes.app}/${appRoutes.createTrip}`,
	shareTrip: `${baseRoutes.app}/${appRoutes.shareTrip}`,
	joinTrip: `${baseRoutes.app}/${appRoutes.joinTrip}`,
	profile: `${baseRoutes.app}/${appRoutes.profile}`,
	tripDetails: `${baseRoutes.app}/${appRoutes.trip}`,
	logout: `${baseRoutes.app}/${appRoutes.logout}`,

	map: `${baseRoutes.trip}/${tripRoutes.map}`,
	participants: `${baseRoutes.trip}/${tripRoutes.participants}`,
	chat: `${baseRoutes.trip}/${tripRoutes.chat}`,
	urgentNotifications: `${baseRoutes.trip}/urgent-notifications`,

	notFound: `${appRoutes.notFound}`,
	app: `${baseRoutes.app}`,
	trip: `${baseRoutes.trip}`,
} as const;

const routes: RouteObject[] = [
	{
		path: `${baseRoutes.app}/*`,
		element: <PageLayout />,
		children: [
			{
				element: <NavbarLayout />,
				children: [
					{ index: true, element: <HomePageView /> },
					{ path: appRoutes.firstEntry, element: <FirstEntryView /> },
					{ path: appRoutes.login, element: <LoginView /> },
					{ path: appRoutes.logout, element: <LogoutView /> },
					{
						path: appRoutes.createTrip,
						element: (
							<ProtectedRoute>
								<CreateTripView />
							</ProtectedRoute>
						),
					},
					{
						path: appRoutes.shareTrip,
						element: <ShareTripView />,
					},
					{
						path: appRoutes.joinTrip,
						element: <BeforeJoinTripView />,
					},
					{
						path: appRoutes.profile,
						element: (
							<ProtectedRoute>
								<ProfileView />
							</ProtectedRoute>
						),
					},
					{
						path: `${appRoutes.trip}/:tripId`,
						element: (
							<ProtectedRoute>
								<TripDetailsView />
							</ProtectedRoute>
						),
					},
					{ path: '*', element: <PageNotFoundView /> },
				],
			},
		],
	},
	{
		path: `${baseRoutes.trip}/*`,
		element: (
			<TripProvider>
				<TripProtectedRoute>
					<SocketProvider>
						<MapContextProvider>
							<TrackLocationProvider>
								<TripLayout />
							</TrackLocationProvider>
						</MapContextProvider>
					</SocketProvider>
				</TripProtectedRoute>
			</TripProvider>
		),
		children: [
			{ index: true, element: <LoadingTripDataView /> },
			{
				path: tripRoutes.map,
				element: <MapView />,
			},
			{
				path: tripRoutes.participants,
				element: <ParticipantsView />,
			},
			{
				path: tripRoutes.chat,
				element: <ChatView />,
			},
			{
				path: tripRoutes.urgentNotifications,
				element: <UrgentNotificationsView />,
			},
			{ path: '*', element: <PageNotFoundView /> },
		],
	},
	{ path: '*', element: <PageNotFoundView /> },
];

export default routes;
