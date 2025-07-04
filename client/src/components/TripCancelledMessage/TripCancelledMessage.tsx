import { Trip } from '@/types/trip';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';
import { useAuthContext } from '@/contexts/AuthContext';
import Modal from '../ui/Modal';

interface TripCancelledMessageProps {
	trip: Trip;
	onClose?: () => void;
	isOpen?: boolean;
}

export default function TripCancelledMessage({
	trip,
	onClose,
	isOpen = true,
}: TripCancelledMessageProps) {
	const nav = useNavigate();
	const { user } = useAuthContext();
	const isCreator = trip.creator._id === user?._id;

	const handleGoHome = () => {
		nav(navigationRoutes.app);
		onClose?.();
	};

	return (
		<Modal open={isOpen} center onBackdropClick={() => onClose?.()}>
			<div className='page-colors flex w-[90vw] max-w-[400px] flex-col items-center gap-4 rounded-2xl p-6 text-center'>
				<h2 className='text-xl font-semibold'>Trip Cancelled</h2>
				<div className='flex flex-col gap-2'>
					{isCreator ? (
						<p className='text-sm'>You have cancelled the trip.</p>
					) : (
						<p className='text-sm'>we sorry but the trip has been cancelled.</p>
					)}
				</div>

				<div className='mt-2 flex w-full flex-col gap-2'>
					<Button onClick={handleGoHome} primary className='w-full'>
						Go Home
					</Button>
					{onClose && (
						<Button onClick={onClose} className='w-full'>
							Close
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
