const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Area = new Schema(
    {
        _id: String,
        name: {
            type: String,
            required: [true, "Giá trị không được trống!"],
        },
        order: {
            type: Number,
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);
module.exports = mongoose.model("Area", Area);
