import { Types } from 'trip-track-package';

export type Trip = Omit<
	Types['Trip']['Model'],
	'reward' | '_id' | 'creator' | 'guides' | 'participants'
> & {
	_id: string;
	creator: Types['User']['Model'];
	guides: Types['User']['Model'][];
	reward?: {
		title: string;
		image?: string;
	};
	participants: {
		score: number;
		userId: Types['User']['Model'];
	}[];
};
