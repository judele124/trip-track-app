import { forwardRef, InputHTMLAttributes } from 'react';
import Input, { IInputProps } from './Input';

type InputWLabelProps = IInputProps & {
	labelProps?: InputHTMLAttributes<HTMLLabelElement>;
	title?: string;
	labelClassName?: string;
	labelTextCenter?: boolean;
};

export default forwardRef<HTMLInputElement, InputWLabelProps>(
	function InputWLabel(
		{
			labelProps,
			title = 'Default Title',
			labelClassName = '',
			labelTextCenter = false,
			...props
		}: InputWLabelProps,
		ref
	) {
		return (
			<label
				{...labelProps}
				className={`flex w-full flex-col gap-1 ${labelClassName}`}
			>
				<span
					className={`${labelTextCenter ? 'text-center' : 'pl-5 text-start'} font-semibold`}
				>
					{title}
				</span>
				<Input {...props} ref={ref} />
			</label>
		);
	}
);
