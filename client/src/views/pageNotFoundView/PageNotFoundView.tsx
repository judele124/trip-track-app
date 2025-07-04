import Button from '@/components/ui/Button';
import { navigationRoutes } from '@/Routes/routes';
import { Link } from 'react-router-dom';

export default function PageNotFoundView() {
	return (
		<div className='page-colors page-padding relative h-dvh overflow-hidden'>
			<div className='relative mx-auto size-full sm:max-w-[400px]'>
				<div className='mt-10 text-center'>
					<h1 className='text-3xl font-bold'>404</h1>
					<p>Page not found</p>
					<Link to={navigationRoutes.app}>
						<Button className='mt-5 w-full' primary>
							Home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
