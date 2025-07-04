import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import Textarea from './Textarea';

interface InputWLabelProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	labelProps?: InputHTMLAttributes<HTMLLabelElement>;
	title?: string;
	labelClassName?: string;
	labelTextCenter?: boolean;
}

export default React.forwardRef<HTMLTextAreaElement, InputWLabelProps>(
	function TextareaWLabel(
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
				<Textarea {...props} ref={ref} />
			</label>
		);
	}
);
