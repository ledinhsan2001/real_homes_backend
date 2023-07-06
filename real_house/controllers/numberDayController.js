const catchAsync = require("../middlewares/catchAsync");
const { NumberDay } = require("../models/numberDay");
const ApiError = require("../utils/ApiError");

exports.getDetail = catchAsync(async (req, res) => {
    const { id } = req.body;
    const number_day = await NumberDay.find({ _id: id });
    if (number_day.length) {
        number_day[0].__v = undefined;
        res.status(200).json({ success: true, data: number_day });
    } else {
        throw new ApiError(400, "id này không tồn tại.");
    }
});

exports.getAll = async (req, res) => {
    const number_days = await NumberDay.find();
    if (number_days.length) {
        number_days[0].__v = undefined;
        return res.status(200).json({ success: true, data: number_days });
    } else {
        return res
            .status(400)
            .json({ success: true, message: "Danh sách số ngày trống." });
    }
};

exports.create = catchAsync(async (req, res) => {
    const { id, number_day, saved_price } = req.body;
    const data = await NumberDay.findOne({ number_day });
    const id_exist = await NumberDay.findOne({ _id: id });
    if (!data) {
        if (!id_exist) {
            const data = await new NumberDay({
                _id: id,
                number_day,
                saved_price,
            }).save();
            if (data) {
                data.__v = undefined;
                res.status(201).json({
                    success: true,
                    message: "Tạo số ngày thành công.",
                    data: data,
                });
            } else {
                throw new ApiError(400, "Tạo số ngày thất bại!");
            }
        } else {
            throw new ApiError(400, "id đã tồn tại!");
        }
    } else {
        throw new ApiError(400, "Số ngày đã tồn tại!");
    }
});

exports.put = catchAsync(async (req, res) => {
    const { id, number_day, saved_price } = req.body;
    const data = await NumberDay.findByIdAndUpdate(
        id,
        { number_day, saved_price },
        { new: true }
    );
    if (data) {
        data.__v = undefined;
        res.status(201).json({
            success: true,
            message: "Update số ngày thành công",
            data: data,
        });
    } else {
        throw new ApiError(400, "Lỗi cập nhật số ngày!");
    }
});

exports.drop = catchAsync(async (req, res) => {
    const { id } = req.body;
    const number_day = await NumberDay.findByIdAndDelete({ _id: id });
    if (number_day) {
        number_day.__v = undefined;
        res.status(201).json({
            success: true,
            message: "Delete số ngày thành công",
            data: number_day,
        });
    }
});
