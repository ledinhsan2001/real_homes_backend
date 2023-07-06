const mongoose = require("mongoose");
const { PaymentSchema } = require("./payment");

const Schema = mongoose.Schema;
const PaymentHistory = new Schema(
    {
        payment: PaymentSchema,
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);
module.exports = mongoose.model("PaymentHistory", PaymentHistory);
