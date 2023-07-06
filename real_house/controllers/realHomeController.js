import moment from "moment";
import "moment/locale/vi";
import { Payment } from "../models/payment";
const catchAsync = require("../middlewares/catchAsync");
const { Description } = require("../models/description");
const { Image } = require("../models/image");
const { RealHome } = require("../models/realHome");
const { TransactionType } = require("../models/transactionType");
const { User } = require("../models/user");
const { FormatDate } = require("../utils/FormatDate");
require("dotenv").config();
const cloudinary = require("../utils/cloudinary");

export const getDetail = catchAsync(async (req, res) => {
    const { id } = req.query;
    try {
        const real_home = await RealHome.findOne({ _id: id }, { __v: 0 });
        const payment = await Payment.findOne({
            "real_home._id": real_home._id,
        });
        if (real_home) {
            return res
                .status(200)
                .json({ success: true, data: real_home, payment: payment });
        }
        return res
            .status(400)
            .json({ success: false, message: "Bất động sản không tồn tại!" });
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Bất động sản không tồn tại!" });
    }
});

export const getNewPost = catchAsync(async (req, res) => {
    const typeRHs = await RealHome.find(
        {
            active: true,
        },
        {
            _id: 1,
            images: {
                url: 1,
            },
            createdAt: 1,
            description: {
                price: 1,
                title_description: 1,
            },
            news_type_id: 1,
        }
    )
        .sort({ createdAt: -1 })
        .limit(7);

    if (typeRHs.length > 0) {
        // const limit_data = page_number * limit;
        // .skip(limit_data)
        // .limit(limit);

        res.status(200).json({ success: true, data: typeRHs });
    } else {
        return res
            .status(400)
            .json({ message: "Danh sách bất động sản trống." });
    }
});

export const getAllByUserPublic = async (req, res) => {
    const { _id } = req.query;
    let typeRHs = await RealHome.find(
        { "user_post._id": _id, active: true },
        { __v: 0 }
    ).sort({ start_date: -1 });
    if (typeRHs.length > 0) {
        return res.status(200).json({
            success: true,
            data: typeRHs,
            total_post_by_user: typeRHs.length,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Không có tin bất động sản nào.",
        });
    }
};

export const getAllByUser = catchAsync(async (req, res) => {
    const user_id = req.userId;
    const { page, filter_id } = req.query;

    let page_number = parseInt(page);
    let limit = process.env.LIMIT;
    const results = {};

    let clause_where = {};
    // obligate
    clause_where["user_post._id"] = user_id;

    if (filter_id) {
        if (+filter_id === 1) {
            clause_where["news_type_id"] = 0;
        }
        if (+filter_id === 2) {
            clause_where["news_type_id"] = 1;
        }
        if (+filter_id === 3) {
            clause_where["news_type_id"] = 2;
        }
        if (+filter_id === 4) {
            clause_where["active"] = false;
            clause_where["sold"] = false;
        }
        if (+filter_id === 5) {
            //case have not until change status active expired when click sold
            clause_where["active"] = true;
            clause_where["sold"] = false;
        }
        if (+filter_id === 6) {
            clause_where["sold"] = true;
        }
    }

    let typeRHs = await RealHome.find(clause_where, { __v: 0 }).sort({
        start_date: -1,
    });

    let payment = await Payment.find({ "user._id": user_id });

    let startIndex = page_number * limit;
    let lastIndex = (page_number + 1) * limit;
    if (typeRHs.length > 0) {
        if (lastIndex >= typeRHs.length) {
            lastIndex = typeRHs.length;
        }
        results.data_post_by_user = typeRHs.slice(startIndex, lastIndex);
        results.total_data_post_by_user = typeRHs.length;
        results.page_count_post_by_user = Math.ceil(typeRHs.length / limit);
        results.payment = payment;

        return res.status(200).json({ success: true, data: results });
    } else {
        return res
            .status(400)
            .json({ message: "Danh sách bất động sản trống." });
    }
});

export const getAllByUserUnPayment = catchAsync(async (req, res) => {
    const user_id = req.userId;

    const results = {};
    let typeRHs = await RealHome.find(
        { active: false, "user_post._id": user_id, sold: false },
        { __v: 0 }
    ).sort({ start_date: -1 });

    if (typeRHs.length > 0) {
        results.data = typeRHs;
        results.total_data = typeRHs.length;
        res.status(200).json({ success: true, data: results });
    } else {
        return res
            .status(400)
            .json({ message: "Danh sách bất động sản trống." });
    }
});

