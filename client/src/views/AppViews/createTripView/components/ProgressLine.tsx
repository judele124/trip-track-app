import React, { Fragment, useEffect, useRef, useState } from 'react';

const SVG_SIZE = 30;
const STROKE_WIDTH = 3;

const RADIUS = (SVG_SIZE - STROKE_WIDTH) / 2;

interface ProgressLineProps {
	length: number;
	index: number;
	className?: string;
}

const ProgressLine: React.FC<ProgressLineProps> = ({
	length,
	index,
	className = '',
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [lineLength, setLineLength] = useState<number>(0);

	useEffect(() => {
		if (!ref.current) return;

		const { width } = ref.current.getBoundingClientRect();
		const availableLength = width - length * SVG_SIZE;
		setLineLength(availableLength / (length - 1));
	}, [length]);

	return (
		<div ref={ref} className={`flex items-center justify-between ${className}`}>
			{Array.from({ length }, (_, i) => {
				const isActive = i === index;
				const isCompleted = i < index;

				return (
					<Fragment key={i}>
						<svg
							className='shrink-0'
							width={SVG_SIZE}
							viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
						>
							<circle
								fill='none'
								className={`transition-all ease-in-out fill-${isActive || isCompleted ? 'primary' : 'transparent'} stroke-primary`}
								r={RADIUS}
								cx={SVG_SIZE / 2}
								cy={SVG_SIZE / 2}
								strokeWidth={STROKE_WIDTH}
							/>
						</svg>
						{i < length - 1 && (
							<svg className='shrink-0' height={SVG_SIZE} width={lineLength}>
								<line
									className={`transition-all duration-300 ease-in-out stroke-${isCompleted ? 'primary' : 'dark dark:stroke-light'}`}
									x1={10}
									y1={SVG_SIZE / 2}
									x2={lineLength - 10}
									y2={SVG_SIZE / 2}
									strokeWidth={STROKE_WIDTH}
									strokeLinecap='round'
									strokeDasharray={'10 10'}
									strokeDashoffset={isCompleted ? 5 : lineLength}
								/>
							</svg>
						)}
					</Fragment>
				);
			})}
		</div>
	);
};

export default ProgressLine;
