export enum StatusCodes {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	VALIDATION_ERROR = 422,
	INTERNAL_SERVER_ERROR = 500,
}

const ERROR_MESSAGES: Record<StatusCodes, string> = {
	[StatusCodes.BAD_REQUEST]: 'Invalid request. Please check your input.',
	[StatusCodes.UNAUTHORIZED]:
		'Unauthorized. Please check your email or credentials.',
	[StatusCodes.FORBIDDEN]:
		'Access denied. You do not have permission to perform this action.',
	[StatusCodes.NOT_FOUND]: 'Service not found. Please try again later.',
	[StatusCodes.INTERNAL_SERVER_ERROR]:
		'An unexpected error occurred. Please try again later.',
	[StatusCodes.VALIDATION_ERROR]: 'Validation error. Please check your input.',
};

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

const isValidStatusCode = (status: number): status is StatusCodes => {
	return Object.values(StatusCodes).includes(status as StatusCodes);
};

export const getErrorMessage = (status: number): string => {
	if (isValidStatusCode(status)) {
		return ERROR_MESSAGES[status] || DEFAULT_ERROR_MESSAGE;
	}
	return DEFAULT_ERROR_MESSAGE;
};
