import { forwardRef, Ref, TextareaHTMLAttributes } from 'react';

export default forwardRef<
	HTMLTextAreaElement,
	TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea(
	{ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>,
	ref: Ref<HTMLTextAreaElement>
) {
	return (
		<textarea
			{...props}
			ref={ref}
			className={`w-full resize-none border-2 border-primary dark:bg-secondary ${className}`}
		/>
	);
});
