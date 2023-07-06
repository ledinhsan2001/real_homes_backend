const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const NewsTypeSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: [true, "Kiểu tin không được để trống"],
        },
        unit_price: {
            type: Number,
            required: [true, "Yêu cầu phải có giá."],
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);
const NewsType = mongoose.model("NewsType", NewsTypeSchema);
module.exports = {
    NewsTypeSchema,
    NewsType,
};
