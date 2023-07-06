const catchAsync = require("../middlewares/catchAsync");
const Area = require("../models/area");
const ApiError = require("../utils/ApiError");
require("dotenv").config();

export const getArea = catchAsync(async (req, res) => {
    const areas = await Area.find({}, { __v: 0 });

    if (areas.length) {
        res.status(200).json({ success: true, data: areas });
    } else {
        throw new ApiError(400, "Danh sách khu vực sản trống.");
    }
});
