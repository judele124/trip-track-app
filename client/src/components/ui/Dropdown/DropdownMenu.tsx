import DropdownMenuItem from './DropdownMenuItem';
import { useDropdown } from './Dropdown';
import { ReactNode, useEffect } from 'react';
import Modal from '../Modal';

export type RenderItem<T> = ({
	isSelected,
	item,
}: {
	isSelected: boolean;
	item: T;
}) => ReactNode;

interface IDropdownMenuProps<T> {
	renderItem: RenderItem<T>;
	setSelected: (item: T) => void;
}

export default function DropdownMenu<T>({
	renderItem,
	setSelected,
}: IDropdownMenuProps<T>) {
	const {
		selectedIndex,
		suggestedIndex,
		isOpen,
		list,
		setSelectedIndex,
		decrementSuggestedIndex,
		incrementSuggestedIndex,
		close,
		open,
		triggerElementRef,
	} = useDropdown<T>();

	const handleSelection = (index: number) => {
		setSelectedIndex(index);
		setSelected(list![index]);
		close();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowDown':
				incrementSuggestedIndex();
				break;
			case 'ArrowUp':
				decrementSuggestedIndex();
				break;
			case 'Enter':
				handleSelection(suggestedIndex);
				break;
			case 'Escape':
				close();
				break;
		}
	};

	useEffect(() => {
		if (!list || !list.length || selectedIndex >= 0) return;
		triggerElementRef.current?.scrollIntoView();
		open();
	}, [list]);

	useEffect(() => {
		if (!isOpen) return;

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [suggestedIndex, isOpen]);

	useEffect(() => {
		if (!list || !list.length || selectedIndex < 0) return;
		setSelected(list[selectedIndex]);
	}, [selectedIndex]);

	if (!list || !list.length || !triggerElementRef.current) return null;

	const { width: triggerElementWidth } =
		triggerElementRef.current.getBoundingClientRect();

	return (
		<Modal
			backdropBlur='none'
			backgroundClassname='bg-transparent'
			onBackdropClick={close}
			containerStyles={{ width: triggerElementWidth }}
			open={isOpen}
			anchorElement={triggerElementRef}
			anchorTo='top'
		>
			<ul
				onMouseOver={(e) => e.stopPropagation()}
				className='max-h-48 w-full overflow-y-auto rounded-2xl border-2 border-dark bg-white shadow-lg'
				role='listbox'
			>
				{list.map((item, i) => (
					<DropdownMenuItem
						item={item}
						renderItem={renderItem}
						isSelected={selectedIndex === i}
						isSuggested={i === suggestedIndex}
						i={i}
						key={i}
					/>
				))}
			</ul>
		</Modal>
	);
}
