import useScreenWidth from '@/hooks/useScreenWidth';
import {
	CSSProperties,
	FC,
	MouseEvent,
	MutableRefObject,
	ReactNode,
	RefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

export type ModalAnchor =
	| 'center'
	| 'top'
	| 'top-right'
	| 'right'
	| 'bottom-right'
	| 'bottom'
	| 'bottom-left'
	| 'left'
	| 'top-left';

type CommonProps = {
	backgroundClassname?: string;
	open: boolean;
	onBackdropClick?: (e: MouseEvent<HTMLDivElement>) => void;
	children?: ReactNode;
	containerClassName?: string;
	containerStyles?: CSSProperties;
	backdropBlur?: 'none' | 'sm' | '0' | 'lg';
	portalElementsRef?: MutableRefObject<HTMLDivElement | null>;
};

type ModalProps = CommonProps &
	(
		| {
				center?: never;
				anchorElement: RefObject<HTMLElement>;
				anchorTo: ModalAnchor;
		  }
		| {
				center: boolean;
				anchorElement?: never;
				anchorTo?: never;
		  }
	);

const Modal: FC<ModalProps> = ({
	backgroundClassname = '',
	open,
	onBackdropClick,
	anchorElement,
	anchorTo,
	center,
	containerClassName = '',
	children,
	containerStyles,
	backdropBlur = 'sm',
	portalElementsRef,
}) => {
	const width = useScreenWidth();
	const [positions, setPositions] = useState([0, 0, 0, 0]);
	const childrenRef = useRef<HTMLDivElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (center || !anchorElement?.current || !childrenRef.current || !open)
			return;

		const anchorElementRect = anchorElement.current.getBoundingClientRect();
		const childrenRect = childrenRef.current.getBoundingClientRect();

		switch (anchorTo) {
			case 'top': {
				const centerHorizontal =
					anchorElementRect.left + anchorElementRect.width / 2;
				setPositions([
					anchorElementRect.bottom, // Top of the modal
					centerHorizontal + childrenRect.width / 2, // Right
					anchorElementRect.bottom + childrenRect.height, // Bottom
					centerHorizontal - childrenRect.width / 2, // Left
				]);
				break;
			}

			case 'top-right': {
				// Modal's top-right corner is aligned with the anchor's bottom-left corner
				setPositions([
					anchorElementRect.bottom, // Top of the modal
					anchorElementRect.left, // Right of the modal
					anchorElementRect.bottom + childrenRect.height, // Bottom of the modal
					anchorElementRect.left - childrenRect.width, // Left of the modal
				]);
				break;
			}

			case 'right': {
				// Modal's left edge is aligned with the anchor's right edge, centered vertically
				const centerVertical =
					anchorElementRect.top + anchorElementRect.height / 2;
				setPositions([
					centerVertical - childrenRect.height / 2, // Top
					anchorElementRect.left, // Right
					centerVertical + childrenRect.height / 2, // Bottom
					anchorElementRect.left - childrenRect.width, // Left
				]);
				break;
			}

			case 'bottom-right': {
				// Modal's top-left corner is aligned with the anchor's bottom-right corner
				setPositions([
					anchorElementRect.top - childrenRect.height, // Top of the modal
					anchorElementRect.left, // Right
					anchorElementRect.top, // Bottom
					anchorElementRect.left - childrenRect.width, // Left
				]);
				break;
			}

			case 'bottom': {
				// Modal's top edge is aligned with the anchor's bottom edge, centered horizontally
				const centerHorizontal =
					anchorElementRect.left + anchorElementRect.width / 2;

				setPositions([
					anchorElementRect.top - childrenRect.height, // Top of the modal
					centerHorizontal + childrenRect.width / 2, // Right
					anchorElementRect.top, // Bottom
					centerHorizontal - childrenRect.width / 2, // Left
				]);
				break;
			}

			case 'bottom-left': {
				// Modal's top-right corner is aligned with the anchor's bottom-left corner
				setPositions([
					anchorElementRect.top - childrenRect.height, // Top of the modal
					anchorElementRect.right - childrenRect.width, // Right
					anchorElementRect.top, // Bottom
					anchorElementRect.right, // Left
				]);
				break;
			}

			case 'left': {
				// Modal's right edge is aligned with the anchor's left edge, centered vertically
				const centerVertical =
					anchorElementRect.top + anchorElementRect.height / 2;
				setPositions([
					centerVertical - childrenRect.height / 2, // Top
					anchorElementRect.right - childrenRect.width, // Right
					centerVertical + childrenRect.height / 2, // Bottom
					anchorElementRect.right, // Left
				]);
				break;
			}

			case 'top-left': {
				// Modal's bottom-right corner is aligned with the anchor's top-left corner
				setPositions([
					anchorElementRect.bottom, // Top of the modal
					anchorElementRect.right - childrenRect.width, // Right
					anchorElementRect.bottom + childrenRect.height, // Bottom
					anchorElementRect.right, // Left
				]);
				break;
			}

			case 'center': {
				// Modal is centered horizontally and vertically relative to the anchor
				const centerHorizontal =
					anchorElementRect.left + anchorElementRect.width / 2;
				const centerVertical =
					anchorElementRect.top + anchorElementRect.height / 2;
				setPositions([
					centerVertical - childrenRect.height / 2, // Top
					centerHorizontal + childrenRect.width / 2, // Right
					centerVertical + childrenRect.height / 2, // Bottom
					centerHorizontal - childrenRect.width / 2, // Left
				]);
				break;
			}
		}
	}, [anchorElement, anchorTo, open, width]);

	useEffect(() => {
		backgroundRef.current?.classList.remove('opacity-0');
	}, [open]);

	if (!open) return null;

	return createPortal(
		<div
			ref={backgroundRef}
			onClick={(e) => {
				e.stopPropagation();
				onBackdropClick?.(e);
			}}
			className={`fixed inset-0 z-50 bg-gray-950/70 opacity-0 backdrop-blur-${backdropBlur} transition-opacity duration-150 ${backgroundClassname}`}
		>
			<div
				className={`relative w-fit ${containerClassName}`}
				ref={childrenRef}
				onClick={(e) => e.stopPropagation()}
				style={{ ...getPositionStyles(center, positions), ...containerStyles }}
			>
				{children}
			</div>
		</div>,
		portalElementsRef?.current || document.getElementById('root')!
	);
};

export default Modal;

const getPositionStyles = (
	center: boolean | undefined,
	positions: number[]
): CSSProperties => {
	if (center) {
		return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
	}

	return {
		top: `${positions?.[0] || 0}px`,
		right: `${positions?.[1] || 0}px`,
		bottom: `${positions?.[2] || 0}px`,
		left: `${positions?.[3] || 0}px`,
	};
};
