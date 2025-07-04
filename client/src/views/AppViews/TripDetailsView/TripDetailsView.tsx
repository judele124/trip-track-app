import Icon from '@/components/icons/Icon';
import TripDetailsStops from '@/views/AppViews/TripDetailsView/components/TripDetailsStops';
import useAxios, { UseAxiosResponse } from '@/hooks/useAxios';
import { Trip } from '@/types/trip';
import { getErrorMessage } from '@/utils/errorMessages';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TripStatusButton from '../profileView/components/TripStatusButton';
import RewardDetails from './components/RewardDetails';
import { tripGet } from '@/servises/tripService';
import UpdateGuidesBtn from '@/components/updateGuidesBtn/UpdateGuidesBtn';
import TripActionsModal from '../profileView/components/TripActionsModal';
import { useAuthContext } from '@/contexts/AuthContext';
import ShowTripOnMapBtn from '@/components/ShowTripOnMapBtn';
import useToggle from '@/hooks/useToggle';

export default function TripDetailsView() {
	const params = useParams();
	const {
		data: tripData,
		loading,
		error,
		status,
		activate,
	} = useAxios<Trip>({
		manual: true,
	});

	useEffect(() => {
		if (!params.tripId) return;
		tripGet(activate, params.tripId);
	}, []);

	return (
		<>
			<div className='page-colors mx-auto flex h-full w-full max-w-[400px] flex-col gap-4 overflow-hidden'>
				{loading && <Icon name='spinner' />}
				{error && status && (
					<p className='text-res-500'>{getErrorMessage(status)}</p>
				)}
				{tripData && (
					<>
						<TripDetailsHeader
							tripData={tripData}
							activate={activate}
							tripId={tripData._id}
						/>

						<TripDetailsStops
							getUpdatedTrip={async () => {
								if (!params.tripId) return;
								tripGet(activate, params.tripId);
							}}
							trip={tripData}
						/>
						<div className='flex flex-col'>
							<RewardDetails
								trip={tripData}
								onUpdate={() => {
									if (!params.tripId) return;
									tripGet(activate, tripData._id);
								}}
								tripId={tripData._id}
							/>
							<ShowTripOnMapBtn trip={tripData} />
						</div>
					</>
				)}
			</div>
		</>
	);
}

interface TripDetailsHeaderProps {
	tripData: Trip;
	activate: UseAxiosResponse<Trip>['activate'];
	tripId: string;
}

function TripDetailsHeader({
	tripData,
	activate,
	tripId,
}: TripDetailsHeaderProps) {
	const { user } = useAuthContext();
	const encorElementRef = useRef<HTMLButtonElement>(null);
	const { isOpen, setIsOpen } = useToggle();

	return (
		<div>
			<div className='flex items-start justify-between'>
				<h1 className='max-w-[70%] break-words capitalize'>{tripData.name}</h1>
				{(tripData.status !== 'completed' || user?.role === 'developer') && (
					<button
						ref={encorElementRef}
						onClick={() => setIsOpen(true)}
						className='mt-2 px-0 py-0'
					>
						<Icon name='settings' className='fill-dark dark:fill-light' />
					</button>
				)}
				<TripActionsModal
					anchorTo='right'
					trip={tripData}
					isCreator={tripData.creator._id === user?._id}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					encorElementRef={encorElementRef}
					afterAction={() => tripGet(activate, tripId)}
				/>
			</div>
			{tripData.description && <p>{tripData.description}</p>}
			<div className='mt-2 flex items-start gap-1'>
				<TripStatusButton status={tripData.status} />
			</div>
			<h4 className='my-2'>Guides</h4>
			<div className='flex items-center justify-between'>
				<div className='flex gap-2 overflow-x-scroll'>
					{!tripData.guides.length && (
						<p className='text-center'>No guides yet</p>
					)}

					{tripData.guides.map((guide) => (
						<div
							className='flex shrink-0 items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-white'
							key={guide._id}
						>
							<img
								className='size-6 rounded-full border bg-white'
								src={guide.imageUrl}
							/>
							<p className='text-sm capitalize'>{guide.name}</p>
						</div>
					))}
				</div>
				<UpdateGuidesBtn
					trip={tripData}
					onSuccess={() => tripGet(activate, tripId)}
				/>
			</div>
		</div>
	);
}
