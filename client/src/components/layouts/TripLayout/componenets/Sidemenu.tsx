import { RefObject } from 'react';
import Modal from '../../../ui/Modal';
import Icon, { IconName } from '../../../icons/Icon';
import { ToggleDarkMode } from '@/components/Navbar';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { leaveTrip } from '@/servises/tripService';
import useAxios from '@/hooks/useAxios';
import { useTripContext } from '@/contexts/TripContext';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';

interface Props {
	toggleMenu: () => void;
	isMenuOpen: boolean;
	toggleMenuRef: RefObject<HTMLButtonElement>;
}

interface MenuItemProps {
	title: string;
	icon: IconName;
	onClick: () => void;
}

export default function Sidemenu({
	toggleMenu,
	isMenuOpen,
	toggleMenuRef,
}: Props) {
	const { tripId } = useTripContext();
	const { isDarkMode } = useDarkMode();
	const { activate } = useAxios({ manual: true });
	const nav = useNavigate();

	const menuItems: MenuItemProps[] = [
		{
			title: 'Leave Trip',
			icon: 'leave',
			onClick: async () => {
				try {
					await leaveTrip(activate, tripId);
				} catch (error) {
					console.log(error);
				} finally {
					nav(navigationRoutes.app);
				}
			},
		},
	];

	return (
		<Modal
			backgroundClassname='bg-transparent'
			onBackdropClick={toggleMenu}
			anchorElement={toggleMenuRef}
			anchorTo='top-left'
			open={isMenuOpen}
		>
			<ul className='page-colors mt-5 flex min-w-44 flex-col rounded-2xl border-2 border-secondary bg-black px-3 py-1 text-white'>
				<li className='flex justify-start gap-2 border-b-2 border-secondary p-3'>
					<ToggleDarkMode />
					<p>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</p>
				</li>
				{menuItems.map(({ title, icon, onClick }, i) => (
					<li
						key={title}
						onClick={onClick}
						className={`group flex justify-start gap-2 p-3 ${i != menuItems.length - 1 && 'border-b-2 border-secondary'}`}
					>
						<i>
							<Icon
								name={icon}
								className='transition-all group-hover:fill-primary dark:fill-light'
							/>
						</i>
						<p className='transition-all'>{title}</p>
					</li>
				))}
			</ul>
		</Modal>
	);
}
