import { UseFormRegister } from 'react-hook-form';
import Input from '@/components/ui/Input';
import InputFeildError from '@/components/ui/InputFeildError';
import Button from '@/components/ui/Button';

interface ITriviaOption {
	stopIndex: number;
	fieldsCount: number;
	register: UseFormRegister<any>;
	amountError: boolean;
	handleDeleteOption: (index: number) => void;
	handleAddOption: () => void;
}

const TriviaOption = ({
	stopIndex,
	fieldsCount,
	register,
	amountError,
	handleAddOption,
	handleDeleteOption,
}: ITriviaOption) => {
	return (
		<div className='page-colors m-4 flex flex-col gap-3 overflow-auto rounded-3xl p-4 sm:m-auto sm:max-w-[450px]'>
			{[...Array(fieldsCount)].map((_, index) => (
				<div className='flex flex-col' key={index}>
					<p className='pl-5'>{`Option ${index + 1}`}</p>
					<div className='relative'>
						<Input
							type='text'
							title={`Option ${index + 1}`}
							placeholder={`Enter option ${index + 1}`}
							{...register(
								`stops.${stopIndex}.experience.data.options.${index}`
							)}
						/>
						{index > 0 && (
							<button
								type='button'
								className='absolute right-0 top-1/2 -translate-y-1/2 text-primary'
								onClick={() => handleDeleteOption(index)}
							>
								Delete
							</button>
						)}
					</div>
				</div>
			))}
			{amountError && (
				<InputFeildError message='Options amount shuold be between 1-4' />
			)}
			<Button
				primary
				className='mt-2 w-full'
				type='button'
				onClick={() => handleAddOption()}
			>
				Add Another Option
			</Button>
		</div>
	);
};

export default TriviaOption;
