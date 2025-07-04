import ProfileImageEditButton from './ProfileImageEditButton';

interface ProfileImageProps {
	imageUrl: string;
	className?: string;
	enableEdit?: boolean;
}

export const ProfileImage = ({
	imageUrl,
	className = '',
	enableEdit = false,
}: ProfileImageProps) => {
	return (
		<div className={`relative inline-block ${className}`}>
			<img
				src={imageUrl}
				alt={'profile image'}
				className={`size-20 rounded-full bg-dark object-cover dark:bg-light`}
			/>
			{enableEdit && <ProfileImageEditButton imageUrl={imageUrl} />}
		</div>
	);
};
