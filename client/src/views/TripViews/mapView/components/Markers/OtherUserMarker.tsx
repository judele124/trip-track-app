import GeneralMarker from './GeneralMarker';
import { IRedisUserTripData } from '@/contexts/socketContext/types';

interface IOtherUserMarkerProps {
	location: { lon: number; lat: number };
	user?: IRedisUserTripData;
}

export default function OtherUserMarker({
	location,
	user,
}: IOtherUserMarkerProps) {
	return (
		<GeneralMarker
			location={location}
			childrenAsInnerHtmlString={`
			<div class="relative flex flex-col items-center justify-center">
			  <img class="size-6 object-cover bg-secondary rounded-full shadow-md" src="${user?.imageUrl || `https://robohash.org/${user?.name}.png`}" />
			</div>
			`}
		/>
	);
}
