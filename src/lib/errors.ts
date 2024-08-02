export class AppError extends Error {
	constructor(message: string, public statusCode: number) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string = 'Database operation failed') {
		super(message, 500);
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401);
	}
}

export class ValidationError extends AppError {
	constructor(message: string = 'Validation failed') {
		super(message, 400);
	}
}

export class S3Error extends AppError {
	constructor(message: string = 'S3 operation failed') {
		super(message, 500);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404);
	}
}