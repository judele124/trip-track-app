import useToggle from '@/hooks/useToggle';
import Icon from '../icons/Icon';
import { useAuthContext } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from '@/hooks/useAxios';
import { useEffect } from 'react';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import InputFeildError from '../ui/InputFeildError';
import { getErrorMessage } from '@/utils/errorMessages';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const profileImageSchema = z.object({
	profileImage: z
		.any()
		.refine((filelist) => filelist[0] instanceof File, {
			message: 'Please upload a file.',
		})
		.refine((filelist) => filelist[0]?.size <= MAX_FILE_SIZE, {
			message: 'File size must be less than 5MB.',
		})
		.refine((filelist) => ACCEPTED_IMAGE_TYPES.includes(filelist[0]?.type), {
			message: 'Only .jpeg, .png formats are supported.',
		}),
});

interface ProfileImageEditButtonProps {
	imageUrl: string;
}

export default function ProfileImageEditButton({
	imageUrl,
}: ProfileImageEditButtonProps) {
	const { toggle: toggleEdit, isOpen: isEditOpen } = useToggle(false);

	return (
		<>
			<div
				onClick={toggleEdit}
				className='absolute -bottom-0 -right-0 rounded-full bg-secondary p-2 shadow-md'
			>
				<Icon name='edit' size='16' className='fill-white' />
			</div>

			{isEditOpen && (
				<EditImageModal toggleEdit={toggleEdit} imageUrl={imageUrl} />
			)}
		</>
	);
}

interface EditImageModalProps {
	toggleEdit: () => void;
	imageUrl: string;
}
function EditImageModal({ toggleEdit, imageUrl }: EditImageModalProps) {
	const { handleTokenValidation } = useAuthContext();
	const { register, handleSubmit, watch, formState, setValue } = useForm({
		resolver: zodResolver(profileImageSchema),
	});

	const { activate, error, status, loading } = useAxios({
		url: '/user/profile-image',
		method: 'PUT',
		manual: true,
	});

	useEffect(() => {
		const fetchImage = async () => {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const file = new File([blob], 'profile-image.jpg', {
				type: 'image/jpeg',
			});
			setValue('profileImage', [file]);
		};
		fetchImage();
	}, [setValue, imageUrl]);

	useEffect(() => {
		if (status && status >= 200 && status < 300) {
			handleTokenValidation().then(() => toggleEdit());
		}
	}, [status]);

	const onSubmit = async (data: z.infer<typeof profileImageSchema>) => {
		try {
			const formData = new FormData();
			if (data.profileImage)
				formData.append('profileImage', data.profileImage[0]);

			await activate({
				data: formData,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const newProfileImage = watch('profileImage')?.[0];

	return (
		<Modal center onBackdropClick={toggleEdit} open={true}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='page-colors flex max-w-[400px] flex-col gap-2 rounded-2xl p-6'
			>
				<h2 className='text-center text-xl font-semibold'>
					Edit Profile Image
				</h2>
				<Button
					onClick={(e) => e.currentTarget.querySelector('input')?.click()}
				>
					Click to upload
					<Input
						{...register('profileImage')}
						type='file'
						className='hidden'
						title={`Add image +`}
					/>
				</Button>
				<img
					src={
						newProfileImage ? URL.createObjectURL(newProfileImage) : imageUrl
					}
					alt='new profile image'
				/>

				<Button type='submit' primary={!loading} className='w-full'>
					{loading ? 'Updating...' : 'Update'}
				</Button>
				<Button onClick={toggleEdit} className='w-full'>
					Close
				</Button>
				{formState.errors.profileImage?.message && (
					<InputFeildError
						message={formState.errors.profileImage.message.toString()}
						className='mt-2'
					/>
				)}
				{error && status && (
					<InputFeildError message={getErrorMessage(status)} className='mt-2' />
				)}
			</form>
		</Modal>
	);
}
