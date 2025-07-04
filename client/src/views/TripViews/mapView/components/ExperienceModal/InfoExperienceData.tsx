import Button from '@/components/ui/Button';
import { Types } from 'trip-track-package';

interface InfoExperienceDataProps {
	infoExpData: Types['Trip']['Stop']['Experience']['Details']['Info']['Model'];
	onClose: () => void;
	finishExperience: (score: number) => void;
}

export default function InfoExperienceData({
	infoExpData: { data, score = 0 },
	onClose,
	finishExperience,
}: InfoExperienceDataProps) {
	const handleClose = () => {
		finishExperience(score);
		onClose();
	};

	return (
		<div className='flex flex-col gap-2'>
			<p>{data.text}</p>
			<Button className='w-full' onClick={handleClose}>
				Close
			</Button>
		</div>
	);
}
