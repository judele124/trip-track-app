import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(inputValue: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(inputValue);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [inputValue, delay]);

	return debouncedValue;
}
