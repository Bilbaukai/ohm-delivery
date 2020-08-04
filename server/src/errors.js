class BaseError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

class NotFoundError extends BaseError {
    constructor(message = 'Not Found') {
        super(404, message)
    }
}

class BadRequestError extends BaseError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

module.exports = {BaseError, NotFoundError, BadRequestError};