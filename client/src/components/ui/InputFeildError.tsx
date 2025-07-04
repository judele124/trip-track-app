export default function InputFeildError({
	message,
	className,
}: {
	message: string;
	className?: string;
}) {
	return (
		<div className={`text-red-500 ${className} py-1 text-sm`}>* {message}</div>
	);
}
