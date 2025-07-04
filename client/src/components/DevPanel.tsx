import React, { useState } from 'react';
import useAxios from '@/hooks/useAxios';
import * as devService from '@/servises/devService';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { TripStatusArray } from 'trip-track-package';

interface DevPanelProps {
	tripId: string;
}

// Trip Status Management Component
const TripStatusSection = ({ tripId }: { tripId: string }) => {
	const [status, setStatus] =
		useState<(typeof TripStatusArray)[number]>('created');
	const { activate, loading } = useAxios({ manual: true });

	const handleResetTrip = async () => {
		try {
			await devService.devResetTrip(activate, tripId);
			alert('Trip reset successfully');
		} catch (error) {
			console.error(error);
			alert('Failed to reset trip');
		}
	};

	const handleStartTrip = async () => {
		try {
			await devService.devStartTrip(activate, tripId);
			alert('Trip started successfully');
		} catch (error) {
			console.error(error);
			alert('Failed to start trip');
		}
	};

	const handleEndTrip = async () => {
		try {
			await devService.devEndTrip(activate, tripId);
			alert('Trip ended successfully');
		} catch (error) {
			console.error(error);
			alert('Failed to end trip');
		}
	};

	const handleUpdateStatus = async () => {
		try {
			await devService.devUpdateTripStatus(activate, tripId, status);
			alert(`Trip status updated to ${status}`);
		} catch (error) {
			console.error(error);
			alert('Failed to update trip status');
		}
	};

	return (
		<div className='rounded-md border border-gray-200 p-3 dark:border-gray-700'>
			<h3 className='mb-2 font-medium'>Trip Status Management</h3>
			<div className='flex flex-col gap-2'>
				<Button
					onClick={handleResetTrip}
					className={`w-full ${loading ? 'opacity-70' : ''}`}
					disabled={loading}
				>
					Reset Trip
				</Button>
				<Button
					onClick={handleStartTrip}
					className={`w-full ${loading ? 'opacity-70' : ''}`}
					disabled={loading}
				>
					Start Trip
				</Button>
				<Button
					onClick={handleEndTrip}
					className={`w-full ${loading ? 'opacity-70' : ''}`}
					disabled={loading}
				>
					End Trip
				</Button>
				<div className='mt-2 flex gap-2'>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value as any)}
						className='flex-grow rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800'
					>
						{TripStatusArray.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
					<Button
						onClick={handleUpdateStatus}
						className={`${loading ? 'opacity-70' : ''}`}
						disabled={loading}
					>
						Update
					</Button>
				</div>
			</div>
		</div>
	);
};

// Debug Information Component
const DebugInfoSection = ({ tripId }: { tripId: string }) => {
	const [debugData, setDebugData] = useState<any>(null);
	const { activate, loading } = useAxios({ manual: true });

	const handleGetDebugInfo = async () => {
		try {
			const { data } = await devService.devGetTripDebugInfo(activate, tripId);
			setDebugData(data);
		} catch (error) {
			console.error(error);
			alert('Failed to get debug info');
		}
	};

	const handleGetRedisData = async () => {
		try {
			const { data } = await devService.devGetTripDebugInfo(activate, tripId);
			setDebugData(data);
			alert('Redis data retrieved');
		} catch (error) {
			console.error(error);
			alert('Failed to get redis data');
		}
	};

	return (
		<div className='rounded-md border border-gray-200 p-3 dark:border-gray-700'>
			<h3 className='mb-2 font-medium'>Debug Information</h3>
			<div className='flex flex-col gap-2'>
				<Button
					onClick={handleGetDebugInfo}
					disabled={loading}
					className='w-full'
				>
					Get Debug Info
				</Button>
				<Button
					onClick={handleGetRedisData}
					disabled={loading}
					className='w-full'
				>
					Get Redis Data
				</Button>
				{debugData && (
					<div className='mt-4'>
						<hr className='mb-2 border-gray-200 dark:border-gray-700' />
						<h4 className='mb-2 font-medium'>Debug Data</h4>
						<pre className='max-h-60 overflow-auto rounded-md bg-gray-100 p-2 text-xs dark:bg-gray-800'>
							{JSON.stringify(debugData, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
};

const DevPanel: React.FC<DevPanelProps> = ({ tripId }) => {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<div>
				<Button
					className='flex items-center gap-2 bg-primary text-white'
					onClick={() => setVisible(true)}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
							clipRule='evenodd'
						/>
					</svg>
					Dev Tools
				</Button>
			</div>

			{visible && (
				<Modal
					open={visible}
					center={true}
					onBackdropClick={() => setVisible(false)}
					containerClassName='bg-white page-colors rounded-lg shadow-lg p-4 max-w-md w-full max-h-[90vh] overflow-auto'
				>
					<div className='flex flex-col gap-4'>
						<div className='flex items-center justify-between'>
							<h2 className='text-xl font-bold'>Developer Tools</h2>
							<button
								onClick={() => setVisible(false)}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>

						{!tripId ? (
							<div className='rounded-md border border-yellow-300 bg-yellow-50 p-4 text-yellow-500 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'>
								No trip ID provided. Please open a trip to use these tools.
							</div>
						) : (
							<>
								<div className='text-sm font-medium'>
									Current Trip ID: {tripId}
								</div>
								<hr className='border-gray-200 dark:border-gray-700' />

								<div className='flex flex-col gap-4'>
									<TripStatusSection tripId={tripId} />
									<DebugInfoSection tripId={tripId} />
								</div>
							</>
						)}
					</div>
				</Modal>
			)}
		</>
	);
};

export default DevPanel;
