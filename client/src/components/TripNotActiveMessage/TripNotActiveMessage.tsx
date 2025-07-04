import { Trip } from '@/types/trip';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';
import { useAuthContext } from '@/contexts/AuthContext';
import Modal from '../ui/Modal';

interface TripNotActiveMessageProps {
	trip: Trip;
	onClose?: () => void;
	isOpen?: boolean;
}

export default function TripNotActiveMessage({
	trip,
	onClose,
	isOpen = true,
}: TripNotActiveMessageProps) {
	const nav = useNavigate();
	const { user } = useAuthContext();
	const isCreator = trip.creator._id === user?._id;

	const handleGoHome = () => {
		nav(navigationRoutes.app);
		onClose?.();
	};

	return (
		<Modal open={isOpen} center onBackdropClick={() => onClose?.()}>
			<div className='page-colors flex max-w-[400px] flex-col items-center gap-4 rounded-2xl p-6 text-center'>
				<h2 className='text-xl font-semibold'>Trip Not Active</h2>

				<div className='flex flex-col gap-2'>
					<p className='text-gray-600 dark:text-gray-300'>
						This trip hasn't started yet.
					</p>
					{isCreator ? (
						<p className='text-sm text-primary'>
							As the trip creator, you can start the trip from the trip
							management page in your profile.
						</p>
					) : (
						<p className='text-sm text-gray-500'>
							Please wait for the trip creator to start the trip.
						</p>
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
