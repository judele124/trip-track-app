import StopLocationInput from './StopLocationInput';
import ExperienceForm from './ExperienceForm';
import Modal from '@/components/ui/Modal';
import useToggle from '@/hooks/useToggle';
import Button from '@/components/ui/Button';
import { useFormContext } from 'react-hook-form';
import { Types } from 'trip-track-package';
import { wordToCamelcase } from '@/utils/functions';

interface IStopInputProps {
	isMiddleStop?: boolean;
	index: number;
	onRemove?: () => void;
}

export default function StopInput({
	index,
	onRemove,
	isMiddleStop,
}: IStopInputProps) {
	const { setValue, resetField, watch } =
		useFormContext<Types['Trip']['Model']>();
	const {
		isOpen: isModalOpan,
		setIsOpen: setIsModalOpen,
		toggle: toggleModal,
	} = useToggle();
	const { isOpen: showBtn, setIsOpen: setShowBtn } = useToggle();
	const stopExperience = watch(`stops.${index}.experience`);
	return (
		<div className='relative'>
			<StopLocationInput
				onValueChange={(stopLocationData) => {
					if (!stopLocationData) {
						resetField(`stops.${index}`);
						setShowBtn(false);
						return;
					}

					setShowBtn(true);
					setValue(`stops.${index}.address`, stopLocationData.address);
					setValue(`stops.${index}.location`, stopLocationData.location);
				}}
				iconFill={isMiddleStop ? '' : '#ce5737'}
				icon={isMiddleStop ? 'circle' : index === 0 ? 'target' : 'flag'}
				title={'First Stop'}
			/>
			<div className='absolute bottom-0 right-0 top-0 flex gap-2 py-2 pr-2'>
				{showBtn && (
					<Button
						className='rounded-xl px-2 py-0 text-sm font-normal'
						type='button'
						onClick={() => toggleModal()}
						primary
					>
						{stopExperience?.type
							? `${wordToCamelcase(stopExperience.type)}`
							: 'Add Experience'}
					</Button>
				)}
				{isMiddleStop && (
					<Button
						className='rounded-xl bg-red-500 px-2 py-0'
						onClick={onRemove}
					>
						🗑️
					</Button>
				)}
			</div>
			<Modal
				center
				open={isModalOpan}
				onBackdropClick={() => setIsModalOpen(false)}
				containerClassName='w-full'
			>
				<ExperienceForm
					closeModal={() => setIsModalOpen(false)}
					index={index}
				/>
			</Modal>
		</div>
	);
}
