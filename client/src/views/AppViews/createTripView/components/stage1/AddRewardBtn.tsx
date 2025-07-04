import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import InputWLabel from '@/components/ui/InputWLabel';
import { useFormContext } from 'react-hook-form';
import InputFeildError from '@/components/ui/InputFeildError';
import Modal from '@/components/ui/Modal';
import { Types } from 'trip-track-package';
import Input from '@/components/ui/Input';
import { mergeRefs } from '@/utils/functions';

export default function AddRewardBtn() {
	const rewardImageRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const {
		watch,
		setValue,
		register,
		resetField,
		unregister,
		formState: { errors },
		trigger,
	} = useFormContext<Types['Trip']['Model']>();

	const clearReward = () => {
		setOpen(false);
		resetField('reward');
		unregister('reward.image');
		unregister('reward.title');
	};

	const confirmReward = async () => {
		const reward = watch('reward');

		// FileList is the initial value shen no file was uploaded
		// set to undefind to pass validation
		if (reward?.image instanceof FileList) {
			setValue('reward.image', undefined);
		}
		const res = await trigger('reward');
		if (res) {
			setOpen(false);
		}
	};

	useEffect(() => {
		if (open) {
			setValue('reward.image', watch('reward.image') || undefined);
		}
	}, [open]);

	const { ref, ...rewardImageRegisterReturn } = open
		? register('reward.image', {
				onChange: (e) =>
					setValue('reward.image', e.target.files[0] || undefined),
			})
		: {};

	return (
		<>
			<div className={`relative rounded-2xl bg-primary`}>
				<Button
					type='button'
					className={`relative z-10 flex w-full flex-col items-center gap-4 bg-primary shadow-md transition-all duration-75`}
					onClick={() => setOpen(true)}
				>
					{watch('reward.title') ? `🏆 ${watch('reward.title')}` : 'Add reward'}
				</Button>
				{open && (
					<Modal
						containerClassName='w-full page-x-padding max-w-[450px]'
						open={open}
						onBackdropClick={() => setOpen(false)}
						center
					>
						<div
							className={`page-colors relative flex w-full flex-col gap-2 rounded-2xl p-4 transition-all delay-150 duration-200 ease-in-out`}
							onClick={(e) => e.stopPropagation()}
						>
							{errors.reward?.title?.message && (
								<InputFeildError message={errors.reward?.title.message} />
							)}

							{/* Reward title */}
							<InputWLabel
								className='border-dark dark:border-light'
								{...register('reward.title')}
							/>
							{errors.reward?.image?.message && (
								<InputFeildError message={errors.reward?.image?.message} />
							)}

							{/* Reward Image */}
							<Button onClick={() => rewardImageRef.current?.click()}>
								{watch('reward.image')?.name || 'Add image +'}
								<Input
									ref={mergeRefs(ref, rewardImageRef)}
									type='file'
									className='hidden'
									title={`${watch('reward.image')?.name || 'Add image +'}`}
									{...rewardImageRegisterReturn}
								/>
							</Button>

							{/* Reward Buttons */}
							<Button type='button' primary onClick={confirmReward}>
								Confirm Reward
							</Button>
							<Button
								type='button'
								className='bg-transparent px-0 py-0 text-dark underline underline-offset-1 dark:text-light'
								onClick={clearReward}
							>
								Delete Reward
							</Button>
						</div>
					</Modal>
				)}
			</div>
		</>
	);
}
