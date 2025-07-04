import Icon from '@/components/icons/Icon';

export default function LoadingLocation() {
	return (
		<div
			className={`flex items-center justify-center gap-2 bg-white p-2 shadow-lg dark:bg-secondary`}
		>
			<i>
				<Icon className='fill-primary dark:fill-white' name='spinner' />
			</i>
			<span className='text-primary dark:text-white'>
				Getting your location
			</span>
		</div>
	);
}
