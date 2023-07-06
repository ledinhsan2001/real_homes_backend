const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const BlogType = new Schema({
    name: {
        type: String,
        required: [true, "Giá trị không được trống!"],
    },
});
module.exports = mongoose.model("BlogType", BlogType);
