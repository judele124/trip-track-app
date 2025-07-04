import Dropdown from '@/components/ui/Dropdown/Dropdown';
import DropdownMenu from '@/components/ui/Dropdown/DropdownMenu';
import DropdownTriggerElement from '@/components/ui/Dropdown/DropdownTriggerElement';
import {
	PlacePrediction,
	useAddressSugestions,
} from '@/hooks/useAddressSuggestions';
import { HTMLAttributes, useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import axios from 'axios';
import { API_BASE_URL } from '@/env.config';
import { Types } from 'trip-track-package';
import { IconName } from '@/components/icons/Icon';
import InputFeildError from '@/components/ui/InputFeildError';

interface GoogleGeocodeResults {
	geometry: { location: { lat: number; lng: number } };
}

interface IStopLocationInputProps {
	onValueChange: (value: Types['Trip']['Stop']['Model'] | undefined) => void;
	title?: string;
	icon?: IconName;
	iconFill?: string;
	textContent?: string;
	className?: string;
	triggerElementIconAttributes?: HTMLAttributes<HTMLDivElement>;
}

export default function StopLocationInput({
	iconFill = '#383644',
	icon,
	onValueChange,
	textContent = 'default',
	className = '',
	triggerElementIconAttributes,
}: IStopLocationInputProps) {
	const [isAddressGeoLocationError, setIsAddressGeoLocationError] =
		useState(false);
	const [inputValue, setInputValue] = useState('');
	const debouncedInputValue = useDebouncedValue(inputValue, 800);

	const { suggestions, loading, error } = useAddressSugestions({
		query: debouncedInputValue,
	});

	const getGeoLocationFromAddress = async (
		address: string
	): Promise<GoogleGeocodeResults['geometry']['location']> => {
		const { data } = await axios(
			`${API_BASE_URL}/google/geocode?address=${address}`
		);

		return (data.results as GoogleGeocodeResults[])[0].geometry.location;
	};

	const handleAddressSelection = async (item: PlacePrediction) => {
		try {
			const { lat, lng } = await getGeoLocationFromAddress(item.description);
			onValueChange({ location: { lat, lon: lng }, address: item.description });
			setIsAddressGeoLocationError(false);
		} catch (error) {
			setIsAddressGeoLocationError(true);
			console.error(error);
		}
	};

	useEffect(() => {
		if (debouncedInputValue === '') {
			onValueChange(undefined);
		}
	}, [debouncedInputValue]);

	return (
		<>
			<div className={`relative`}>
				<Dropdown list={suggestions?.predictions}>
					<DropdownTriggerElement<PlacePrediction>
						className={className}
						icon={loading ? 'spinner' : icon}
						type='input'
						iconFill={iconFill}
						elemTextContent={(item) => item?.description || textContent}
						onChange={(e) => setInputValue(e.target.value)}
						iconContainerAttributes={triggerElementIconAttributes}
					/>
					<DropdownMenu<PlacePrediction>
						setSelected={handleAddressSelection}
						renderItem={({ item }) => <div>{item.description}</div>}
					/>
				</Dropdown>
				{(isAddressGeoLocationError || error) && (
					<InputFeildError message='Something went wrong please try again later' />
				)}
			</div>
		</>
	);
}
