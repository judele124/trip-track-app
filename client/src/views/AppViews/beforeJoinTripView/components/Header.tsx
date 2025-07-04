export default function Header({
	name,
	description,
}: {
	name: string;
	description: string;
}) {
	return (
		<div>
			<h1>
				You're invieted to join
				<span className='text-pretty text-primary'> {name} </span>
				trip
			</h1>
			<p className='line-clamp-7 mt-2 overflow-y-scroll px-1 text-sm'>
				{description}
			</p>
		</div>
	);
}
