const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const DescriptionSchema = new Schema(
    {
        title_description: {
            type: String,
            minLength: [10, "Ít nhất phải 10 kí tự."],
            maxLength: [200, "Dài nhất phải 200 kí tự."],
            required: [true, "Phải nhập tiêu đề mô tả."],
        },
        short_description: {
            type: String,
            maxLength: [1000, "Dài nhất 1000 kí tự."],
            required: [true, "Phải tóm tắt nội dung."],
        },
        content_description: {
            type: String,
            minLength: [50, "Ít nhất phải 10 kí tự."],
            maxLength: [10000, "Dài nhất 1000 kí tự."],
            required: [true, "Phải nhập nội dung mô tả."],
        },
        price: {
            type: String,
            default: "",
        },
        area: {
            type: Number,
            default: 0,
            required: [true, "Phải nhập diện tích."],
        },
        bedroom: {
            type: Number,
            default: 0,
        },
        toilet: {
            type: Number,
            default: 0,
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

const Description = mongoose.model("Description", DescriptionSchema);
module.exports = { DescriptionSchema, Description };
