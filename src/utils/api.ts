type BaseError = {
	message: string;
}

export type ApiResponse<TData = any, TError extends BaseError = BaseError> =
	| { success: true; data: TData; error: null; }
	| { success: false; data: null; error: TError; }
	| { success: null; data: null; error: null; };

export function createResponse<TData>(data: TData): ApiResponse<TData> {
	return { success: true, data, error: null };
}

export function createErrorResponse<TData, TError extends BaseError>(
	message: string,
	extra: Omit<TError, 'message'> = {} as Omit<TError, 'message'>
): ApiResponse<TData, TError> {
	return {
		success: false,
		data: null,
		error: { message, ...extra } as TError
	};
}
