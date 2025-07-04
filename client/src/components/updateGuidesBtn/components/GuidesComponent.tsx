import { Fragment } from 'react';
import { INewParticipantsData } from '../UpdateGuidesBtn';
import User from './User';

interface IGuidesComponentProps {
	guides: INewParticipantsData[];
	handleUpdateGuide: (userId: string, isGuide: boolean) => void;
}

export const GuidesComponent = ({
	guides,
	handleUpdateGuide,
}: IGuidesComponentProps) => {
	return (
		<div className='w-2/5'>
			<h4 className='my-2'>Guides</h4>
			<div className='no-scrollbar flex max-h-[300px] flex-col justify-center gap-2 overflow-y-auto rounded-2xl border border-dark p-2 dark:border-light'>
				{!guides.length && <p className='text-center'>No guides yet</p>}

				{guides.map((guide, index) => (
					<Fragment key={`guide-${guide.userModel._id}`}>
						<div
							onClick={() => handleUpdateGuide(guide.userModel._id, false)}
							className='flex cursor-pointer items-center justify-between border-dark last:border-none dark:border-light'
						>
							<User participant={guide} />
							<p className='text-red-500'>❌</p>
						</div>
						{index < guides.length - 1 && (
							<div className='h-[1px] w-full bg-dark dark:bg-light' />
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
};
