import { useState } from 'react';
import { API_BASE_URL } from '@/env.config';
import useAxios from '@/hooks/useAxios';

interface IUseSocketExperiencesProps {
	tripId: string;
}

export interface IUseSocketExperiencesValue {
	isExperienceActive: boolean;
	currentExpIndex: number;
	setExperienceActive: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrentExpIndex: React.Dispatch<React.SetStateAction<number>>;
	initExpirenceIndex: () => void;
}

export default function useSocketExperiences({
	tripId,
}: IUseSocketExperiencesProps): IUseSocketExperiencesValue {
	const [currentExpIndex, setCurrentExpIndex] = useState<number>(0);
	const [isExperienceActive, setExperienceActive] = useState(false);

	const { activate: activateGetExpIndex } = useAxios<{ data: number }>({
		manual: true,
	});

	const initExpirenceIndex = async () => {
		const { data } = await activateGetExpIndex({
			url: `${API_BASE_URL}/trip/current-exp-index/${tripId}`,
		});
		if (data) {
			setCurrentExpIndex(data.data);
		}
	};

	return {
		currentExpIndex,
		isExperienceActive,
		setExperienceActive,
		initExpirenceIndex,
		setCurrentExpIndex,
	};
}
