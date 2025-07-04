interface BaseUser {
	_id: string;
	role: 'user' | 'guest' | 'developer';
	name?: string;
	imageUrl?: string;
}

interface GuestData extends BaseUser {
	role: 'guest';
}

interface UserData extends BaseUser {
	role: 'user';
	email: string;
}

interface DeveloperData extends BaseUser {
	role: 'developer';
	email: string;
}

export type IUserResponseData = GuestData | UserData | DeveloperData;
