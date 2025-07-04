import { InputHTMLAttributes } from 'react';
import InputFeildError from '@/components/ui/InputFeildError';
import AddRewardBtn from './AddRewardBtn';
import InputWLabel from '@/components/ui/InputWLabel';
import Button from '@/components/ui/Button';
import { useFormContext } from 'react-hook-form';
import { Types } from 'trip-track-package';
import TextareaWLabel from '@/components/ui/TextareaWLabel';

interface IFirstStageInput extends InputHTMLAttributes<HTMLInputElement> {
	name: keyof Types['Trip']['Model'];
}

const firstStageInputs: IFirstStageInput[] = [
	{
		name: 'name',
		title: 'Enter trip name',
		placeholder: 'Enter trip name',
	},
	{
		name: 'description',
		title: 'Enter description',
		placeholder: 'Enter description',
	},
];

export default function CTFormStage1() {
	const {
		register,
		formState: { errors },
	} = useFormContext<Types['Trip']['Model']>();

	return (
		<>
			{firstStageInputs.map(
				({ name, title, placeholder }: IFirstStageInput) => (
					<div key={name}>
						{errors[name]?.message && (
							<InputFeildError message={errors[name]?.message as string} />
						)}
						{name === 'description' ? (
							<TextareaWLabel
								title={title}
								placeholder={placeholder}
								autoComplete={name}
								{...register(name)}
							/>
						) : (
							<InputWLabel
								autoComplete={name}
								{...register(name)}
								title={title}
								placeholder={placeholder}
							/>
						)}
					</div>
				)
			)}
			<AddRewardBtn />
			<Button className='w-full' type='submit'>
				Confirm
			</Button>
		</>
	);
}
