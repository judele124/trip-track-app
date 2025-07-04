import Icon from '@/components/icons/Icon';
import { DirectionStep } from '@/types/map';
import { IconName } from '@/components/icons/Icon';
import useToggle from '@/hooks/useToggle';
import { useTripLayout } from '@/components/layouts/TripLayout/TripLayout';
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

interface DirectionComponentProps {
	steps: DirectionStep[];
	nextStepIndex: number;
	userToStepNextDistance: number;
}

const directions: Record<string, IconName> = {
	straight: 'directionStraightArrow',
	right: 'directionRightArrow',
	left: 'directionLeftArrow',
	'sharp left': 'directionLeftArrow',
	'sharp right': 'directionRightArrow',
	'slight left': 'directionSlightLeftArrow',
	'slight right': 'directionSlightRightArrow',
};

function DirectionComponent({
	steps,
	nextStepIndex,
	userToStepNextDistance,
}: DirectionComponentProps) {
	const { pageContentRef } = useTripLayout();
	const { isOpen: showRestStops, setIsOpen: setShowRestStops } = useToggle();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!showRestStops) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setShowRestStops(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [showRestStops]);

	if (!pageContentRef.current) return null;

	const icon: IconName =
		nextStepIndex === steps.length - 1
			? 'flag'
			: directions[steps[nextStepIndex].maneuver.modifier];

	return createPortal(
		<div className='page-colors absolute bottom-2 left-1/2 z-10 max-h-[40vh] w-[90vw] max-w-[380px] -translate-x-1/2 -translate-y-2 overflow-y-auto rounded-2xl border-2 border-primary text-sm'>
			{(!steps || steps.length === 0) && <div>no route found</div>}

			{steps[nextStepIndex] && (
				<div
					ref={ref}
					onClick={() => !showRestStops && setShowRestStops(true)}
					className='cursor-pointer'
				>
					{/* Current Step */}
					<Step
						step={steps[nextStepIndex]}
						userToStepNextDistance={userToStepNextDistance}
						icon={icon}
					/>

					{/* Remaining Steps */}
					{showRestStops && (
						<div>
							{steps.slice(nextStepIndex + 1).map((step, index) => (
								<Step
									key={nextStepIndex + 1 + index}
									step={step}
									userToStepNextDistance={steps[nextStepIndex + index].distance}
									icon={
										nextStepIndex + 1 + index === steps.length - 1
											? 'flag'
											: directions[step.maneuver.modifier] ||
												'directionStraightArrow'
									}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>,
		pageContentRef.current
	);
}

export default DirectionComponent;

interface StepProps {
	step: DirectionStep;
	userToStepNextDistance: number;
	icon: IconName;
}

function Step({ step, userToStepNextDistance, icon }: StepProps) {
	return (
		<div className='flex items-center justify-between p-2 text-gray-800 dark:text-light'>
			<Icon name={icon} size='18' fill='#ce5737' className='mr-2' />
			<div className='flex w-[50%] flex-col'>
				<span className='text-sm font-semibold'>
					{step.maneuver.instruction}
				</span>
			</div>
			<div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300'>
				<div className='flex flex-row items-center text-center'>
					<Icon name='userWalking' fill='#ce5737' />{' '}
					{`${Math.floor(userToStepNextDistance)} meters`}
				</div>
				<div className='flex min-w-[45%] items-center gap-x-0.5 border-l-2 border-gray-500 pl-1'>
					<Icon name='clock' fill='#ce5737' size='16' />{' '}
					{Math.ceil(step.duration / 60)} min
				</div>
			</div>
		</div>
	);
}
