import { FormProvider, useForm } from 'react-hook-form';
import FormMultipleStages from '@/components/FormMultipleStages';
import { zodResolver } from '@hookform/resolvers/zod';
import CTFormStage1 from './stage1/CTFormStage1';
import CTFormStage2 from './stage2/CTFormStage2';
import { Schemas, Types } from 'trip-track-package';
import { tripCreate } from '@/servises/tripService';
import useAxios from '@/hooks/useAxios';
import InputFeildError from '@/components/ui/InputFeildError';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';
import { Trip } from '@/types/trip';

interface ICreateTripFormProps {
	currentFormStage: number;
	setCurrentFormStage: React.Dispatch<React.SetStateAction<number>>;
}

export interface IStopLocation {
	address: string;
	location: { lat: number; lng: number };
}
export type IFormData = {
	groupName: string;
	tripName: string;
	description: string;
	reward?: { title: string; image: File };
	firstStop: IStopLocation;
	lastStop: IStopLocation;
	middleStops: IStopLocation[];
};

export default function CreateTripForm({
	currentFormStage,
	setCurrentFormStage,
}: ICreateTripFormProps) {
	const nav = useNavigate();
	const [_, setSearchParams] = useSearchParams();
	const { handleSubmit, ...reactHookFormsMethods } = useForm<
		Types['Trip']['Model']
	>({
		resolver: zodResolver(
			Schemas.trip.multipleStepsTripSchema[currentFormStage]
		),
		defaultValues: {
			description: '',
			name: '',
			reward: undefined,
			stops: [],
		},
	});

	const {
		activate,
		data,
		error: tripCreateError,
		loading: tripCreateLoading,
		status,
	} = useAxios<Trip>({ manual: true });

	const handleTripCreate = async () => {
		const values = reactHookFormsMethods.getValues();

		if (values.reward == undefined) {
			delete values.reward;
		}

		await tripCreate(activate, values);
	};

	useEffect(() => {
		if (status && status >= 200 && status <= 300 && data) {
			setCurrentFormStage((prev) => prev + 1);

			const queryString = new URLSearchParams({
				tripId: data._id.toString(),
			}).toString();

			nav(`${navigationRoutes.shareTrip}?${queryString}`);
		}
	}, [status]);

	useEffect(() => {
		setCurrentFormStage(0);
		setSearchParams({});
	}, []);

	return (
		<>
			<FormProvider handleSubmit={handleSubmit} {...reactHookFormsMethods}>
				<FormMultipleStages
					className='flex grow flex-col gap-3 overflow-y-hidden'
					onLastStageSubmit={handleSubmit(handleTripCreate)}
					onMultipleStageSubmit={(e, { incrementStage }) => {
						handleSubmit(() => {
							setCurrentFormStage((prev) => prev + 1);
							incrementStage();
						})(e);
					}}
					renderStages={[<CTFormStage1 />, <CTFormStage2 />]}
				/>
			</FormProvider>
			<div className='text-center'>
				{tripCreateError && (
					<InputFeildError message={tripCreateError.message} />
				)}
				{tripCreateLoading && <p>Loading...</p>}
			</div>
		</>
	);
}
