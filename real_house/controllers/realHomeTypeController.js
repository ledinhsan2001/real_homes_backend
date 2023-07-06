const catchAsync = require("../middlewares/catchAsync");
const RealHomeType = require("../models/realHomeType");
const { TransactionType } = require("../models/transactionType");
const ApiError = require("../utils/ApiError");

const getDetailRHT = catchAsync(async (req, res) => {
    const { id } = req.params;
    const typeRH = await RealHomeType.find({ _id: id }, { __v: 0 });
    res.status(200).json({ success: true, data: typeRH });
});

const getAllRHT = catchAsync(async (req, res) => {
    const typeRHs = await RealHomeType.find(
        {},
        {
            __v: 0,
            updatedAt: 0,
            transaction_type: { __v: 0 },
        }
    );
    if (typeRHs.length) {
        res.status(200).json({ success: true, data: typeRHs });
    } else {
        throw new ApiError(400, "Danh sách kiểu bất động sản trống.");
    }
});

const getAllTypeRHByTransType = catchAsync(async (req, res) => {
    const { transaction_type_id } = req.params;
    const typerh_by_trans_typess = await RealHomeType.find({}, { __v: 0 });
    const typerh_by_trans_types = typerh_by_trans_typess.filter(
        (item) => item.transaction_type._id == transaction_type_id
    );
    if (typerh_by_trans_types.length) {
        res.status(200).json({ success: true, data: typerh_by_trans_types });
    } else {
        throw new ApiError(
            400,
            "danh sách kiểu bất động sản theo kiểu giao dịch trống."
        );
    }
});

const addRealHomeType = catchAsync(async (req, res) => {
    const { name, transaction_type_id } = req.body;
    const nameExist = await RealHomeType.findOne({ name: name });
    if (!nameExist) {
        const transType = await TransactionType.findOne({
            _id: transaction_type_id,
        });
        if (transType) {
            const typeOfRH = await new RealHomeType({
                name: name,
                transaction_type: transType,
            }).save();
            if (typeOfRH) {
                res.status(201).json({
                    success: true,
                    message: "Create kiểu bất động sản thành công",
                    data: typeOfRH,
                });
            } else {
                throw new ApiError(400, "lỗi tạo kiểu bất động sản!");
            }
        }
    } else {
        throw new ApiError(400, "Tên này đã tồn tại!");
    }
});

const putRealHomeType = catchAsync(async (req, res) => {
    const { id } = req.query;
    const { name, transaction_type_id } = req.body;
    const transType = await TransactionType.findOne({
        _id: transaction_type_id,
    });
    if (transType) {
        const typeOfRH = await RealHomeType.findByIdAndUpdate(
            id,
            { name: name, transaction_type: transType.id },
            { new: true }
        );
        if (typeOfRH) {
            typeOfRH.__v = undefined;
            res.status(201).json({
                success: true,
                message: "Update kiểu bất động sản thành công",
                data: typeOfRH,
            });
        } else {
            throw new ApiError(400, "lỗi tạo kiểu bất động sản!");
        }
    }
});

const deleteRealHomeType = catchAsync(async (req, res) => {
    const { id } = req.params;
    const torh = await RealHomeType.findByIdAndDelete({ _id: id });
    if (torh) {
        torh.__v = undefined;
        res.status(201).json({
            success: true,
            message: "Delete kiểu bất động sản thành công",
            data: torh,
        });
    }
});

const typeOfRHController = {
    getAllTypeRHByTransType,
    getDetailRHT,
    getAllRHT,
    addRealHomeType,
    putRealHomeType,
    deleteRealHomeType,
};
module.exports = typeOfRHController;
