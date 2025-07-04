import { Trip } from '@/types/trip';

interface IGuidesProps {
	guides: Trip['guides'];
}

export default function Guides({ guides }: IGuidesProps) {
	return (
		<div className='flex flex-col gap-2'>
			<h4>Guides</h4>
			<div className='flex gap-2 overflow-x-scroll'>
				{!guides.length && <p className='text-center'>No guides yet</p>}
				{guides.map((guide) => (
					<div
						className='flex shrink-0 items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-white'
						key={guide._id}
					>
						<img
							className='size-6 rounded-full border bg-white'
							src={guide.imageUrl}
						/>
						<p className='text-sm capitalize'>{guide.name}</p>
					</div>
				))}
			</div>
		</div>
	);
}
