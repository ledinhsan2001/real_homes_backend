import BlogType from "../models/blogType";
require("dotenv").config();

export const getAll = async (req, res) => {
    try {
        const blog_types = await BlogType.find({}, { __v: 0 });
        if (blog_types.length > 0) {
            return res.status(200).json({
                success: true,
                data: blog_types,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Danh sách kiểu blog trống.",
            });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Danh sách kiểu blog trống." });
    }
};

export const create = async (req, res) => {
    const { name } = req.body;
    try {
        const blog_type = await BlogType.create({
            name,
        });

        if (blog_type) {
            return res
                .status(200)
                .json({ success: true, message: "Tạo kiểu Blog thành công." });
        } else {
            return res.status(400).json({
                success: false,
                message: "Tạo kiểu Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            messsage: "Tạo kiểu Blog không thành công!",
        });
    }
};

export const put = async (req, res) => {
    const { _id } = req.query;
    const { name } = req.body;
    try {
        const blog = await BlogType.findOneAndUpdate(
            {
                _id,
            },
            {
                name,
            }
        );

        if (blog) {
            return res.status(200).json({
                success: true,
                messsage: "Cập nhật kiểu Blog thành công.",
            });
        } else {
            return res.status(400).json({
                success: false,
                messsage: "Cập nhật kiểu Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            messsage: "Cập nhật kiểu Blog không thành công!",
        });
    }
};

export const drop = async (req, res) => {
    const { _id } = req.query;
    try {
        const blog = await BlogType.findByIdAndDelete({ _id });
        if (blog) {
            return res
                .status(200)
                .json({ success: true, messsage: "Xóa kiểu Blog thành công." });
        } else {
            return res.status(400).json({
                success: false,
                messsage: "Xóa kiểu Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            messsage: "Xóa kiểu Blog không thành công!",
        });
    }
};
