import Icon from '@/components/icons/Icon';
import ScrollableMiddleWTopBottom from '@/components/ScrollableMiddleWTopBottom';
import Button from '@/components/ui/Button';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FormProvider, useForm } from 'react-hook-form';
import { Schemas } from 'trip-track-package';
import { IUseFromStopsData } from './StopDetails';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import StopEditMode from './StopEditMode';
import { tripUpdate } from '@/servises/tripService';
import useAxios from '@/hooks/useAxios';
import { Trip } from '@/types/trip';
import { getErrorMessage } from '@/utils/errorMessages';
import InputFeildError from '@/components/ui/InputFeildError';

interface IEditDetailsStopsProps {
	trip: Trip;
	toggleEditMode: () => void;
	getUpdatedTrip: () => Promise<void>;
}

export default function EditDetailsStops({
	trip,
	toggleEditMode,
	getUpdatedTrip,
}: IEditDetailsStopsProps) {
	const { activate, status, error, loading } = useAxios<Trip>({
		manual: true,
	});

	useEffect(() => {
		if (!status || error) return;
		toggleEditMode();
	}, [status, error]);

	const { handleSubmit, ...reactHookFormsMethods } = useForm<IUseFromStopsData>(
		{
			resolver: zodResolver(Schemas.trip.multipleStepsTripSchema[1]),
		}
	);

	useEffect(() => {
		reactHookFormsMethods.setValue('stops', trip.stops);
	}, [trip]);

	const stopsFromFormState = reactHookFormsMethods.watch('stops');

	const stopsIds = useMemo(
		() =>
			stopsFromFormState?.map(
				(stop, i) => `${stop.location.lat}-${stop.location.lon}-${i}`
			) || [],
		[stopsFromFormState]
	);

	const onSubmit = async (newStopsData: IUseFromStopsData) => {
		await tripUpdate(activate, trip._id, newStopsData);
		await getUpdatedTrip();
	};

	const handleDragEnd = ({ over, active }: DragEndEvent) => {
		if (!over) return;

		function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[] {
			const newArray = [...array];
			const [movedItem] = newArray.splice(fromIndex, 1);
			newArray.splice(toIndex, 0, movedItem);
			return newArray;
		}

		const oldIndex = stopsFromFormState.findIndex(
			(s, i) => `${s.location.lat}-${s.location.lon}-${i}` === active.id
		);
		const newIndex = stopsFromFormState.findIndex(
			(s, i) => `${s.location.lat}-${s.location.lon}-${i}` === over.id
		);

		reactHookFormsMethods.setValue(
			'stops',
			arrayMove(stopsFromFormState, oldIndex, newIndex)
		);
	};

	const handleAddStop = () => {
		const currentStops = reactHookFormsMethods.watch('stops');

		reactHookFormsMethods.setValue('stops', [currentStops[0], ...currentStops]);
	};

	const handleOnCancel = () => {
		toggleEditMode();
	};
	return (
		<FormProvider handleSubmit={handleSubmit} {...reactHookFormsMethods}>
			<form
				className='flex grow flex-col overflow-hidden'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='my-2 flex items-start justify-between'>
					<h4>Stops</h4>

					{/* edit button */}
					<Button
						type='button'
						onClick={handleAddStop}
						className='flex justify-center gap-1 rounded-md px-2 py-1 text-sm font-normal text-white dark:text-dark'
					>
						Add stop
						<i>
							<Icon
								size='17'
								className='fill-white dark:fill-dark'
								name='plus'
							/>
						</i>
					</Button>
				</div>

				{/* stops */}
				<DndContext
					modifiers={[restrictToVerticalAxis]}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						strategy={verticalListSortingStrategy}
						items={stopsIds}
					>
						<ScrollableMiddleWTopBottom
							top={null}
							middle={
								<div className='flex flex-col gap-2 overflow-x-clip overflow-y-visible pb-8'>
									{stopsFromFormState?.map((stop, i: number) => (
										<StopEditMode
											key={`${stop.location.lat}-${stop.location.lon}-${i}`}
											index={i}
											stop={stop}
										/>
									))}
								</div>
							}
							bottom={
								<>
									<div className='mt-2 flex gap-2'>
										<Button
											onClick={handleOnCancel}
											className='flex-1'
											type='button'
										>
											Cancel
										</Button>

										<Button
											primary
											className={`flex-1 ${
												status ? (error ? 'bg-red-500' : 'bg-green-500') : ''
											}`}
											type='submit'
										>
											{!status
												? loading
													? 'Updating trip...'
													: 'Submit'
												: error
													? getErrorMessage(status)
													: 'Trip updated'}
										</Button>
									</div>
									{reactHookFormsMethods.formState.errors.stops?.message && (
										<InputFeildError
											className='text-center'
											message={
												reactHookFormsMethods.formState.errors.stops.message
											}
										/>
									)}
								</>
							}
						/>
					</SortableContext>
				</DndContext>
			</form>
		</FormProvider>
	);
}
