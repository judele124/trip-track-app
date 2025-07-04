import Button from '@/components/ui/Button';

const ScanQRForm = ({ index }: { index: number }) => {
	return (
		<>
			<div>
				<p className='mb-1 pl-5 font-bold'>Add a QR</p>
				<Button primary className='w-full' about='add'>
					Add
				</Button>
			</div>
			<div>
				<p className='mb-1 pl-5 font-semibold'>Create QR</p>
				<Button primary className='w-full' about='create'>
					Create
				</Button>
			</div>
		</>
	);
};

export default ScanQRForm;
