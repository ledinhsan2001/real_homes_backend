const catchAsync = require("../middlewares/catchAsync");
const { NewsType } = require("../models/newsType");
const ApiError = require("../utils/ApiError");

// exports.getDetail = catchAsync(async (req, res) => {
//     const { id } = req.body;
//     const news_type = await NewsType.find({ _id: id });
//     if (news_type.length) {
//         news_type[0].__v = undefined;
//         res.status(200).json({ success: true, data: news_type });
//     } else {
//         throw new ApiError(400, "id này không tồn tại.");
//     }
// });

exports.getAll = async (req, res) => {
    const news_type = await NewsType.find();
    if (news_type.length) {
        news_type[0].__v = undefined;
        return res.status(200).json({ success: true, data: news_type });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Danh sách kiểu tin trống." });
    }
};

// exports.create = catchAsync(async (req, res) => {
//     const { id, name, unit_price } = req.body;
//     const name_exist = await NewsType.findOne({ name });
//     const id_exist = await NewsType.findOne({ _id: id });
//     if (!name_exist) {
//         if (!id_exist) {
//             const news_type = await new NewsType({
//                 _id: id,
//                 name,
//                 unit_price,
//             }).save();
//             if (news_type) {
//                 news_type.__v = undefined;
//                 res.status(201).json({
//                     success: true,
//                     message: "Tạo kiểu tin thành công.",
//                     data: news_type,
//                 });
//             }
//         } else {
//             throw new ApiError(400, "id đã tồn tại!");
//         }
//     } else {
//         throw new ApiError(400, "Tên đã tồn tại!");
//     }
// });

// exports.put = catchAsync(async (req, res) => {
//     const { id, name, unit_price } = req.body;
//     const news_type = await NewsType.findByIdAndUpdate(
//         id,
//         { name, unit_price },
//         { new: true }
//     );
//     if (news_type) {
//         news_type.__v = undefined;
//         res.status(201).json({
//             success: true,
//             message: "Update kiểu tin thành công",
//             data: news_type,
//         });
//     } else {
//         throw new ApiError(400, "Lỗi cập nhật kiểu tin!");
//     }
// });

// exports.drop = catchAsync(async (req, res) => {
//     const { id } = req.body;
//     const news_type = await NewsType.findByIdAndDelete({ _id: id });
//     if (news_type) {
//         news_type.__v = undefined;
//         res.status(201).json({
//             success: true,
//             message: "Delete kiểu tin thành công",
//             data: news_type,
//         });
//     }
// });
