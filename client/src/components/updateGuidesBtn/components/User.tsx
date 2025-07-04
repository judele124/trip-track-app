import { INewParticipantsData } from '../UpdateGuidesBtn';

interface IUserProps {
	participant: INewParticipantsData;
}

export default function User({ participant }: IUserProps) {
	return (
		<div className='flex items-center gap-2'>
			{participant.userModel.imageUrl && (
				<img
					src={participant.userModel.imageUrl}
					alt='user avatar'
					className='size-8 rounded-full border-2 border-primary'
				/>
			)}
			<p>{participant.userModel.name}</p>
		</div>
	);
}
