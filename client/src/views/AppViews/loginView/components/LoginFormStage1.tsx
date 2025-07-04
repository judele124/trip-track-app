import { FieldErrors, UseFormRegister } from 'react-hook-form';
import InputFeildError from '@/components/ui/InputFeildError';
import InputWLabel from '@/components/ui/InputWLabel';
import Button from '@/components/ui/Button';
import { Types } from 'trip-track-package';

export default function LoginFormStage1({
	register,
	errors,
	loading,
	sendCodeError,
}: {
	register: UseFormRegister<Types['Auth']['LoginSchema']>;
	errors: FieldErrors<Types['Auth']['LoginSchema']>;
	loading: boolean;
	sendCodeError: Error | null;
}) {
	return (
		<>
			<div>
				{errors.email?.message && (
					<InputFeildError message={errors.email.message} />
				)}
				<InputWLabel
					autoComplete='email'
					{...register('email')}
					title='Enter mail address'
					placeholder='Enter mail address'
				/>
			</div>
			<Button className='w-full' type='submit' primary>
				{loading ? 'Sending code...' : 'Send code'}
			</Button>
			{sendCodeError && (
				<p className='text-center text-red-500'>{sendCodeError.message}</p>
			)}
		</>
	);
}
