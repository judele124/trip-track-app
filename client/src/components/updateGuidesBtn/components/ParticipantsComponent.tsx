import Icon from '@/components/icons/Icon';
import { INewParticipantsData } from '../UpdateGuidesBtn';
import User from './User';

interface IParticipantsComponentProps {
	participants: INewParticipantsData[];
	handleUpdateGuide: (userId: string, isGuide: boolean) => void;
}

export const ParticipantsComponent = ({
	participants,
	handleUpdateGuide,
}: IParticipantsComponentProps) => {
	return (
		<div className='w-3/5'>
			<h4 className='my-2'>Participants</h4>
			<div className='no-scrollbar flex max-h-[300px] flex-col gap-2 overflow-y-auto rounded-2xl border border-dark p-2 dark:border-light'>
				{!participants.length && (
					<p className='text-center'>No participants yet</p>
				)}

				{participants.map((participant, index) => (
					<>
						<div
							key={`participant-${participant.userModel._id}`}
							onClick={() => handleUpdateGuide(participant.userModel._id, true)}
							className='flex cursor-pointer items-center justify-between border-dark last:border-none dark:border-light'
						>
							<User participant={participant} />
							<i>
								<Icon name='vIcon' className='fill-green-500' size='20' />
							</i>
						</div>
						{index < participants.length - 1 && (
							<div className='h-[1px] w-full bg-dark dark:bg-light' />
						)}
					</>
				))}
			</div>
		</div>
	);
};
