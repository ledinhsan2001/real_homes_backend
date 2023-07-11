const mongoose = require("mongoose");
const { TransactionTypeSchema } = require("./transactionType");

const Schema = mongoose.Schema;
const RealHomeType = new Schema(
    {
        name: {
            type: String,
            required: [true, "Phải nhập kiểu bất động sản."],
        },
        transaction_type: TransactionTypeSchema,
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

module.exports = mongoose.model("RealHomeType", RealHomeType);
