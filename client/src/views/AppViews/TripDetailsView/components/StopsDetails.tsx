import ScrollableMiddleWTopBottom from '@/components/ScrollableMiddleWTopBottom';
import StopDetails from './StopDetails';
import { Types } from 'trip-track-package';
import Button from '@/components/ui/Button';
import Icon from '@/components/icons/Icon';

interface IStopsDetailsProps {
	stops: Types['Trip']['Stop']['Model'][];
	toggleEditMode: () => void;
	isCreator: boolean;
}

export default function StopsDetails({
	stops,
	toggleEditMode,
	isCreator,
}: IStopsDetailsProps) {
	return (
		<ScrollableMiddleWTopBottom
			top={
				<div className='my-2 flex items-start justify-between'>
					<h4>Stops</h4>

					{/* edit button */}
					{isCreator && (
						<Button
							type={'button'}
							onClick={toggleEditMode}
							className='flex justify-center gap-1 rounded-md px-2 py-1 text-sm font-normal text-white dark:text-dark'
						>
							Edit stops
							<i>
								<Icon
									size='17'
									className='-mb-1 fill-white dark:fill-dark'
									name='edit'
								/>
							</i>
						</Button>
					)}
				</div>
			}
			middle={
				<div className='flex flex-col gap-2 overflow-x-clip overflow-y-visible'>
					{stops.map((stop, i: number) => (
						<StopDetails
							key={`${stop.location.lon}-${stop.location.lat}-${i}`}
							stop={stop}
							icon={
								(i == 0 && 'location') ||
								(i == stops.length - 1 && 'flag') ||
								'circle'
							}
						/>
					))}
				</div>
			}
			bottom={null}
		/>
	);
}
