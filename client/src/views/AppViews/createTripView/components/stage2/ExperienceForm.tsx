import { useFormContext } from 'react-hook-form';
import Dropdown from '@/components/ui/Dropdown';
import DropdownTriggerElement from '@/components/ui/Dropdown/DropdownTriggerElement';
import DropdownMenu from '@/components/ui/Dropdown/DropdownMenu';
import Button from '@/components/ui/Button';
import TriviaForm from './experience/TriviaForm';
import InputWLabel from '@/components/ui/InputWLabel';
import { ExperienceType, Types } from 'trip-track-package';
import InputFeildError from '@/components/ui/InputFeildError';
import InfoForm from './experience/InfoForm';
import Icon from '@/components/icons/Icon';
import { FormEvent } from 'react';
import { wordToCamelcase } from '@/utils/functions';

interface IExperienceFormProps {
	index: number;
	closeModal: () => void;
}

const ExperienceForm = ({ index, closeModal }: IExperienceFormProps) => {
	const {
		watch,
		register,
		setValue,
		resetField,
		trigger,
		formState: { errors },
	} = useFormContext<Types['Trip']['Model']>();

	const validateExperience = async () => {
		if (
			!(await trigger(`stops.${index}.experience.data`)) ||
			!(await trigger(`stops.${index}.experience.type`))
		) {
			return false;
		}
		return true;
	};

	const handleOnExit = async () => {
		if (!(await validateExperience())) {
			return;
		}
		closeModal();
	};

	const handleOnRemove = () => {
		setValue(`stops.${index}.experience`, undefined);
		trigger(`stops.${index}.experience`);
		closeModal();
	};

	const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!(await validateExperience())) {
			return;
		}

		closeModal();
	};

	const selectedExperienceType = watch(`stops.${index}.experience.type`);
	const experienceTypeValues = Object.values(ExperienceType);

	return (
		<form
			className='page-colors page-padding mx-4 flex flex-col gap-2 rounded-3xl sm:mx-auto sm:max-w-[450px]'
			onSubmit={handleOnSubmit}
		>
			{errors.stops?.[index]?.experience?.type && (
				<InputFeildError message='Experience type must be selected' />
			)}
			<div className='flex justify-between'>
				<h3>Select Experience</h3>

				<i className='cursor-pointer' onClick={handleOnExit}>
					<Icon name='xIcon' />
				</i>
			</div>
			<Dropdown
				initial={experienceTypeValues.indexOf(selectedExperienceType)}
				list={experienceTypeValues}
			>
				<DropdownTriggerElement<ExperienceType>
					type='button'
					elemTextContent={(item) =>
						item ? wordToCamelcase(item.toString()) : 'Select Experience'
					}
				/>
				<DropdownMenu<ExperienceType>
					setSelected={(item) => {
						if (item === selectedExperienceType) return;

						setValue(`stops.${index}.experience.type`, item);
						trigger(`stops.${index}.experience.type`).then((res) => {
							if (res) {
								resetField(`stops.${index}.experience.score`);
								resetField(`stops.${index}.experience.data`);
							}
						});
					}}
					renderItem={({ item }) => <div>{wordToCamelcase(item)}</div>}
				/>
			</Dropdown>

			{selectedExperienceType === ExperienceType.TRIVIA && (
				<TriviaForm index={index} />
			)}
			{selectedExperienceType === ExperienceType.INFO && (
				<InfoForm index={index} />
			)}

			<InputWLabel
				type='number'
				placeholder='Enter score'
				title='Add Score'
				{...register(`stops.${index}.experience.score`, {
					valueAsNumber: true,
					min: 0,
					onChange: (e) => {
						if (e.target.value <= 0) {
							setValue(`stops.${index}.experience.score`, 0);
						}
					},
				})}
			/>
			<div className='flex gap-2'>
				<Button
					type='reset'
					className='w-full bg-red-500'
					onClick={handleOnRemove}
				>
					Remove
				</Button>
				<Button className='w-full' type='submit' primary>
					Confirm
				</Button>
			</div>
		</form>
	);
};

export default ExperienceForm;
