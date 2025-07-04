import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Types } from 'trip-track-package';
import useToggle from '@/hooks/useToggle';
import Modal from '@/components/ui/Modal';

interface TriviaExperienceDataProps {
	triviaExpData: Types['Trip']['Stop']['Experience']['Details']['Trivia']['Model'];
	onClose: () => void;
	finishExperience: (score: number) => void;
}

export default function TriviaExperienceData({
	triviaExpData: { data, score = 0 },
	onClose,
	finishExperience,
}: TriviaExperienceDataProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [options] = useState(() =>
		createOptionsWithAnswer(data.options, data.answer)
	);
	const {
		isOpen: correctAnswerModalOpen,
		toggle: toggleCorrectAnswerModalOpen,
	} = useToggle();
	useEffect(() => {
		if (!selectedOption) return;
		let updatedScore = 0;
		if (selectedOption === data.answer) {
			toggleCorrectAnswerModalOpen();
			updatedScore = score;
		}
		finishExperience(updatedScore);
	}, [selectedOption]);

	const getButtonStyle = (option: string) => {
		if (!selectedOption) return 'bg-dark dark:bg-light hover:bg-opacity-80';

		if (option === data.answer) {
			return 'bg-green-500 cursor-default';
		}

		if (selectedOption === option && option !== data.answer) {
			return 'bg-red-500 cursor-default';
		}

		return 'bg-gray-500 cursor-default';
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='text-lg font-medium'>{data.question}</div>
			<div className='flex flex-col gap-2'>
				{options.map((option) => (
					<Button
						key={option}
						onClick={
							!selectedOption ? () => setSelectedOption(option) : undefined
						}
						className={`flex w-full items-center justify-between ${getButtonStyle(option)}`}
					>
						<span>{option}</span>
						{selectedOption && (
							<span className='ml-2'>
								{option === data.answer && option == selectedOption && '✓'}
							</span>
						)}
					</Button>
				))}
			</div>

			<Button onClick={onClose} primary>
				Close Trivia
			</Button>
			<Modal
				onBackdropClick={() => toggleCorrectAnswerModalOpen()}
				center
				open={correctAnswerModalOpen}
			>
				<div className='flex w-[95vw] max-w-[400px] flex-col gap-4 rounded-2xl bg-green-500 p-10 text-center'>
					<h3>You are correct</h3>
					<Button onClick={toggleCorrectAnswerModalOpen} className='w-full'>
						Close
					</Button>
				</div>
			</Modal>
		</div>
	);
}

function createOptionsWithAnswer(options: string[], answer: string): string[] {
	const allOptions = [...options];
	allOptions.push(answer);

	for (let i = allOptions.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
	}

	return allOptions;
}
