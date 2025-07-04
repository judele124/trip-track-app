import { Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import UserInputNameModal from '../UserInputNameModal';
import useToggle from '@/hooks/useToggle';
import { useEffect } from 'react';

const PageLayout = () => {
	const { user } = useAuthContext();
	const { isOpen, setIsOpen } = useToggle(false);

	useEffect(() => {
		if (user && !user.name) {
			setIsOpen(true);
		}
	}, [user]);

	return (
		<div className='page-colors page-padding relative flex h-dvh flex-col'>
			<div className='relative flex w-full flex-1 flex-col overflow-hidden sm:mx-auto sm:max-w-[400px]'>
				<Outlet />
				{isOpen && <UserInputNameModal setIsOpen={setIsOpen} />}
			</div>
		</div>
	);
};

export default PageLayout;
