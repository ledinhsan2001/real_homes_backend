const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const Role = new Schema(
    {
        _id: Number,
        name: String,
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

module.exports = mongoose.model("Role", Role);
