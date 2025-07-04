import { ReactNode } from 'react';
import Icon from '@/components/icons/Icon';
import Button from '@/components/ui/Button';
import { navigationRoutes } from '@/Routes/routes';
import { Link } from 'react-router-dom';
import { useMapContext } from '@/contexts/MapContext/MapContext';

interface MapProps {
	children?: ReactNode;
}

export default function Map({ children }: MapProps) {
	const { isMapReady, setMapContainerRef, error } = useMapContext();

	return (
		<>
			{isMapReady && children}

			{!isMapReady && (
				<div className='page-colors page-x-padding flex size-full items-center justify-center'>
					{error ? (
						<div className='z-100 absolute left-1/2 top-1/2 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 text-center'>
							<h3>We're sorry, something went wrong while loading the map.</h3>
							<Link to={navigationRoutes.app}>
								<Button primary className='w-full'>
									Back to home
								</Button>
							</Link>
						</div>
					) : (
						<div>
							<Icon size='50' className='fill-primary' name='spinner' />
						</div>
					)}
				</div>
			)}
			<div
				ref={(ref) => ref && setMapContainerRef(ref)}
				className='h-full w-full'
			></div>
		</>
	);
}
