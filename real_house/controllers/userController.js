const Role = require("../models/role");
const catchAsync = require("../middlewares/catchAsync");
const ApiError = require("../utils/ApiError");
const { User } = require("../models/user");

const getAllUserLimit = async (req, res) => {
    const { page } = req.query;
    let page_number = parseInt(page);
    let limit = process.env.LIMIT;
    let startIndex = page_number * limit;
    let lastIndex = (page_number + 1) * limit;
    const results = {};
    try {
        const user = await User.find().sort({ createdAt: -1 });
        if (user.length > 0) {
            if (lastIndex >= user.length) {
                lastIndex = user.length;
            }
            results.limit_data_user = user.slice(startIndex, lastIndex);
            results.total_all_user = user.length;
            results.page_count_user = Math.ceil(user.length / limit);
            return res.status(200).json({
                success: true,
                data: results,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Không có tài khoản nào!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Không có người dùng nào!",
        });
    }
};

const getAllUser = async (req, res) => {
    const user = await User.find().sort({ createdAt: -1 });
    if (user.length > 0) {
        return res.status(200).json({
            success: true,
            all_user: user,
            total_all_user: user.length,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Không có tài khoản nào!",
        });
    }
};

const getUserPublic = catchAsync(async (req, res) => {
    const _id = req.query;
    const user = await User.findById(_id, { password: 0, __v: 0 });
    if (user) {
        return res.status(200).json({ success: true, data: user });
    } else {
        return res.status(400).json({
            success: false,
            message: "Tài khoản không tồn tại.",
        });
    }
});

const getUser = catchAsync(async (req, res) => {
    const id = req.userId;
    const user = await User.findById({ _id: id }, { password: 0, __v: 0 });
    if (user) {
        res.status(200).json({ success: true, data: user });
    } else {
        res.status(400).json({
            success: false,
            message: "Tài khoản không tồn tại.",
        });
    }
});

const putUser = async (req, res) => {
    const id = req.userId;
    const payload = req.body;

    //filter drop all value null
    let obj = {};
    let obj_to_arr = Object.entries(payload);
    let arr_not_null = obj_to_arr.filter((item) => item[1] !== "");
    arr_not_null.map((item) => (obj[item[0]] = item[1]));
    try {
        await User.findByIdAndUpdate(id, obj);
        return res.status(200).json({
            success: true,
            message: `Bạn đã cập nhật thông tin thành công`,
        });
    } catch (error) {
        return res
            .status(200)
            .json({ success: false, message: `Lỗi cập nhật thông tin` });
    }
};

const drop = async (req, res) => {
    const { _id } = req.query;
    try {
        await User.findByIdAndDelete(_id);
        return res.status(200).json({
            success: true,
            message: `Bạn đã xóa thành công.`,
        });
    } catch (error) {
        return res
            .status(200)
            .json({ success: false, message: `Lỗi xóa tài khoản!` });
    }
};

const userController = {
    getAllUserLimit,
    getAllUser,
    getUserPublic,
    getUser,
    putUser,
    drop,
};
module.exports = userController;
