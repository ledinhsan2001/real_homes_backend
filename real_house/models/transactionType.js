const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TransactionTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Phải nhập kiểu giao dịch."],
        },
        sub_header: {
            type: String,
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

const TransactionType = mongoose.model(
    "TransactionType",
    TransactionTypeSchema
);
module.exports = {
    TransactionTypeSchema,
    TransactionType,
};
