const mongoose = require("mongoose");
const { UserSchema } = require("./user");
const { NewsTypeSchema } = require("./newsType");
const { NumberDaySchema } = require("./numberDay");
const { RealHomeSchema } = require("./realHome");

const Schema = mongoose.Schema;
const PaymentSchema = new Schema(
    {
        user: UserSchema,
        news_type: NewsTypeSchema,
        number_day: NumberDaySchema,
        real_home: RealHomeSchema,
        total_price: {
            type: Number,
            default: 0,
        },
        start_date: {
            type: String,
            default: "",
        },
        expiration_date: {
            type: String,
            default: "",
        },
        expireAt: {
            type: Date,
            expires: 0, // Expire immediately
            default: Date.now(),
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = {
    PaymentSchema,
    Payment,
};
