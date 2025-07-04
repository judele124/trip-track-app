import UserDetailsComponent from '@/components/UserDetailsComponent';
import { useAuthContext } from '@/contexts/AuthContext';
import Icon from '@/components/icons/Icon';
import TripsShowcase from './components/TripsShowcase';

const ProfileView = () => {
	const { user, loading } = useAuthContext();

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<Icon className='fill-primary' size='50' name='spinner' />
			</div>
		);
	}

	return (
		<div className='flex size-full max-h-[600px] flex-col'>
			{user && (
				<UserDetailsComponent
					role={user.role}
					className='border-b-2 border-primary p-2'
					name={user.name || 'Default'}
					imageUrl={user.imageUrl || 'https://robohash.org/Default.png'}
					{...(user.role !== 'guest' ? { email: user.email } : {})}
				/>
			)}
			<TripsShowcase />
		</div>
	);
};

export default ProfileView;
