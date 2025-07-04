import {
	ButtonHTMLAttributes,
	forwardRef,
	PropsWithChildren,
	Ref,
} from 'react';

type ButtonProps = {
	primary?: boolean;
	className?: string;
} & PropsWithChildren &
	ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef(
	(
		{
			className = '',
			children,
			primary,
			type = 'button',
			...props
		}: ButtonProps,
		ref: Ref<HTMLButtonElement>
	) => {
		if (primary) {
			className += ' bg-primary text-white';
		}

		if (!className.includes('text')) {
			className += ' text-white dark:text-dark';
		}

		if (!className.includes('bg')) {
			className += ' bg-dark dark:bg-light';
		}

		if (!className.includes('px-') && !className.includes('py-')) {
			className += ' px-5 py-3';
		}

		if (!className.includes('font-')) {
			className += ' font-semibold';
		}

		return (
			<button
				ref={ref}
				{...props}
				type={type}
				className={`disabled:bg-gray-500 ${className}`}
			>
				{children}
			</button>
		);
	}
);

export default Button;