export const getAllLimit = catchAsync(async (req, res) => {
    const {
        page,
        transaction_type_id,
        real_home_type_id,
        price_id,
        area_id,
        province_id,
        sort_id,
        news_type_id,
    } = req.query;

    //search is format arr[[1,2,3]] = object
    let arr_price;
    let arr_area;
    arr_price =
        typeof price_id === "object"
            ? (arr_price = price_id[0])
            : (arr_price = [price_id]);
    arr_area =
        typeof area_id === "object"
            ? (arr_area = area_id[0])
            : (arr_area = [area_id]);

    let sort = +sort_id;
    let objsort = {};
    // sort follow news_type everytime
    objsort["news_type_id"] = 1;
    if (sort) {
        if (+sort === 0) {
            objsort["createdAt"] = 1;
        }
        if (+sort === 1) {
            objsort["createdAt"] = -1;
        }
        if (+sort === 2) {
            objsort["description.area"] = 1;
        }
        if (+sort === 3) {
            objsort["description.area"] = -1;
        }
    }

    let page_number = parseInt(page);
    let limit = process.env.LIMIT;
    const results = {};

    let clause_where = {};
    // posts paymented
    clause_where["active"] = true;
    if (transaction_type_id) {
        clause_where["transaction_type_id"] = transaction_type_id;
    }
    if (real_home_type_id) {
        clause_where["real_home_type_id"] = real_home_type_id;
    }
    if (price_id) {
        clause_where["price_id"] = { $in: arr_price };
    }
    if (area_id) {
        clause_where["area_id"] = { $in: arr_area };
    }
    if (province_id) {
        clause_where["province_id"] = +province_id;
    }
    if (news_type_id) {
        let number_id = +news_type_id;
        if (number_id !== 3) {
            clause_where["news_type_id"] = +news_type_id;
        }
    }

    const typeRHs = await RealHome.find(clause_where, { __v: 0 }).sort(objsort);

    // const limit_data = page_number * limit;
    // .skip(limit_data)
    // .limit(limit);

    let startIndex = page_number * limit;
    let lastIndex = (page_number + 1) * limit;
    if (typeRHs.length > 0) {
        if (lastIndex >= typeRHs.length) {
            lastIndex = typeRHs.length;
        }
        results.data = typeRHs.slice(startIndex, lastIndex);
        results.total_data = typeRHs.length;
        results.page_count = Math.ceil(typeRHs.length / limit);
        res.status(200).json({ success: true, data: results });
    } else {
        return res
            .status(400)
            .json({ message: "Danh sách bất động sản trống." });
    }
});

export const getAll = async (req, res) => {
    const typeRHs = await RealHome.find().sort({ createdAt: -1 });
    // ([{
    //     $lookup: {
    //         from: "Area",
    //         localField: "area_id",
    //         foreignField: "_id",
    //         as: "area_order",
    //     },
    // },
    // {
    //     $sort: {
    //         "description.area": 1,
    //     },
    // },
    // {
    //     $group: {
    //         _id: "$area_id",
    //     },
    // },
    // { $unwind: "$RealHome" },
    // ]);
    if (typeRHs.length) {
        return res.status(200).json({
            success: true,
            data: typeRHs,
            total_all_data: typeRHs.length,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Danh sách kiểu bất động sản trống.",
        });
    }
};

export const create = async (req, res) => {
    const {
        user_post,
        address,
        images,
        real_home_type_id,
        transaction_type_id,
        title_description,
        content_description,
        price,
        area,
        bedroom,
        toilet,
        price_id,
        area_id,
        province_id,
    } = req.body;
    const nameExist = await User.findOne({ _id: user_post });
    const obj_images = await Image.create({
        url: JSON.stringify(images.url),
    });

    const transaction_type_name = await TransactionType.findOne({
        _id: transaction_type_id,
    });

    const short_des = `Anh/Chị ${nameExist.first_name} ${nameExist.last_name}. SĐT: ${nameExist.phone}. ${transaction_type_name.name} ${address} Giá: ${price} VND, diện tích: ${area} m2`;

    try {
        const obj_description = await Description.create({
            title_description,
            short_description: short_des,
            content_description,
            price,
            area: +area,
            bedroom,
            toilet,
        });

        let start_date = FormatDate();
        const real_home = await RealHome.create({
            user_post: nameExist,
            address,
            start_date,
            images: obj_images,
            real_home_type_id,
            transaction_type_id,
            description: obj_description,
            price_id,
            area_id,
            province_id,
        });

        real_home.save();

        if (real_home) {
            res.status(201).json({
                success: true,
                message: "Bạn đã tạo mới bất động sản thành công",
                data: real_home,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Tạo mới bất động sản không thành công!",
            });
            // throw new ApiError(400, "Tên này đã tồn tại!");
        }
    } catch (error) {
        const errors = error.errors;
        let errMessage;
        const errObj = {};
        if (error.name === "ValidationError") {
            const keys = Object.keys(errors);
            keys.map((key) => {
                errObj[key] = errors[key].message;
            });
            errMessage = errObj;
        }
        return res.status(500).json({
            success: false,
            message: errMessage || "Internal error!",
        });
    }
};

