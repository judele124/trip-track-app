import ExperienceForm from '@/views/AppViews/createTripView/components/stage2/ExperienceForm';
import Modal from '../../../../components/ui/Modal';
import Icon from '../../../../components/icons/Icon';
import Button from '../../../../components/ui/Button';
import StopLocationInput from '@/views/AppViews/createTripView/components/stage2/StopLocationInput';
import { useSortable } from '@dnd-kit/sortable';
import { useFormContext } from 'react-hook-form';
import { IUseFromStopsData } from './StopDetails';
import useToggle from '@/hooks/useToggle';
import { Types } from 'trip-track-package';
import { CSS } from '@dnd-kit/utilities';
import { wordToCamelcase } from '@/utils/functions';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface IStopEditMode {
	index: number;
	stop: Types['Trip']['Stop']['Model'];
}

export default function StopEditMode({ stop, index }: IStopEditMode) {
	const { isDarkMode } = useDarkMode();
	const { setValue, watch } = useFormContext<IUseFromStopsData>();
	const { isOpen, toggle: toggleExperienceModal } = useToggle();
	const { setNodeRef, attributes, transform, transition, listeners } =
		useSortable({
			id: `${stop.location.lat}-${stop.location.lon}-${index}`,
		});

	const handleInputOnValueChange = (
		stop: Types['Trip']['Stop']['Model'] | undefined
	) => {
		if (!stop) return;
		setValue(`stops.${index}.address`, stop.address);
		setValue(`stops.${index}.location`, stop.location);
	};

	const handleOnEditExperience = () => toggleExperienceModal();

	const handleOnDeleteStop = () => {
		const newStops = [...watch('stops')];
		if (!newStops) return;
		newStops.splice(index, 1);
		setValue('stops', newStops);
	};

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} className='bg-da relative w-full'>
			<StopLocationInput
				icon='grid-dots'
				iconFill={isDarkMode ? '#ebe2d4' : '#383644'}
				textContent={watch(`stops.${index}.address`) || stop.address}
				title='Stop Location'
				className='h-12'
				onValueChange={handleInputOnValueChange}
				triggerElementIconAttributes={{
					...listeners,
					...attributes,
				}}
			/>

			{/* experience button */}
			<div className='absolute bottom-0 right-0 top-0 flex gap-1 py-2 pr-2'>
				<Button
					className='relative flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-sm font-normal'
					type='button'
					onClick={handleOnEditExperience}
					primary
				>
					{stop.experience?.type ? (
						<>
							{`${wordToCamelcase(stop.experience.type)}`}
							<i>
								<Icon
									name={stop.experience?.type || 'plus'}
									size='18'
									className='-mb-0.5 fill-white'
								/>
							</i>
						</>
					) : (
						'Add Experience'
					)}
				</Button>
				<i
					onClick={handleOnDeleteStop}
					className='content-center rounded-lg bg-red-500 px-2 py-1'
				>
					<Icon name='trash' size='16' fill='white' />
				</i>
			</div>
			<Modal containerClassName='w-full' open={isOpen} center>
				<ExperienceForm closeModal={toggleExperienceModal} index={index} />
			</Modal>
		</div>
	);
}
