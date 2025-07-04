import { ReactNode, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';
import { useTripContext } from '@/contexts/TripContext';
import useAxios from '@/hooks/useAxios';
import { getAllUserIdsRelatedToTrip } from '@/servises/tripService';

type TripProtectedRouteProps = {
	children: ReactNode;
};

export default function TripProtectedRoute({
	children,
}: TripProtectedRouteProps) {
	const { user, tokenValidationStatus } = useAuthContext();
	const { tripId, trip } = useTripContext();
	const { activate } = useAxios({ manual: true });
	const nav = useNavigate();

	useEffect(() => {
		if (tokenValidationStatus && !user) {
			nav(`${navigationRoutes.joinTrip}?tripId=${tripId}`);
			return;
		}

		if (!trip) return;
		const fetchUserIds = async () => {
			try {
				const { data } = await getAllUserIdsRelatedToTrip(activate, tripId);

				if (data && !data.includes(user?._id)) {
					nav(`${navigationRoutes.joinTrip}?tripId=${tripId}`);
				}
			} catch (error) {
				nav(`${navigationRoutes.notFound}`);
			}
		};

		fetchUserIds();
	}, [tokenValidationStatus, trip]);

	return <>{children}</>;
}
