import {
	ChangeEvent,
	HTMLAttributes,
	InputHTMLAttributes,
	KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import Input from '../Input';
import { useDropdown } from './Dropdown';
import { IconName } from '@/components/icons/Icon';

interface IDropdownInputProps extends InputHTMLAttributes<HTMLInputElement> {
	icon?: IconName;
	value: string;
	autoFocus: boolean;
	iconFill?: string;
	iconContainerAttributes?: HTMLAttributes<HTMLDivElement>;
}

export default function DropdownInput({
	icon,
	value,
	autoFocus,
	onChange,
	iconFill,
	iconContainerAttributes,
	...props
}: IDropdownInputProps) {
	const { isOpen, resetSelectedIndex, triggerElementRef } = useDropdown();
	const [inputValue, setInputValue] = useState(value || '');
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setInputValue(value || '');
		if (autoFocus) inputRef.current?.focus();
	}, []);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	return (
		<div className='relative'>
			<Input
				iconContainerAttributes={iconContainerAttributes}
				iconFill={iconFill}
				ref={(node) => {
					if (!node) return;
					inputRef.current = node;
					triggerElementRef.current = node;
				}}
				icon={icon}
				value={inputValue}
				onChange={(e) => {
					onChange?.(e as ChangeEvent<HTMLInputElement>);
					setInputValue(e.target.value);
				}}
				onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
					if (e.key === 'Escape') {
						e.currentTarget.blur();
					}
					if (e.key === 'Backspace') {
						resetSelectedIndex();
					}
					props.onKeyDown?.(e);
				}}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
				onBlur={() => setInputValue(value)}
				{...props}
			/>
		</div>
	);
}
