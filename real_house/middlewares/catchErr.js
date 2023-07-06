const catchError = (err, req, res, next) => {
    const errors = err.errors;
    let errMessage = err.message;
    let errStatusCode = err.statusCode;
    // console.log(JSON.stringify(err, null, 2));
    if (err.name === "ValidationError") {
        const errObj = {};
        const keys = Object.keys(errors);
        keys.map((key) => {
            errObj[key] = errors[key].message;
        });
        errMessage = errObj;
    }

    //Lỗi find id error
    if (err.kind === "ObjectId") {
        errMessage = "Invalid Id";
        errStatusCode = 400;
    }
    res.status(errStatusCode || 500).json({
        success: false,
        statusCode: errStatusCode || 500,
        message: errMessage || "Internal error!",
    });
};

module.exports = catchError;
