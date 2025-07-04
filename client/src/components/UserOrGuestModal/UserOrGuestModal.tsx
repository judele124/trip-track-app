import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { navigationRoutes } from '@/Routes/routes';
import useAxios from '@/hooks/useAxios';
import { API_BASE_URL } from '@/env.config';
import Icon from '../icons/Icon';
import { useAuthContext } from '@/contexts/AuthContext';

interface UserOrGuestModalProps {
	open: boolean;
	onClose: () => void;
	tripId: string;
}

export default function UserOrGuestModal({
	open,
	onClose,
	tripId,
}: UserOrGuestModalProps) {
	const { activate, loading, status, error } = useAxios({
		manual: true,
	});
	const nav = useNavigate();
	const { handleTokenValidation } = useAuthContext();

	const handleCreateGuestToken = async () => {
		try {
			await activate({
				url: `${API_BASE_URL}/auth/create-guest-token`,
				method: 'GET',
			});
			handleTokenValidation();
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const handleLoginAsUser = () => {
		nav(navigationRoutes.login, {
			state: { tripId },
		});
		onClose();
	};

	return (
		<Modal open={open} center onBackdropClick={() => {}}>
			<div className='page-colors flex max-w-[90vw] flex-col gap-4 rounded-2xl p-8 text-center'>
				<div>
					<h3>We need to know who you are</h3>
					<p>Sign in to continue</p>
				</div>
				<Button
					className={!error && status ? 'bg-green-500' : ''}
					onClick={handleCreateGuestToken}
				>
					{(error && (
						<p className='text-red-500'>
							{error?.message || 'There was an error'}
						</p>
					)) ||
						(loading && <Icon name='spinner' />) ||
						(status && 'Logged in') ||
						'Login as guest'}
				</Button>
				<Button primary onClick={handleLoginAsUser}>
					Login as user
				</Button>
			</div>
		</Modal>
	);
}
