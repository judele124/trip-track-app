import Icon, { IconName } from '../../../../components/icons/Icon';
import { Types } from 'trip-track-package';
import Button from '../../../../components/ui/Button';
import { wordToCamelcase } from '@/utils/functions';

interface IStopDetailsProps {
	stop: Types['Trip']['Stop']['Model'];
	icon: IconName;
}

export interface IUseFromStopsData {
	stops: Types['Trip']['Stop']['Model'][];
}

const StopDetails = ({ stop, icon }: IStopDetailsProps) => {
	return (
		<div className='relative flex h-12 w-full items-center justify-start gap-2 rounded-2xl border-2 border-primary'>
			{/* icon */}
			<i className={`ml-2 w-8 ${icon === 'circle' ? 'scale-75' : ''}`}>
				<Icon name={icon} className='fill-primary' />
			</i>

			{/* address */}
			<p className='overflow-hidden text-ellipsis text-nowrap'>
				{stop.address || 'No address found'}
			</p>

			{/* experience button */}
			{stop.experience && (
				<div className='absolute bottom-0 right-0 top-0 flex gap-2 py-1.5 pr-1.5'>
					<Button
						className='flex cursor-default items-center justify-center gap-1 rounded-lg px-2 py-1 text-sm font-normal'
						type='button'
						primary
					>
						{`${wordToCamelcase(stop.experience.type)}`}
						<i>
							<Icon
								name={stop.experience.type}
								size='18'
								className='fill-white'
							/>
						</i>
					</Button>
				</div>
			)}
		</div>
	);
};

export default StopDetails;