export const put = catchAsync(async (req, res) => {
    const {
        user_post,
        address,
        images,
        real_home_type_id,
        transaction_type_id,
        title_description,
        content_description,
        price,
        area,
        bedroom,
        toilet,
        price_id,
        area_id,
        province_id,
        description_id,
        images_id,
        real_home_id,
    } = req.body;
    const nameExist = await User.findOne({ _id: user_post });
    let obj_images = await Image.findOneAndUpdate(
        { _id: images_id },
        {
            url: JSON.stringify(images.url),
        }
    );
    // id img not exist then create new images
    if (!obj_images) {
        obj_images = await Image.create({
            url: JSON.stringify(images.url),
        });
    }

    const transaction_type_name = await TransactionType.findOne({
        _id: transaction_type_id,
    });

    const short_description = `Anh/Chị ${nameExist.first_name} ${nameExist.last_name}. SĐT: ${nameExist.phone}. ${transaction_type_name.name} ${address} Giá: ${price}, diện tích: ${area}`;

    try {
        const obj_description = await Description.findOneAndUpdate(
            { _id: description_id },
            {
                title_description,
                short_description,
                content_description,
                price,
                area: +area,
                bedroom,
                toilet,
            }
        );

        const real_home = await RealHome.findOneAndUpdate(
            { _id: real_home_id },
            {
                user_post: nameExist,
                address,
                images: obj_images,
                real_home_type_id,
                transaction_type_id,
                description: obj_description,
                price_id,
                area_id,
                province_id,
            }
        );

        real_home.save();

        if (real_home) {
            res.status(201).json({
                success: true,
                message: "Bạn đã cập nhật bất động sản thành công",
                data: real_home,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Cập nhật bất động sản không thành công!",
            });
        }
    } catch (error) {
        const errors = error.errors;
        let errMessage;
        const errObj = {};
        if (error.name === "ValidationError") {
            const keys = Object.keys(errors);
            keys.map((key) => {
                errObj[key] = errors[key].message;
            });
            errMessage = errObj;
        }
        return res.status(500).json({
            success: false,
            message: errMessage || "Lỗi server!",
        });
    }
});

export const putSold = async (req, res) => {
    const user_id = req.userId;
    const { real_home_id } = req.query;

    const typeRHs = await RealHome.findOneAndUpdate(
        { _id: real_home_id, "user_post._id": user_id },
        { sold: true }
    );
    if (typeRHs) {
        return res.status(200).json({
            success: true,
            message: "Cập nhật tin đã bán/thuê thành công.",
        });
    } else {
        return res
            .status(400)
            .json({ message: "Cập nhật tin đã bán/thuê thất bại!" });
    }
};

export const drop = async (req, res) => {
    const { _id, description_id, images_id } = req.body;
    try {
        const image = await Image.findById({ _id: images_id });
        if (image) {
            // Delete on cloudinary
            image.url.forEach(async (item) => {
                await cloudinary.uploader.destroy(item?.public_id);
            });
        }
        await Image.findOneAndDelete({ _id: images_id });
        await Description.findOneAndDelete({
            _id: description_id,
        });
        await RealHome.findOneAndDelete({ _id: _id });

        return res.status(200).json({
            success: true,
            message: "Bạn đã xóa bất động sản thành công!",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Xóa bất động sản không thành công!",
        });
    }
};

export const dropImgOnCloud = async (req, res) => {
    const { public_id } = req.body;
    try {
        if (public_id) {
            // Delete on cloudinary
            await cloudinary.uploader.destroy(public_id);
        }
        return res.status(200).json({
            success: true,
            message: "Bạn đã xóa ảnh trên cloud thành công!",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Xóa ảnh trên cloud không thành công!",
        });
    }
};
