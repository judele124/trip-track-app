import { useState } from 'react';
import CreateTripForm from './components/CreateTripForm';
import ShareTrip from '../shareTripView/components/ShareTrip';

const STAGES_COUNT = 3;

export default function CreateTripView() {
	const [currentFormStage, setCurrentFormStage] = useState(0);

	return (
		<>
			{currentFormStage < STAGES_COUNT - 1 ? (
				<CreateTripForm
					currentFormStage={currentFormStage}
					setCurrentFormStage={setCurrentFormStage}
				/>
			) : (
				<ShareTrip />
			)}
		</>
	);
}
