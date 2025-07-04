import Icon from '@/components/icons/Icon';
import Button from '@/components/ui/Button';
import useToggle from '@/hooks/useToggle';
import { Types } from 'trip-track-package';
import ExirienceModal from '../ExperienceModal';
import { forwardRef } from 'react';

interface IStopMarkerProps {
	stop: Types['Trip']['Stop']['Model'];
	disableExperience?: boolean;
	isExperienceActive?: boolean;
	index: number;
	isTripActive?: boolean;
}

export default forwardRef<HTMLButtonElement, IStopMarkerProps>(
	function StopMarker(
		{
			stop,
			disableExperience = true,
			isExperienceActive = false,
			isTripActive = true,
			index,
		},
		ref
	) {
		const { isOpen, toggle } = useToggle();

		return (
			<>
				<Button
					ref={ref}
					onClick={
						!disableExperience && isExperienceActive ? toggle : undefined
					}
					className={`relative flex max-w-60 -translate-y-12 items-center justify-between gap-4 bg-light text-dark dark:bg-dark dark:text-light ${!stop.experience ? 'cursor-default hover:bg-opacity-100' : disableExperience ? 'cursor-not-allowed' : ''} ${isExperienceActive && !disableExperience ? 'animate-stop-pulse shadow-[0px_0px_8px_0px] shadow-primary' : ''} `}
				>
					<p className='overflow-hidden text-ellipsis whitespace-nowrap'>
						{stop.address}
					</p>
					{stop.experience && (
						<Icon className='fill-primary' name={stop.experience.type} />
					)}
					<svg
						className='absolute left-1/2 top-full size-5 -translate-x-1/2 fill-light dark:fill-dark'
						width='51'
						height='60'
						viewBox='0 0 51 60'
					>
						<path d='M50.75 0H0.75L27.2806 62L50.75 0Z' />
					</svg>
					{disableExperience && (
						<>
							<div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-black/80'>
								<Icon className='fill-primary' name='lock' />
							</div>
							<svg
								className='absolute left-1/2 top-full size-5 -translate-x-1/2 fill-black/80'
								width='51'
								height='60'
								viewBox='0 0 51 60'
							>
								<path d='M50.75 0H0.75L27.2806 62L50.75 0Z' />
							</svg>
						</>
					)}
				</Button>
				{stop.experience && isTripActive && (
					<ExirienceModal
						open={isOpen}
						onBackdropClick={toggle}
						experience={stop.experience}
						type={stop.experience.type}
						index={index}
					/>
				)}
			</>
		);
	}
);
