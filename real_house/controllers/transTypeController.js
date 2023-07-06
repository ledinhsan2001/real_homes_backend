const catchAsync = require("../middlewares/catchAsync");
const { TransactionType } = require("../models/transactionType");
const ApiError = require("../utils/ApiError");

const getDetailTrans = catchAsync(async (req, res) => {
    const { id } = req.body;
    const transType = await TransactionType.find({ _id: id });
    if (transType.length) {
        transType[0].__v = undefined;
        res.status(200).json({ success: true, data: transType });
    } else {
        throw new ApiError(400, "id này không tồn tại.");
    }
});

const getAllTrans = catchAsync(async (req, res) => {
    const transTypes = await TransactionType.find();
    if (transTypes.length) {
        transTypes.map((data) => {
            data.__v = undefined;
        });
        res.status(200).json({ success: true, data: transTypes });
    } else {
        throw new ApiError(400, "Danh sách kiểu giao dịch trống.");
    }
});

const addTransactionType = catchAsync(async (req, res) => {
    const { name } = req.body;
    const nameExist = await TransactionType.findOne({ name: name });
    if (!nameExist) {
        const transType = await new TransactionType({ name: name }).save();
        if (transType) {
            res.status(201).json({ success: true, data: transType });
        } else {
            throw new ApiError(400, "Lỗi tạo kiểu giao dịch động sản!");
        }
    } else {
        throw new ApiError(400, "Tên này đã tồn tại!");
    }
});

const putTransactionType = catchAsync(async (req, res) => {
    const { id, name } = req.body;
    const transType = await TransactionType.findByIdAndUpdate(
        id,
        { name: name },
        { new: true }
    );
    if (transType) {
        transType.__v = undefined;
        res.status(201).json({
            success: true,
            message: "Update kiểu giao dịch thành công",
            data: transType,
        });
    } else {
        throw new ApiError(400, "Lỗi cập nhật kiểu giao dịch!");
    }
});

const deleteTransactionType = catchAsync(async (req, res) => {
    const { id } = req.body;
    const tst = await TransactionType.findByIdAndDelete({ _id: id });
    if (tst) {
        tst.__v = undefined;
        res.status(201).json({
            success: true,
            message: "Delete kiểu giao dịch thành công",
            data: tst,
        });
    }
});
const transTypeController = {
    getDetailTrans,
    getAllTrans,
    addTransactionType,
    putTransactionType,
    deleteTransactionType,
};
module.exports = transTypeController;
