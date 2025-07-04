import { HTMLAttributes, MouseEvent, useEffect, useRef } from 'react';
import Button from '../Button';
import { useDropdown } from './Dropdown';
import Icon, { IconName } from '@/components/icons/Icon';

interface IDropdownButtonProps extends HTMLAttributes<HTMLButtonElement> {
	icon?: IconName;
	value: string;
	autoFocus?: boolean;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	iconFill?: string;
	className?: string;
	iconContainerAttributes?: HTMLAttributes<HTMLDivElement>;
}

export default function DropdownButton({
	iconFill,
	icon,
	value,
	autoFocus,
	onClick,
	className,
	iconContainerAttributes,
	...props
}: IDropdownButtonProps) {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const { toggle, isOpen, triggerElementRef } = useDropdown();

	useEffect(() => {
		if (autoFocus) buttonRef.current?.focus();
	}, []);

	return (
		<Button
			ref={(node) => {
				if (!node) return;
				triggerElementRef.current = node;
				buttonRef.current = node;
			}}
			onClick={(e) => {
				toggle();
				onClick?.(e);
			}}
			className={`flex w-full items-center justify-start border-2 border-black bg-white text-dark ${className}`}
			aria-haspopup='listbox'
			aria-expanded={isOpen}
			{...props}
		>
			{icon && (
				<div
					{...iconContainerAttributes}
					className='absolute left-3 top-1/2 -translate-y-1/2'
				>
					<Icon fill={iconFill} name={icon} />
				</div>
			)}
			<span className={`${icon ? 'pl-6' : ''}`}>{value}</span>
		</Button>
	);
}
