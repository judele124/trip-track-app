import {
	Navigate,
	Route,
	RouteObject,
	Routes,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import routes, { navigationRoutes } from './routes';
import { ReactNode, useEffect } from 'react';
import useAxios from '@/hooks/useAxios';
import { API_BASE_URL } from '@/env.config';
import Logo from '@/components/Logo';

function renderRoutes(ch: RouteObject[]): ReactNode[] {
	return ch.map(({ index, path, children: childrenRouteObjects, element }) => {
		if (index) {
			return <Route key={'/'} index element={element}></Route>;
		}

		let childrenRoutes = null;
		if (childrenRouteObjects && childrenRouteObjects.length > 0) {
			childrenRoutes = renderRoutes(childrenRouteObjects);
		}

		return (
			<Route path={path} key={path || '/'} element={element}>
				{childrenRoutes && childrenRoutes.length > 0 && childrenRoutes}
			</Route>
		);
	});
}

export default function AllRoutes() {
	const { pathname, search } = useLocation();
	const nav = useNavigate();

	const { error } = useAxios({
		url: `${API_BASE_URL}/health`,
	});

	useEffect(() => {
		const isFirstEntry = localStorage.getItem('notFirstEntry') !== 'true';

		if (isFirstEntry) {
			nav(navigationRoutes.firstEntry, {
				state: {
					redirectRoute: pathname,
					params: search,
				},
			});
		}
	}, []);

	if (error) {
		return (
			<div className='page-colors flex h-screen flex-col items-center justify-center gap-2 px-10 text-center'>
				<Logo />
				<h1 className='text-2xl font-semibold'>We are having some issues</h1>
				<p className='text-sm text-gray-500'>Please try again later</p>
			</div>
		);
	}

	if (pathname === '/') return <Navigate to={navigationRoutes.app} />;

	return <Routes>{renderRoutes(routes)}</Routes>;
}
