import Button from '@/components/ui/Button';
import Icon from '@/components/icons/Icon';
import { useAuthContext } from '@/contexts/AuthContext';
import useTripOption, {
	actions,
	checkIsValidAction,
} from '../hooks/useTripOption';
import { Trip } from '@/types/trip';
import Modal, { ModalAnchor } from '@/components/ui/Modal';
import DevPanel from '@/components/DevPanel';

interface ITripActionsModalProps {
	trip: Trip;
	isCreator: boolean;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	encorElementRef: React.RefObject<HTMLButtonElement>;
	afterAction: () => void;
	anchorTo: ModalAnchor;
}

export default function TripActionsModal({
	trip,
	isCreator,
	isOpen,
	setIsOpen,
	encorElementRef,
	afterAction,
	anchorTo,
}: ITripActionsModalProps) {
	const { user } = useAuthContext();
	const { handleActions } = useTripOption({
		tripId: trip._id,
		afterAction,
	});

	const isAlreadyParticipant = trip.participants.some(({ userId }) => {
		return userId._id === user?._id;
	});

	const filteredActions = actions.filter(({ name }) =>
		checkIsValidAction({
			actionName: name,
			currentStatus: trip.status,
			isCreator,
			isAlreadyParticipant,
		})
	);

	return (
		<Modal
			anchorTo={anchorTo}
			anchorElement={encorElementRef}
			backgroundClassname='bg-transparent backdrop-blur-none'
			onBackdropClick={() => setIsOpen(false)}
			open={isOpen}
		>
			<div
				className={`page-colors ${filteredActions.length >= 3 ? 'grid grid-cols-3' : 'flex'} gap-2 rounded-2xl border-2 border-primary p-3`}
			>
				{filteredActions.map(({ name, label, iconName, iconClassName }) => {
					return (
						<Button
							key={name}
							className={`rounded-lg bg-none px-1 py-1 text-center text-xs font-normal`}
							onClick={() => handleActions(name)}
						>
							<i>
								<Icon name={iconName} size='24' className={iconClassName} />
							</i>
							<p className='mt-1 text-xs'>{label}</p>
						</Button>
					);
				})}
				{user?.role === 'developer' && <DevPanel tripId={trip._id} />}
			</div>
		</Modal>
	);
}
