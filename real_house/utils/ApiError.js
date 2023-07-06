
class ApiError extends Error{
    constructor(statusCode, messsage) {
        super(messsage);
        this.statusCode = statusCode;
        this.messsage = messsage;
    }
}

module.exports = ApiError;