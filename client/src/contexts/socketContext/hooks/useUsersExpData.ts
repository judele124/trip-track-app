import useAxios from '@/hooks/useAxios';
import { Dispatch, SetStateAction, useState } from 'react';
import { IRedisUserTripData } from '../types';
import { API_BASE_URL } from '@/env.config';

export interface ITripSocketProviderValue {
	usersInLiveTripExpData: IRedisUserTripData[];
	loadingUsersInLiveTripData: boolean;
	initUsersLiveData: () => void;
	setUsersInLiveTripExpData: Dispatch<SetStateAction<IRedisUserTripData[]>>;
}

interface IUseUsersExpDataProps {
	tripId: string;
}

export default function useUsersExpData({
	tripId,
}: IUseUsersExpDataProps): ITripSocketProviderValue {
	const [usersInLiveTripExpData, setUsersInLiveTripExpData] = useState<
		IRedisUserTripData[]
	>([]);

	const {
		activate: activateGetUsersInLiveTripData,
		loading: loadingUsersInLiveTripData,
	} = useAxios<IRedisUserTripData[]>({
		manual: true,
	});

	const initUsersLiveData = async () => {
		const { data } = await activateGetUsersInLiveTripData({
			url: `${API_BASE_URL}/trip/${tripId}/users`,
		});
		if (data) {
			setUsersInLiveTripExpData(data);
		}
	};

	return {
		usersInLiveTripExpData,
		loadingUsersInLiveTripData,
		initUsersLiveData,
		setUsersInLiveTripExpData,
	};
}
