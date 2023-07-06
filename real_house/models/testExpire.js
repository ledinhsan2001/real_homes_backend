const mongoose = require("mongoose");
const testChangeExpire = require("./testChangeExpire");
const Schema = mongoose.Schema;

const testExpire = new Schema({
    data: String,
    expireAt: {
        type: Date,
        expires: 0, // Expire immediately
        default: Date.now(),
    },
});

// testExpire.pre("remove", async (next) => {
//     // Perform desired action before document is removed
//     console.log(`Document with ID ${this._id} is about to be deleted`);
//     const _id = { _id: "649fe17c167cc2229d6af025" };

//     // Example: Update a field on the document
//     const expire = await testChangeExpire.findOneAndUpdate(_id, {
//         status: false,
//     });

//     if (expire) {
//         next();
//     } else {
//         return res.status(200).json({ success: false, message: "Looxi exx" });
//     }
// });

module.exports = mongoose.model("testExpire", testExpire);
