const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testChangeExpire = new Schema({
    status: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model("testChangeExpire", testChangeExpire);
