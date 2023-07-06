const catchAsync = require("../middlewares/catchAsync");
const Price = require("../models/price");
const ApiError = require("../utils/ApiError");
require("dotenv").config();

export const getPrice = catchAsync(async (req, res) => {
    const prices = await Price.find({}, { __v: 0 });

    if (prices.length) {
        res.status(200).json({ success: true, data: prices });
    } else {
        throw new ApiError(400, "Danh sách giá bất động sản trống.");
    }
});
