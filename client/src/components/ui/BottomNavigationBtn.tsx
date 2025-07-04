import { NavLink, NavLinkProps } from 'react-router-dom';
import Icon from '../icons/Icon';

interface ILinkProps extends NavLinkProps {
	notificationCount?: number;
	to: 'map' | 'participants' | 'chat';
}
const BottomNavigationBtn = ({ notificationCount, to }: ILinkProps) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`relative size-12 content-center rounded-full text-center text-dark transition-all focus:bg-white dark:focus:bg-secondary ${isActive ? 'bg-white dark:bg-secondary' : ''}`
			}
		>
			<Icon size={'30'} notificationCount={notificationCount} name={to} />
		</NavLink>
	);
};

export default BottomNavigationBtn;
