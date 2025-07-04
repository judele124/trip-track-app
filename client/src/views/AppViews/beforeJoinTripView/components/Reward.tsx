export default function Reward({
	reward,
}: {
	reward?: { image?: string; title: string };
}) {
	return (
		reward?.image && (
			<div className='flex flex-col gap-2'>
				<h4>Reward 🏆</h4>
				<div className='relative flex h-36 w-full flex-col items-center self-center rounded-xl border border-primary bg-light p-2 dark:bg-secondary'>
					<h5 className='absolute left-0 top-0 rounded-xl bg-light p-2 text-sm dark:bg-secondary'>
						{reward.title}
					</h5>

					<img
						src={reward.image}
						alt={reward.title}
						className='size-full rounded-md object-cover'
					/>
				</div>
			</div>
		)
	);
}
