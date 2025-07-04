import { navigationRoutes } from '@/Routes/routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoadingTripDataView() {
	const nav = useNavigate();

	useEffect(() => {
		nav(navigationRoutes.map);
	}, []);

	return null;
}
