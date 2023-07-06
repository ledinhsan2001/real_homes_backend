import Blog from "../models/blog";
import { User } from "../models/user";
const catchAsync = require("../middlewares/catchAsync");
require("dotenv").config();

export const getAll = async (req, res) => {
    try {
        const blogs = await Blog.find(
            { status: true },
            { title: 1, thumbnail_url: 1, createdAt: 1 }
        ).sort({
            createdAt: -1,
        });
        if (blogs.length > 0) {
            return res.status(200).json({
                success: true,
                data: blogs.slice(0, 10),
            });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Danh sách blog trống." });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Danh sách blog trống." });
    }
};
export const getAllLimit = async (req, res) => {
    const { page, blog_type_id } = req.query;

    let page_number = parseInt(page);
    let limit = process.env.LIMIT;
    let startIndex = page_number * limit;
    let lastIndex = (page_number + 1) * limit;
    const results = {};
    let blogs;
    try {
        if (blog_type_id) {
            blogs = await Blog.find({ blog_type_id, status: true }).sort({
                createdAt: -1,
            });
        } else {
            blogs = await Blog.find().sort({
                createdAt: -1,
            });
        }
        if (blogs.length > 0) {
            if (lastIndex >= blogs.length) {
                lastIndex = blogs.length;
            }
            results.data_blog_limit = blogs.slice(startIndex, lastIndex);
            results.total_blog = blogs.length;
            results.page_count_blog = Math.ceil(blogs.length / limit);
            return res.status(200).json({
                success: true,
                data: results,
            });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Danh sách blog trống." });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Danh sách blog trống." });
    }
};

export const getDetail = catchAsync(async (req, res) => {
    const { _id } = req.query;
    const blog = await Blog.findOne({ _id, status: true }, { __v: 0 });

    if (blog) {
        return res.status(200).json({ success: true, data: blog });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Blog không tồn tại." });
    }
});

export const create = async (req, res) => {
    const user_id = req.userId;
    const { title, content, thumbnail, blog_type_id } = req.body;
    try {
        const user = await User.findById({ _id: user_id });
        const blog = await Blog.create({
            user,
            title,
            content,
            thumbnail_url: thumbnail,
            blog_type_id,
        });

        if (blog) {
            return res
                .status(200)
                .json({ success: true, message: "Tạo Blog thành công." });
        } else {
            return res.status(400).json({
                success: false,
                message: "Tạo Blog không thành công!",
            });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, messsage: "Tạo Blog không thành công!" });
    }
};

export const put = async (req, res) => {
    const user_id = req.userId;
    const { _id } = req.params;
    const { title, content, thumbnail, blog_type_id } = req.body;

    try {
        const user = await User.findById({ _id: user_id });
        const blog = await Blog.findOneAndUpdate(
            {
                _id,
            },
            {
                user,
                title,
                content,
                thumbnail_url: thumbnail,
                blog_type_id,
            }
        );

        if (blog) {
            return res
                .status(200)
                .json({ success: true, message: "Cập nhật Blog thành công." });
        } else {
            return res.status(400).json({
                success: false,
                message: "Cập nhật  Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Cập nhật  Blog không thành công!",
        });
    }
};

export const putStatus = async (req, res) => {
    const { _id } = req.params;
    try {
        const blog = await Blog.findOneAndUpdate(
            {
                _id,
            },
            {
                status: false,
            }
        );

        if (blog) {
            return res.status(200).json({
                success: true,
                messsage: "Cập nhật status Blog thành công.",
            });
        } else {
            return res.status(400).json({
                success: false,
                messsage: "Cập nhật status Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            messsage: "Cập nhật status Blog không thành công!",
        });
    }
};
export const putStatusFalse = async (req, res) => {
    const { _id } = req.params;
    try {
        const blog = await Blog.findOneAndUpdate(
            {
                _id,
            },
            {
                status: false,
            }
        );

        if (blog) {
            return res.status(200).json({
                success: true,
                message: "Ẩn Blog thành công.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Ẩn Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Ẩn Blog không thành công!",
        });
    }
};
export const putStatusTrue = async (req, res) => {
    const { _id } = req.params;
    try {
        const blog = await Blog.findOneAndUpdate(
            {
                _id,
            },
            {
                status: true,
            }
        );

        if (blog) {
            return res.status(200).json({
                success: true,
                message: "Hiện Blog thành công.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Hiện Blog không thành công!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Hiện Blog không thành công!",
        });
    }
};
export const drop = async (req, res) => {
    const { _id } = req.query;
    try {
        const blog = await Blog.findByIdAndDelete({ _id });
        if (blog) {
            return res
                .status(200)
                .json({ success: true, messsage: "Xóa Blog thành công." });
        } else {
            return res.status(400).json({
                success: false,
                messsage: "Xóa Blog không thành công!",
            });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, messsage: "Xóa Blog không thành công!" });
    }
};
