import { forwardRef, ReactNode } from 'react';

interface IScrollableMiddleWTopBottomProps {
	top: ReactNode | null;
	bottom: ReactNode | null;
	middle: ReactNode | null;
}

export default forwardRef<HTMLDivElement, IScrollableMiddleWTopBottomProps>(
	function ScrollableMiddleWTopBottom(
		{ bottom, middle, top }: IScrollableMiddleWTopBottomProps,
		ref
	) {
		return (
			<div ref={ref} className='relative flex grow flex-col overflow-hidden'>
				{top && <div>{top}</div>}
				{middle && (
					<div className='relative flex flex-col overflow-hidden'>
						<div className='pointer-events-none absolute z-10 h-5 w-full bg-gradient-to-b from-light to-transparent dark:from-dark'></div>
						<div className='relative overflow-y-auto py-2'>{middle}</div>
						<div className='pointer-events-none absolute bottom-0 z-10 h-10 w-full bg-gradient-to-t from-light to-transparent dark:from-dark'></div>
					</div>
				)}
				{bottom && <div className='relative'>{bottom}</div>}
			</div>
		);
	}
);
