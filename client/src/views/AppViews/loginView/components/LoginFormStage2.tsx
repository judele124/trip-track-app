import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Button from '@/components/ui/Button';
import InputFeildError from '@/components/ui/InputFeildError';
import InputWLabel from '@/components/ui/InputWLabel';
import { Types } from 'trip-track-package';

export default function LoginFormStage2({
	email,
	register,
	errors,
	sendCodeStatus,
	loading,
	verifyCodeError,
	resendCode,
}: {
	email: string;
	register: UseFormRegister<Types['Auth']['LoginSchema']>;
	errors: FieldErrors<Types['Auth']['LoginSchema']>;
	sendCodeStatus: number | undefined;
	verifyCodeError: Error | null;
	loading: boolean;
	resendCode: () => void;
}) {
	return (
		<>
			{verifyCodeError && <InputFeildError message={verifyCodeError.message} />}
			<div>
				{errors.code?.message && (
					<InputFeildError message={errors.code.message} />
				)}
				<InputWLabel
					{...register('code')}
					title='Enter 6 digits code'
					placeholder='Enter code'
				/>
			</div>
			<Button className='w-full' type='submit' primary>
				{loading ? 'Loading...' : 'Verify code'}
			</Button>
			{isStatusSuccessful(sendCodeStatus) && (
				<p className='text-center'>
					code sent to {email} and will expire in 10 minutes can't find it?{' '}
					<span
						onClick={resendCode}
						className='cursor-pointer text-dark underline underline-offset-2 dark:text-light'
					>
						resend code
					</span>
				</p>
			)}
		</>
	);
}
const isStatusSuccessful = (status: number | undefined) => {
	return status && status >= 200 && status <= 300;
};
