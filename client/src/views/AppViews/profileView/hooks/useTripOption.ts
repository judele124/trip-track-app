import useAxios from '@/hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '@/Routes/routes';
import {
	cancelTrip,
	deleteTrip,
	endTrip,
	leaveTrip,
	startTrip,
} from '@/servises/tripService';
import { TripStatusArray } from 'trip-track-package';
import { IconName } from '@/components/icons/Icon';

interface IConditionProps {
	isCreator: boolean;
	isAlreadyParticipant: boolean;
}

interface IAction {
	name: string;
	label: string;
	statuses: (typeof TripStatusArray)[number][];
	condition: (props: IConditionProps) => boolean;
	iconClassName: string;
	iconName: IconName;
}

export const actions: IAction[] = [
	{
		name: 'start',
		label: 'Start',
		statuses: ['created'],
		condition: ({ isCreator }) => isCreator,
		iconClassName: 'fill-green-500',
		iconName: 'play',
	},
	{
		name: 'complete',
		label: 'Complete',
		statuses: ['started'],
		condition: ({ isCreator }) => isCreator,
		iconClassName: 'fill-green-500',
		iconName: 'checkbox',
	},
	{
		name: 'join',
		label: 'Join',
		statuses: ['created', 'started'],
		condition: ({ isAlreadyParticipant }) => !isAlreadyParticipant,
		iconClassName: 'fill-primary',
		iconName: 'join',
	},
	{
		name: 'leave',
		label: 'Leave',
		statuses: ['created', 'started'],
		condition: ({ isAlreadyParticipant }) => isAlreadyParticipant,
		iconClassName: 'fill-red-500',
		iconName: 'leave',
	},
	{
		name: 'enter',
		label: 'Enter',
		statuses: ['created', 'started'],
		condition: ({ isAlreadyParticipant }) => isAlreadyParticipant,
		iconClassName: 'fill-primary',
		iconName: 'enter-trip',
	},
	{
		name: 'delete',
		label: 'Delete',
		statuses: ['created', 'cancelled'],
		condition: ({ isCreator }) => isCreator,
		iconClassName: 'fill-red-500',
		iconName: 'trash',
	},
	{
		name: 'cancel',
		label: 'Cancel',
		statuses: ['created'],
		condition: ({ isCreator }) => isCreator,
		iconClassName: 'fill-red-500',
		iconName: 'circle-cross',
	},
	{
		name: 'share',
		label: 'Share',
		statuses: ['created'],
		condition: ({ isCreator }) => isCreator,
		iconClassName: 'fill-blue-400',
		iconName: 'share',
	},
] as const;

type ActionName = (typeof actions)[number]['name'];

interface ICheckIsValidActionProps extends IConditionProps {
	currentStatus: (typeof TripStatusArray)[number];
	actionName: ActionName;
}

export const checkIsValidAction = ({
	currentStatus,
	actionName,
	...conditionProps
}: ICheckIsValidActionProps): boolean => {
	const action = actions.find((a) => a.name === actionName);
	if (!action) {
		return false;
	}
	return (
		action.statuses.includes(currentStatus) && action.condition(conditionProps)
	);
};

interface IUseTripOptions {
	tripId: string;
	afterAction: () => void;
}

interface IUseTripOptionsReturn {
	handleActions: (actionName: ActionName) => Promise<void>;
}

export default function useTripOption({
	tripId,
	afterAction,
}: IUseTripOptions): IUseTripOptionsReturn {
	const nav = useNavigate();
	const { activate } = useAxios({
		manual: true,
	});

	const handleActions = async (actionName: ActionName) => {
		switch (actionName) {
			case 'join':
				nav(`${navigationRoutes.joinTrip}?tripId=${tripId}`);
				break;
			case 'start':
				await startTrip(activate, tripId);
				break;
			case 'complete':
				await endTrip(activate, tripId);
				break;
			case 'leave':
				await leaveTrip(activate, tripId);
				break;
			case 'cancel':
				await cancelTrip(activate, tripId);
				break;
			case 'delete':
				await deleteTrip(activate, tripId);
				break;
			case 'enter':
				nav(`${navigationRoutes.map}?tripId=${tripId}`);
				break;
			case 'share':
				nav(`${navigationRoutes.shareTrip}?tripId=${tripId}`);
				break;
			default:
				throw new Error(`Action ${actionName} doesn't exist`);
		}

		afterAction();
	};

	return {
		handleActions,
	};
}
