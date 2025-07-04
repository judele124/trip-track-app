import Modal from '@/components/ui/Modal';
import { useAuthContext } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import UserDetailsComponent from '@/components/UserDetailsComponent';

interface IUserProfileModalProps {
	open: boolean;
	onClose: () => void;
}

export default function UserProfileModal({
	open,
	onClose,
}: IUserProfileModalProps) {
	const { user } = useAuthContext();

	return (
		<Modal center onBackdropClick={onClose} open={open}>
			<div className='flex w-[95vw] max-w-[400px] flex-col gap-6 rounded-2xl bg-light p-8 text-dark dark:bg-dark dark:text-light'>
				{user && (
					<UserDetailsComponent
						role={user.role}
						name={user.name || 'Default'}
						imageUrl={user.imageUrl || 'https://robohash.org/Default.png'}
						{...(user.role !== 'guest' ? { email: user.email } : {})}
					/>
				)}
				<div className='flex flex-col gap-2'>
					<h4 className='font-medium'>Trip related information</h4>
				</div>

				<Button onClick={onClose} className='w-full'>
					Close
				</Button>
			</div>
		</Modal>
	);
}
