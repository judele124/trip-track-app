import { useState } from 'react';

interface IToggleReturn {
	isOpen: boolean;
	toggle: () => void;
	setIsOpen: (isOpen: boolean) => void;
}

export default function useToggle(initialState = false): IToggleReturn {
	const [isOpen, setIsOpen] = useState(initialState);

	return { isOpen, toggle: () => setIsOpen((prev) => !prev), setIsOpen };
}
