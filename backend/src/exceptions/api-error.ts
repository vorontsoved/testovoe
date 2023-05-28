export class ApiError extends Error {
    status: number
    message: string
    errors?: string[]

    constructor(code: number, message: string, errors?: string[]) {
        super(message)
        this.status = code
        this.message = message

        this.errors = errors

    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message: string, errors: any[] = []) {
        return new ApiError(400, message, errors)
    }
}
