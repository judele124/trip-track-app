import GeneralMarker from './GeneralMarker';

interface IFinalStepMarkerProps {
	location: [number, number];
}

export default function FinalStepMarker({ location }: IFinalStepMarkerProps) {
	return (
		<GeneralMarker
			location={{ lat: location[1], lon: location[0] }}
			childrenAsInnerHtmlString='
            <svg class="-translate-y-2" width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_157_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="24" height="25">
                  <circle cx="13" cy="13.2313" r="11.7914" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_157_2)">
                  <rect x="1.20862" y="1.4399" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="1.20862" y="13.2313" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="7.10428" y="7.33559" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="7.10428" y="19.127" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="7.10428" y="1.4399" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="7.10428" y="13.2313" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="1.20862" y="7.33559" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="1.20862" y="19.127" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="13" y="1.4399" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="13" y="13.2313" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="18.8957" y="7.33559" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="18.8957" y="19.127" width="5.89569" height="5.89569" fill="white"/>
                  <rect x="18.8957" y="1.4399" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="18.8957" y="13.2313" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="13" y="7.33559" width="5.89569" height="5.89569" fill="black"/>
                  <rect x="13" y="19.127" width="5.89569" height="5.89569" fill="black"/>
                  </g>
                  <path d="M24.186 13.2313C24.186 7.20749 19.1779 2.32425 13 2.32425C6.82212 2.32425 1.81395 7.20749 1.81395 13.2313C1.81395 19.2551 6.82212 24.1383 13 24.1383C19.1779 24.1383 24.186 19.2551 24.186 13.2313ZM26 13.2313C26 20.2319 19.9535 25.53 13 29.4444C6.34884 25.7002 0 20.2319 0 13.2313C0 6.23066 5.8203 0.555542 13 0.555542C20.1797 0.555542 26 6.23066 26 13.2313Z" fill="black"/>
            </svg>
                  '
		/>
	);
}
