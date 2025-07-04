import TripCancelledMessage from '@/components/TripCancelledMessage';
import TripNotActiveMessage from '@/components/TripNotActiveMessage';
import Button from '@/components/ui/Button';
import UserOrGuestModal from '@/components/UserOrGuestModal';
import { useAuthContext } from '@/contexts/AuthContext';
import useAxios from '@/hooks/useAxios';
import useToggle from '@/hooks/useToggle';
import { navigationRoutes } from '@/Routes/routes';
import { joinTrip } from '@/servises/tripService';
import { Trip } from '@/types/trip';
import { getErrorMessage } from '@/utils/errorMessages';
import { useNavigate } from 'react-router-dom';

export default function JoinButton({ trip }: { trip: Trip }) {
	const {
		isOpen: isUserOrGuestModalOpen,
		setIsOpen: setIsUserOrGuestModalOpen,
	} = useToggle();
	const { isOpen: isTripNotActiveOpen, setIsOpen: setIsTripNotActiveOpen } =
		useToggle();

	const { isOpen: isTripCancelledOpen, setIsOpen: setIsTripCancelledOpen } =
		useToggle();

	const { user } = useAuthContext();
	const nav = useNavigate();

	const {
		activate,
		error: errorJoinTrip,
		status: joinTripStatus,
	} = useAxios({
		manual: true,
	});

	const handleOnjoin = async () => {
		if (trip.status === 'cancelled') {
			setIsTripCancelledOpen(true);
			return;
		}

		if (trip.status !== 'started') {
			setIsTripNotActiveOpen(true);
			return;
		}

		if (!user) {
			setIsUserOrGuestModalOpen(true);
			return;
		}

		await joinTrip(activate, trip._id, {
			name: user?.name,
			imageUrl: user?.imageUrl,
			role: user?.role,
		});

		nav(`${navigationRoutes.map}?tripId=${trip._id}`);
	};

	return (
		<>
			<div className='flex flex-col gap-3'>
				<Button onClick={handleOnjoin} primary className='w-full'>
					join
				</Button>
				{errorJoinTrip && joinTripStatus && (
					<p className='text-center text-sm text-red-500'>
						{getErrorMessage(joinTripStatus)}
					</p>
				)}
			</div>
			<UserOrGuestModal
				tripId={trip._id}
				open={isUserOrGuestModalOpen}
				onClose={() => setIsUserOrGuestModalOpen(false)}
			/>

			<TripNotActiveMessage
				trip={trip}
				onClose={() => setIsTripNotActiveOpen(false)}
				isOpen={isTripNotActiveOpen}
			/>

			<TripCancelledMessage
				trip={trip}
				onClose={() => setIsTripCancelledOpen(false)}
				isOpen={isTripCancelledOpen}
			/>
		</>
	);
}
