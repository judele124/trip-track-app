import Icon from '@/components/icons/Icon';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useToggle from '@/hooks/useToggle';
import InputFeildError from '@/components/ui/InputFeildError';
import { navigationRoutes } from '@/Routes/routes';
import { Trip } from '@/types/trip';

interface IShareTripMethods {
	trip: Trip;
}

export default function ShareTripMethods({ trip }: IShareTripMethods) {
	const { isOpen: isQrModalOpen, toggle: toggleIsQrModalOpen } = useToggle();

	const [browserError, setBrowserError] = useState<string | null>(null);

	const handleClickOtherShareMethod = async () => {
		if (!navigator.canShare) {
			setBrowserError('Sorry your browser doest support sharing.');
			return;
		}

		try {
			if (navigator.canShare(shareData)) {
				await navigator.share(shareData);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const shareTripUrl = `${window.location.origin + navigationRoutes.joinTrip}?tripId=${trip._id}`;

	const shareData = {
		url: shareTripUrl,
		text: `Check out this trip!
    The trip is called ${trip.name}
    ${trip.description ? `the trip is about ${trip.description}` : ''}
    and you can join it here:\n${shareTripUrl}`,
		title: 'Check out this trip!',
	};

	return (
		<>
			<div className='flex flex-wrap justify-center gap-5 text-center'>
				{/* whatsapp share */}
				<div className='max-w-32 rounded-2xl bg-white p-5 shadow-lg dark:bg-secondary'>
					<Link
						to={`https://wa.me/?text=${encodeURIComponent(shareData.text)}`}
						target='_blank'
					>
						<Icon size={'100%'} className='fill-green-500' name='whatsapp' />
						<p>share on whatsapp</p>
					</Link>
				</div>

				{/* create qr code */}
				<div
					onClick={() => toggleIsQrModalOpen()}
					className='max-w-32 rounded-2xl bg-white p-5 shadow-lg dark:bg-secondary'
				>
					<Icon size={'100%'} className='fill-dark' name='qr' />
					<p>create a QR code</p>
					{/* modal qr code */}
					<Modal
						center
						onBackdropClick={() => toggleIsQrModalOpen()}
						open={isQrModalOpen}
					>
						<div className='flex flex-col items-center gap-2 rounded-2xl bg-white p-10 print:w-full'>
							<QRCodeSVG
								className='print:h-full print:w-full'
								value={shareTripUrl}
							/>
							<Button className='print:hidden' onClick={() => window.print()}>
								Click to print
							</Button>
							<div className='hidden print:block'>
								<h1>{trip.name}</h1>
								<p>scan the code to join the trip</p>
							</div>
						</div>
					</Modal>
				</div>
			</div>

			<div className='text-center'>
				{browserError && <InputFeildError message={browserError} />}
				<Button
					className='bg-transparent px-0 py-0 text-dark underline underline-offset-1 dark:text-light'
					onClick={handleClickOtherShareMethod}
				>
					other share methods
				</Button>
			</div>
		</>
	);
}
