import Modal from '../ui/Modal';
import useToggle from '@/hooks/useToggle';
import { useEffect, useState } from 'react';
import { Trip } from '@/types/trip';
import { Types } from 'trip-track-package';
import Icon from '../icons/Icon';
import Button from '../ui/Button';
import useAxios from '@/hooks/useAxios';
import { API_BASE_URL } from '@/env.config';
import { ParticipantsComponent } from './components/ParticipantsComponent';
import { GuidesComponent } from './components/GuidesComponent';
import { getErrorMessage } from '@/utils/errorMessages';

interface IUpdateGuidesBtnProps {
	trip: Trip;
	onSuccess: () => void;
}

export interface INewParticipantsData {
	userModel: Types['User']['Model'];
	isGuide: boolean;
}

const UpdateGuidesBtn = ({ trip, onSuccess }: IUpdateGuidesBtnProps) => {
	const { isOpen, toggle, setIsOpen } = useToggle();

	return (
		<>
			<Button
				type={'button'}
				onClick={toggle}
				className='flex justify-center gap-1 rounded-md px-2 py-1 text-sm font-normal text-white dark:text-dark'
			>
				{!trip.guides.length ? 'Add guides' : 'Edit guides'}
				<i>
					<Icon
						size='17'
						className='-mb-1 fill-white dark:fill-dark'
						name={!trip.guides.length ? 'plus' : 'edit'}
					/>
				</i>
			</Button>

			{isOpen && (
				<UpdateGuidesModal
					trip={trip}
					closeModal={() => setIsOpen(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
};

export default UpdateGuidesBtn;

interface IUpdateGuidesModalProps {
	trip: Trip;
	closeModal: () => void;
	onSuccess: () => void;
}

function UpdateGuidesModal({
	trip,
	closeModal,
	onSuccess,
}: IUpdateGuidesModalProps) {
	const { activate, error, loading, status } = useAxios({ manual: true });
	const [newParticipants, setNewParticipants] = useState<
		INewParticipantsData[]
	>([]);

	useEffect(() => {
		setNewParticipants(() =>
			trip.participants.map((participant) => ({
				userModel: participant.userId,
				isGuide: trip.guides.some((g) => g._id === participant.userId._id),
			}))
		);
	}, []);

	const handleUpdateGuide = (userId: string, isGuide: boolean) => {
		setNewParticipants((prev) =>
			prev.map((p) => (p.userModel._id === userId ? { ...p, isGuide } : p))
		);
	};

	const handleSubmit = async () => {
		const { error } = await activate({
			url: `${API_BASE_URL}/trip/update-guides/${trip._id}`,
			method: 'PUT',
			data: {
				guideIds: newParticipants
					.filter((p) => p.isGuide)
					.map((p) => p.userModel._id),
			},
		});

		if (!error) {
			closeModal();
			onSuccess();
		}
	};

	return (
		<Modal open={true} onBackdropClick={closeModal} center>
			<div className='page-colors w-[90vw] max-w-[400px] rounded-3xl p-5'>
				<div className='mb-2 flex items-center justify-between'>
					<h2>Choose your guides</h2>
					<Button onClick={closeModal} className='rounded-lg px-1 py-1'>
						<Icon name='xIcon' className='stroke-white dark:stroke-dark' />
					</Button>
				</div>
				{!newParticipants.length ? (
					<p className='text-center text-lg'>No participants found</p>
				) : (
					<>
						<div className='flex justify-between gap-4'>
							{/* LEFT COLUMN */}
							<ParticipantsComponent
								participants={newParticipants.filter((p) => !p.isGuide)}
								handleUpdateGuide={handleUpdateGuide}
							/>
							{/* RIGHT COLUMN */}
							<GuidesComponent
								guides={newParticipants.filter((p) => p.isGuide)}
								handleUpdateGuide={handleUpdateGuide}
							/>
						</div>

						<Button onClick={handleSubmit} primary className='mt-4 w-full'>
							{error && status
								? getErrorMessage(status)
								: loading
									? 'loading'
									: 'submit'}
						</Button>
					</>
				)}
			</div>
		</Modal>
	);
}
