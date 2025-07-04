import {
	FieldError,
	FieldErrorsImpl,
	Merge,
	useFormContext,
} from 'react-hook-form';
import InputWLabel from '@/components/ui/InputWLabel';
import InputFeildError from '@/components/ui/InputFeildError';
import { Types } from 'trip-track-package';

const InfoForm = ({ index: stopIndex }: { index: number }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<Types['Trip']['Model']>();

	const infoError = errors.stops?.[stopIndex]?.experience?.data as Merge<
		FieldError,
		FieldErrorsImpl<{ text: string }>
	>;
	return (
		<>
			{infoError && (
				<InputFeildError
					message={infoError?.text?.message || 'info content is required'}
				/>
			)}
			<InputWLabel
				type='text'
				title='Enter experience info'
				placeholder='Enter information'
				{...register(`stops.${stopIndex}.experience.data.text`)}
			/>
		</>
	);
};

export default InfoForm;
