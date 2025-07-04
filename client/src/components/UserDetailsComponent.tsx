import { IUserResponseData } from '@/types/user';
import { ProfileImage } from './ProfileImage/ProfileImage';

interface IUserDetailsComponentProps {
	name: string;
	imageUrl: string;
	email?: string;
	className?: string;
	role: IUserResponseData['role'];
}

const UserDetailsComponent = ({
	name,
	imageUrl,
	email,
	className = '',
	role,
}: IUserDetailsComponentProps) => {
	return (
		<div className={`flex items-center gap-4 ${className}`}>
			<ProfileImage imageUrl={imageUrl} enableEdit={role !== 'guest'} />
			<div>
				<h3 className='text-xl font-bold'>
					{name}{' '}
					<span className='rounded-full bg-secondary px-2 py-1 text-sm font-medium text-light opacity-75'>
						{role}
					</span>
				</h3>
				{role !== 'guest' && <p className='text-sm opacity-75'>{email}</p>}
			</div>
		</div>
	);
};

export default UserDetailsComponent;
