import { Trip } from '@/types/trip';
import TripRow from './TripRow';
import { getErrorMessage } from '@/utils/errorMessages';

interface ITripListProps {
	data: Trip[];
	status: number | undefined;
	loading: boolean;
	hasError: boolean;
	isCreatedTrips: boolean;
}

export default function TripsList({
	data,
	hasError,
	loading,
	status,
	isCreatedTrips,
}: ITripListProps) {
	return (
		<>
			{status && hasError && (
				<p className='text-red-500'>{getErrorMessage(status)}</p>
			)}
			{loading && <p>loading trips</p>}
			{data?.length > 0 ? (
				data.map((tripItem: Trip, index: number) => (
					<TripRow
						key={tripItem._id}
						trip={tripItem}
						i={index}
						isCreator={isCreatedTrips}
					/>
				))
			) : (
				<p className='text-center'>No trips created yet</p>
			)}
		</>
	);
}
