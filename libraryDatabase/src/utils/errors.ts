export class AppError extends Error{
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends AppError{
    constructor(message = 'Record not found') {
        super(message, 404);
    }
}

export class BadRequestError extends AppError{
    constructor(message = 'Bad request') {
        super(message, 404);
    }
}

