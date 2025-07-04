import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type FallbackFunction = () => void;

export default function useParamFromURL(
	paramKey: string,
	fallbackfun?: FallbackFunction
): string | null {
	const searchParams = useSearchParams()[0];
	const paramValue = searchParams.get(paramKey);

	useEffect(() => {
		if (!paramValue) {
			fallbackfun?.();
		}
	}, [searchParams.toString(), fallbackfun, paramKey]);

	return paramValue;
}
