import { useState } from 'react';
import { UrgentNotificationType, Notification } from '../types';

interface IUseSocketNotificationsValue {
	urgentNotifications: UrgentNotificationType[];
	unreadUrgentNotificationsCount: number;
	notificationQueue: Notification[];
	removingLastNotificationFromQueue: boolean;
	addUrgentNotification: (notification: UrgentNotificationType) => void;
	resetUnreadUrgentNotificationsCount: () => void;
	addNotification: (notification: Notification) => void;
	removeLastNotificationFromQueue: () => void;
}

export default function useSocketNotifications(): IUseSocketNotificationsValue {
	const [urgentNotifications, setUrgentNotifications] = useState<
		UrgentNotificationType[]
	>([]);
	const [unreadUrgentNotificationsCount, setUnreadUrgentNotificationsCount] =
		useState(0);

	const [notificationQueue, setNotificationQueue] = useState<Notification[]>(
		[]
	);
	const [
		removingLastNotificationFromQueue,
		setRemovingLastNotificationFromQueue,
	] = useState(false);

	const addUrgentNotification = (notification: UrgentNotificationType) => {
		setUrgentNotifications((prev) => [...prev, notification]);
		setUnreadUrgentNotificationsCount((prev) => prev + 1);
		setNotificationQueue((prev) => {
			const indexToInsert = prev.findIndex(
				(notification) => notification.status === 'bad'
			);

			if (indexToInsert === -1) return [...prev, notification];

			const newQueue = [...prev];
			newQueue.splice(indexToInsert, 0, notification);
			return newQueue;
		});
	};

	return {
		notificationQueue,
		urgentNotifications,
		unreadUrgentNotificationsCount,
		removingLastNotificationFromQueue,
		addUrgentNotification,
		addNotification: (notification: Notification) => {
			setNotificationQueue((prev) => [notification, ...prev]);
		},
		resetUnreadUrgentNotificationsCount: () => {
			setUnreadUrgentNotificationsCount(0);
		},
		removeLastNotificationFromQueue: () => {
			setRemovingLastNotificationFromQueue(true);
			setNotificationQueue((prev) => prev.slice(0, -1));
			setTimeout(() => {
				setRemovingLastNotificationFromQueue(false);
			}, 100);
		},
	};
}
