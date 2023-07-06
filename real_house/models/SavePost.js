const mongoose = require("mongoose");
const { RealHomeSchema } = require("./realHome");
const { User } = require("./user");

const Schema = mongoose.Schema;

const SavePost = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        real_home: RealHomeSchema,
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

module.exports = mongoose.model("SavePost", SavePost);
