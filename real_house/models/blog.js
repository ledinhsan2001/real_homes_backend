const mongoose = require("mongoose");
const { UserSchema } = require("./user");

const Schema = mongoose.Schema;
const Blog = new Schema(
    {
        user: UserSchema,
        title: {
            type: String,
            required: [true, "Giá trị không được trống!"],
        },
        content: {
            type: String,
            required: [true, "Giá trị không được trống!"],
            default: "",
        },
        status: {
            type: Boolean,
            default: true,
        },
        thumbnail_url: {
            type: String,
        },
        blog_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BlogType",
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);
module.exports = mongoose.model("Blog", Blog);
