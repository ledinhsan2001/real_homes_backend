const mongoose = require("mongoose");
const { Description, DescriptionSchema } = require("./description");
const { Image, ImageSchema } = require("./image");
const { User, UserSchema } = require("./user");

const Schema = mongoose.Schema;
const RealHomeSchema = new Schema(
    {
        user_post: UserSchema,
        address: {
            type: String,
            required: [true, "Phải có địa chỉ."],
        },
        sold: {
            type: Boolean,
            default: false,
        },
        start_date: {
            type: String,
            default: "",
        },
        images: ImageSchema,
        real_home_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RealHomeType",
        },
        transaction_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TransactionType",
        },
        description: DescriptionSchema,
        price_id: {
            type: mongoose.Schema.Types.String,
            ref: "Price",
        },
        area_id: {
            type: mongoose.Schema.Types.String,
            ref: "Area",
        },
        province_id: {
            type: mongoose.Schema.Types.Number,
            ref: "Province",
        },
        active: {
            type: Boolean,
            default: false,
        },
        news_type_id: {
            type: Number,
            ref: "NewsType",
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

const RealHome = mongoose.model("RealHome", RealHomeSchema);
module.exports = {
    RealHomeSchema,
    RealHome,
};
