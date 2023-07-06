const PaymentHistory = require("../models/paymentHistory");

const getAll = async (req, res) => {
    try {
        const payment_history = await PaymentHistory.find();
        if (payment_history.length > 0) {
            return res.status(200).json({
                success: true,
                data_pay_his: payment_history,
                total_payment_his: payment_history.length,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Chưa có bài nào được thanh toán!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Chưa có bài nào được thanh toán!",
        });
    }
};

const getLimitByUser = async (req, res) => {
    const id = req.userId;
    const { page, news_type_id } = req.query;
    try {
        let page_number = parseInt(page);
        let limit = process.env.LIMIT;
        let startIndex = page_number * limit;
        let lastIndex = (page_number + 1) * limit;
        const results = {};

        let clause_where = {};
        clause_where["payment.user._id"] = id;

        if (news_type_id) {
            if (+news_type_id === 3) {
                clause_where["payment.news_type._id"] = 0;
            } else {
                clause_where["payment.news_type._id"] = +news_type_id;
            }
        }
        const payment_history = await PaymentHistory.find(clause_where).sort({
            createdAt: -1,
        });

        if (payment_history.length > 0) {
            if (lastIndex >= payment_history.length) {
                lastIndex = payment_history.length;
            }
            results.limit_history_pay = payment_history.slice(
                startIndex,
                lastIndex
            );
            results.total_all_history_pay = payment_history.length;
            results.page_count_history_pay = Math.ceil(
                payment_history.length / limit
            );
            return res.status(200).json({
                success: true,
                data: results,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Chưa có bài nào được thanh toán!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Chưa có bài nào được thanh toán!",
        });
    }
};

const getAllLimit = async (req, res) => {
    const { page } = req.query;
    let page_number = parseInt(page);
    let limit = process.env.LIMIT;
    let startIndex = page_number * limit;
    let lastIndex = (page_number + 1) * limit;
    const results = {};
    try {
        const payment_history = await PaymentHistory.find().sort({
            createdAt: -1,
        });
        if (payment_history.length > 0) {
            if (lastIndex >= payment_history.length) {
                lastIndex = payment_history.length;
            }
            results.limit_data_pay_his = payment_history.slice(
                startIndex,
                lastIndex
            );
            results.total_all_pay_his = payment_history.length;
            results.page_count_pay_his = Math.ceil(
                payment_history.length / limit
            );
            return res.status(200).json({
                success: true,
                data: results,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Chưa có bài nào được thanh toán!",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Chưa có bài nào được thanh toán!",
        });
    }
};

const paymentHistoryController = {
    getAll,
    getLimitByUser,
    getAllLimit,
};
module.exports = paymentHistoryController;
