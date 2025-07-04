import { API_BASE_URL } from '@/env.config';
import { UseAxiosResponse } from '@/hooks/useAxios';
import { Trip } from '@/types/trip';

/**
 * Dev service for debugging and development purposes
 * These functions should only be used during development
 */

/**
 * Reset a trip (end it and start it again)
 */
export const devResetTrip = async (
	activate: UseAxiosResponse['activate'],
	id: string
) => {
	const { data, status, error } = await activate({
		method: 'PUT',
		url: `${API_BASE_URL}/dev/trip/reset/${id}`,
	});
	if (error) {
		throw error;
	}
	return { data, status, error };
};

/**
 * Start a trip without status validation
 */
export const devStartTrip = async (
	activate: UseAxiosResponse['activate'],
	id: string
) => {
	const { data, status, error } = await activate({
		method: 'PUT',
		url: `${API_BASE_URL}/dev/trip/start/${id}`,
	});
	if (error) {
		throw error;
	}
	return { data, status, error };

	return { data, status };
};

/**
 * End a trip without status validation
 */
export const devEndTrip = async (
	activate: UseAxiosResponse['activate'],
	id: string
) => {
	const { data, status, error } = await activate({
		method: 'PUT',
		url: `${API_BASE_URL}/dev/trip/end/${id}`,
	});
	if (error) {
		throw error;
	}
	return { data, status, error };
};

/**
 * Update trip status without validation
 */
export const devUpdateTripStatus = async (
	activate: UseAxiosResponse['activate'],
	id: string,
	status: Trip['status']
) => {
	const {
		data,
		status: responseStatus,
		error,
	} = await activate({
		method: 'PUT',
		url: `${API_BASE_URL}/dev/trip/status/${id}/${status}`,
	});
	if (error) {
		throw error;
	}
	return { data, status: responseStatus };
};

/**
 * Get comprehensive debug info for a trip
 */
export const devGetTripDebugInfo = async (
	activate: UseAxiosResponse['activate'],
	id: string
) => {
	const { data, status, error } = await activate({
		method: 'GET',
		url: `${API_BASE_URL}/dev/trip/debug/${id}`,
	});
	if (error) {
		throw error;
	}
	return { data, status, error };
};
