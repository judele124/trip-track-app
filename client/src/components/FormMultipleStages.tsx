import {
	FormEvent,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	useRef,
	useState,
} from 'react';

interface IFormMultipleStagesProps extends HTMLAttributes<HTMLFormElement> {
	renderStages: (((index: number) => ReactNode) | ReactElement)[];
	onMultipleStageSubmit: (
		e: FormEvent<HTMLFormElement>,
		{ stage, incrementStage }: { stage: number; incrementStage: () => void }
	) => void;
	onLastStageSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormMultipleStages({
	renderStages,
	onMultipleStageSubmit,
	onLastStageSubmit,
	...prev
}: IFormMultipleStagesProps) {
	const [stage, setStage] = useState(0);
	const formRef = useRef<HTMLFormElement>(null);
	const stagesCount = renderStages.length;

	const incrementStage = () => {
		if (stage >= stagesCount - 1) {
			throw new Error("can't increment stage because it's the last stage");
		}
		formRef.current?.reset();
		setStage((prev) => prev + 1);
	};

	return (
		<form
			ref={formRef}
			{...prev}
			onSubmit={(e) => {
				e.preventDefault();
				if (stage == stagesCount - 1) {
					onLastStageSubmit(e);
				} else {
					onMultipleStageSubmit(e, {
						stage,
						incrementStage,
					});
				}
			}}
		>
			{typeof renderStages[stage] === 'function'
				? renderStages[stage](stage)
				: renderStages[stage]}
		</form>
	);
}
