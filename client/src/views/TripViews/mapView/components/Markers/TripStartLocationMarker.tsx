import GeneralMarker from './GeneralMarker';

interface ITripStartLocationMarker {
	location: {
		lat: number;
		lon: number;
	};
}

export default function TripStartLocationMarker({
	location,
}: ITripStartLocationMarker) {
	const markerHtml = `
		<div
			class="relative flex max-w-60 -translate-y-12 items-center justify-between gap-4 rounded-2xl bg-light p-3 text-dark dark:bg-dark dark:text-light"
		>
			<p class="text-sm font-semibold">Trip start point</p>
			<svg
				class="absolute left-1/2 top-full size-5 -translate-x-1/2 fill-light dark:fill-dark"
				width="51"
				height="60"
				viewBox="0 0 51 60"
			>
				<path d="M50.75 0H0.75L27.2806 62L50.75 0Z" />
			</svg>
		</div>
	`;

	return (
		<GeneralMarker
			id='trip-start-location'
			location={location}
			childrenAsInnerHtmlString={markerHtml}
		/>
	);
}
