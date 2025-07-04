import { IconName } from '@/components/icons/Icon';

export interface IRedisUserTripData {
	imageUrl: string;
	name: string;
	score: number[]; // score for each experience in the trip
	finishedExperiences: boolean[];
	userId: string;
}

export interface IMessage {
	userId: string;
	message: string;
	timestamp: string;
	userName?: string;
}

type NotificationStatus = 'good' | 'bad' | 'warning' | 'default';

export class Notification {
	public timestamp: string;
	public message: string;
	public status: NotificationStatus;
	public icon?: IconName;
	constructor(
		message: string,
		status: NotificationStatus = 'default',
		icon?: IconName
	) {
		this.status = status;
		this.message = message;
		this.timestamp = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		});
		this.icon = icon;
	}
}

export interface IBadNotification extends Notification {
	status: 'bad';
}

export interface IUserOutOfRouteNotification extends IBadNotification {
	userId: string;
	message: 'is out of trip route';
}

export type UrgentNotificationType = UserOutOfRouteNotification;

export interface IUserLocation {
	id: string;
	location: { lat: number; lon: number };
}

export class UserOutOfRouteNotification implements IUserOutOfRouteNotification {
	public message = 'is out of trip route' as const;
	public status = 'bad' as const;
	public timestamp: string;
	constructor(public userId: string) {
		this.userId = userId;
		this.timestamp = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		});
	}
}
