const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const NumberDaySchema = new Schema(
    {
        _id: Number,
        number_day: {
            type: Number,
            required: [true, "Số ngày không được trống!"],
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);
const NumberDay = mongoose.model("NumberDay", NumberDaySchema);
module.exports = {
    NumberDaySchema,
    NumberDay,
};
