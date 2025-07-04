import { statusArray } from 'trip-track-package/dist/trip.schema';

// colors = [light, dark]
const colors = {
	created: ['#89bad8', '#22375a'],
	started: ['#92b483', '#034016'],
	completed: ['#c2c2c2', '#434343'],
	cancelled: ['#E5A09E', '#3C1404'],
};

interface TripStatusButtonProps {
	status: (typeof statusArray)[number];
}

export default function TripStatusButton({ status }: TripStatusButtonProps) {
	return (
		<p
			style={{
				color: colors[status][1],
				backgroundColor: colors[status][0],
				borderColor: colors[status][1],
			}}
			className={`w-24 rounded-xl border-2 py-1 text-center text-sm`}
		>
			{status}
		</p>
	);
}
