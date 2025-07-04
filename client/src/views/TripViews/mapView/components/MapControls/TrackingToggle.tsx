import { FC } from 'react';
import Icon from '@/components/icons/Icon';
import { createPortal } from 'react-dom';
import { useTripLayout } from '@/components/layouts/TripLayout/TripLayout';

interface TrackingToggleProps {
	isTracking: boolean;
	onToggle: () => void;
}

export const TrackingToggle: FC<TrackingToggleProps> = ({
	isTracking,
	onToggle,
}) => {
	const { pageContentRef } = useTripLayout();
	return (
		pageContentRef.current &&
		createPortal(
			<div className='absolute left-2 top-2 z-10'>
				<button
					onClick={onToggle}
					className={`rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100`}
					aria-label={isTracking ? 'Disable tracking' : 'Enable tracking'}
				>
					<Icon
						name={isTracking ? 'location' : 'circle-cross'}
						className={`h-6 w-6 ${isTracking ? 'text-blue-500' : 'text-gray-500'}`}
					/>
				</button>
			</div>,
			pageContentRef.current
		)
	);
};
