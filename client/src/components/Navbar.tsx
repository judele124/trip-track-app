import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { navigationRoutes } from '@/Routes/routes';
import { useAuthContext } from '@/contexts/AuthContext';
import Button from './ui/Button';

export default function Navbar() {
	const { user } = useAuthContext();
	const isLoggedIn = user != null;
	const isGuest = user?.role === 'guest';

	return (
		<div className='mb-3 flex items-center justify-between'>
			<BackButton />
			<div className='flex items-center gap-3'>
				{isLoggedIn && !isGuest ? (
					<>
						<Link
							to={`${navigationRoutes.profile}`}
							className='bg-transparent px-0 py-0'
						>
							<img
								className='size-8 rounded-full bg-slate-400'
								src={user.imageUrl || `https://robohash.org/${user.name}.png`}
								alt={`${user.name} profile picture`}
							/>
						</Link>
						<LogoutBtn />
					</>
				) : (
					<>
						{isGuest && <p className='text-sm'>You're logged in as guest</p>}
						<LoginBtn />
					</>
				)}
				<ToggleDarkMode />
			</div>
		</div>
	);
}

const BackButton = () => {
	return (
		<i onClick={() => history.back()}>
			<svg
				className='stroke-dark dark:stroke-light'
				width='40'
				height='23'
				viewBox='0 0 40 23'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M13 2L2 11.25L13 21M38 11H2'
					strokeWidth='4'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</i>
	);
};

export const ToggleDarkMode = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	return (
		<button
			className='size-7 rounded-full bg-dark p-0 text-light dark:bg-light'
			onClick={() => {
				toggleDarkMode();
			}}
		>
			{isDarkMode ? '🌙' : '☀️'}
		</button>
	);
};

export const LogoutBtn = () => {
	const nav = useNavigate();

	return (
		<Button
			className='rounded-lg py-1'
			onClick={() => nav(navigationRoutes.logout)}
		>
			Logout
		</Button>
	);
};

export const LoginBtn = () => {
	const nav = useNavigate();

	return (
		<Button
			className='rounded-lg py-1'
			onClick={() => nav(navigationRoutes.login)}
		>
			Login
		</Button>
	);
};
