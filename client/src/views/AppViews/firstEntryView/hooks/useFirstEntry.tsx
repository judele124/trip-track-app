import { useState } from 'react';

const useFirstEntry = (dataLength: number, onEndFirstEntry?: () => void) => {
	const [index, setIndex] = useState(0);

	const handleNext = () => {
		if (index + 1 === dataLength) {
			onEndFirstEntry?.();
		} else {
			setIndex((index + 1) % dataLength);
		}
	};

	const endFirstEntry = () => {
		onEndFirstEntry?.();
	};
	return { index, handleNext, endFirstEntry };
};

export default useFirstEntry;
