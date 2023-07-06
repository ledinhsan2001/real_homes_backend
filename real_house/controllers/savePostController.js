const SavePost = require("../models/SavePost");
const { RealHome } = require("../models/realHome");

const get = async (req, res) => {
    const id = req.userId;
    try {
        const saved_post = await SavePost.find({ user_id: id }).sort({
            createdAt: -1,
        });

        if (saved_post.length > 0) {
            return res.status(200).json({
                success: true,
                data: saved_post,
                total_post: saved_post.length,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Không có bài đăng nào được lưu.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Không có bài đăng nào được lưu.",
        });
    }
};

const getAllLimit = async (req, res) => {
    const id = req.userId;
    const { page } = req.query;
    try {
        let page_number = parseInt(page);
        let limit = process.env.LIMIT;
        let startIndex = page_number * limit;
        let lastIndex = (page_number + 1) * limit;
        const results = {};
        const saved_post = await SavePost.find({ user_id: id }).sort({
            createdAt: -1,
        });
        if (saved_post.length > 0) {
            if (lastIndex >= saved_post.length) {
                lastIndex = saved_post.length;
            }
            results.limit_save_post = saved_post.slice(startIndex, lastIndex);
            results.total_all_save_post = saved_post.length;
            results.page_count_save_post = Math.ceil(saved_post.length / limit);
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

const create = async (req, res) => {
    const { real_home_id } = req.body;
    const id = req.userId;
    try {
        let real_home = await RealHome.findOne({ _id: real_home_id });
        if (real_home) {
            let saved_post = await SavePost.create({
                user_id: id,
                real_home,
            });
            saved_post.save();
            return res.status(201).json({
                success: true,
                message: `Lưu tin.`,
            });
        } else {
            return res
                .status(200)
                .json({ success: false, message: "Không tìm thấy bài đăng!" });
        }
    } catch (error) {
        return res
            .status(200)
            .json({ success: false, message: "Lưu tin không thành công!" });
    }
};

const drop = async (req, res) => {
    const { real_home_id } = req.query;
    const id = req.userId;
    try {
        await SavePost.findOneAndDelete({
            user_id: id,
            "real_home._id": real_home_id,
        });
        return res.status(201).json({
            success: true,
            message: "Xóa lưu tin.",
        });
    } catch (error) {
        return res
            .status(200)
            .json({ success: false, message: "Xóa lưu tin không thành công!" });
    }
};

const savePostController = {
    getAllLimit,
    get,
    create,
    drop,
};
module.exports = savePostController;
