interface IShareTripHeader {
	name: string;
	isCreator?: boolean;
}

export default function ShareTripHeader({ name, isCreator }: IShareTripHeader) {
	return (
		<div>
			<h1>
				Trip <span className='text-4xl font-semibold text-primary'>{name}</span>{' '}
				{isCreator ? 'created successfully' : 'is available for sharing'}
			</h1>
			<p>
				{isCreator
					? 'Share the trip to add participants'
					: 'Share the trip to add your friends'}
			</p>
		</div>
	);
}
