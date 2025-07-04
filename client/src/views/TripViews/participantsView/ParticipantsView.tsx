import { useTripSocket } from '@/contexts/socketContext/SocketContext';
import { useTripContext } from '@/contexts/TripContext';

const ParticipantsView = () => {
	const { usersInLiveTripExpData } = useTripSocket();
	const { trip } = useTripContext();

	const guides = [];
	const participants = [];

	for (const user of usersInLiveTripExpData) {
		if (
			trip?.guides.some((guide) => guide._id === user.userId) ||
			trip?.creator._id === user.userId
		) {
			guides.push(user);
		} else {
			participants.push(user);
		}
	}

	return (
		<div className='page-colors relative z-30 flex h-full w-full flex-col gap-7 overflow-y-auto px-6 text-gray-800 dark:text-light'>
			{guides.length > 0 && (
				<div className='w-full pt-6'>
					<h3 className='px-2 py-1 text-left text-sm font-bold'>Guides:</h3>
					<div className='flex flex-col items-center'>
						{guides.map((user, index) => (
							<UserDetails
								key={user.userId}
								name={user.name}
								imageUrl={user.imageUrl}
								className={`flex w-[95%] items-center gap-2 p-2 ${
									index < guides.length - 1 ? 'border-b border-primary/30' : ''
								}`}
							/>
						))}
					</div>
				</div>
			)}

			{participants.length > 0 && (
				<div className='w-full'>
					<h3 className='px-2 py-1 text-left text-sm font-bold'>
						Participants:
					</h3>
					<div className='flex flex-col items-center'>
						{participants.map((user, index) => (
							<UserDetails
								key={user.userId}
								name={user.name}
								imageUrl={user.imageUrl}
								className={`flex w-[95%] items-center gap-2 p-2 ${
									index < participants.length - 1
										? 'border-b border-primary/30'
										: ''
								}`}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ParticipantsView;

const UserDetails = ({
	name,
	imageUrl,
	className = '',
}: {
	name: string;
	imageUrl: string;
	className?: string;
}) => (
	<div className={className}>
		<img
			src={imageUrl}
			alt=''
			className='size-10 shrink-0 rounded-full border border-primary bg-light'
		/>
		<span className='truncate pl-2 text-sm font-medium'>{name}</span>
	</div>
);
