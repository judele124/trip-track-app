import { useEffect } from 'react';
import useAxios from './useAxios';
import { API_BASE_URL } from '@/env.config';

export interface PlacePrediction {
	description: string;
	matched_substrings: {
		length: number;
		offset: number;
	}[];
	place_id: string;
	reference: string;
	structured_formatting: {
		main_text: string;
		main_text_matched_substrings: {
			length: number;
			offset: number;
		}[];
		secondary_text?: string;
	};
	terms: {
		offset: number;
		value: string;
	}[];
	types: string[];
}

interface ISuggestionResponse {
	predictions: PlacePrediction[];
	status: string;
}

interface IUseAddressSugestionsProps {
	query: string;
}

export const useAddressSugestions = ({ query }: IUseAddressSugestionsProps) => {
	const { activate, loading, data, error } = useAxios<ISuggestionResponse>({
		manual: true,
	});

	useEffect(() => {
		if (!query) {
			return;
		}

		activate({
			url: `${API_BASE_URL}/google/address-suggestions?query=${query}`,

			onError: ({ error }) => {
				console.error(error.message);
			},
			onSuccess: ({ data }) => {
				if (data?.status === 'REQUEST_DENIED') {
					throw new Error('Request Denied');
				}
			},
		});
	}, [query]);

	return {
		loading,
		suggestions: data as ISuggestionResponse,
		error,
	};
};
