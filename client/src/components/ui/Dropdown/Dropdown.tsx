import {
	createContext,
	MutableRefObject,
	ReactNode,
	useContext,
	useRef,
} from 'react';
import useToggle from '../../../hooks/useToggle';
import { useCounter } from '../../../hooks/useCounter';
import DropdownMenu from './DropdownMenu';
import DropdownTriggerElement from './DropdownTriggerElement';
import { validateRequiredChildren } from '../../../utils/functions';

interface IDropdownContext<T> {
	list?: T[];
	selectedIndex: number;
	suggestedIndex: number;
	isOpen: boolean;
	setSelectedIndex: (index: number) => void;
	resetSelectedIndex: () => void;
	setSuggestedIndex: (index: number) => void;
	incrementSuggestedIndex: () => void;
	decrementSuggestedIndex: () => void;
	close: () => void;
	open: () => void;
	toggle: () => void;
	triggerElementRef: MutableRefObject<HTMLElement | null>;
}

interface IDropdownProps<T> {
	initial?: number;
	children: ReactNode;
	list?: T[];
}

const DropdownContext = createContext<IDropdownContext<any> | null>(null);

export default function Dropdown<T>({
	initial = -1,
	children,
	list,
}: IDropdownProps<T>) {
	const MustHaveChildren = [DropdownMenu, DropdownTriggerElement];
	validateRequiredChildren(children, MustHaveChildren);

	const { isOpen, setIsOpen, toggle } = useToggle(false);
	const close = () => setIsOpen(false);
	const open = () => setIsOpen(true);

	const {
		count: suggestedIndex,
		setCount: setSuggestedIndex,
		increment: incrementSuggestedIndex,
		decrement: decrementSuggestedIndex,
	} = useCounter({
		length: list?.length || 0,
		initial,
	});

	const {
		count: selectedIndex,
		setCount: setSelectedIndex,
		reset: resetSelectedIndex,
	} = useCounter({
		length: list?.length || 0,
		initial,
	});

	const triggerElementRef = useRef<HTMLElement | null>(null);

	return (
		<DropdownContext.Provider
			value={{
				list,
				selectedIndex,
				suggestedIndex,
				isOpen,
				setSelectedIndex,
				resetSelectedIndex,
				setSuggestedIndex,
				incrementSuggestedIndex,
				decrementSuggestedIndex,
				close,
				open,
				toggle,
				triggerElementRef,
			}}
		>
			<div className='relative w-full'>{children}</div>
		</DropdownContext.Provider>
	);
}

export function useDropdown<T>() {
	const context = useContext(DropdownContext);
	if (!context) throw new Error('useDropdown must be used within a Dropdown');
	return context as IDropdownContext<T>;
}
