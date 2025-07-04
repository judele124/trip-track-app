import { Trip } from '@/types/trip';
import {
	Children,
	isValidElement,
	JSXElementConstructor,
	ReactNode,
} from 'react';

export const validateRequiredChildren = (
	children: ReactNode,
	requiredComponents: JSXElementConstructor<any>[]
) => {
	const childTypes = new Set(
		Children.toArray(children)
			.filter(isValidElement)
			.map((child) => child.type)
	);

	const missingComponents = requiredComponents.filter(
		(component) => !childTypes.has(component)
	);

	if (missingComponents.length > 0) {
		const missingNames = missingComponents
			.map((comp) => comp.name || 'Unknown Component')
			.join(', ');

		throw new Error(`Dropdown is missing required children: ${missingNames}.`);
	}
};

export function mergeRefs<T>(
	...refs: (React.Ref<T> | undefined)[]
): React.Ref<T> {
	return (node: T) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref && typeof ref === 'object') {
				(ref as React.MutableRefObject<T | null>).current = node;
			}
		});
	};
}

export function canBrowserShareData(data: ShareData) {
	if (!navigator.share || !navigator.canShare) {
		return false;
	}

	return navigator.canShare(data);
}

export const wordToCamelcase = (word: string) => {
	return word.charAt(0).toUpperCase() + word.substring(1);
};

export const IsTripChangeable = (trip: Trip): boolean => {
	const { status } = trip;
	return status === 'created' || status === 'cancelled';
};
