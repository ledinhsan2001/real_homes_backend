const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        phone: {
            type: String,
            required: [true, "Phải có số điện thoại."],
        },
        password: { type: String },
        avt: {
            type: String,
            default: "",
        },
        address: { type: String, default: "" },
        link_zalo: { type: String, default: "" },
        email: { type: String, default: "" },
        refresh_token: String,
        roles: [
            {
                type: mongoose.Schema.Types.Number,
                ref: "Role",
            },
        ],
        OTP: {
            type: String,
            default: "",
        },
        active: {
            type: String,
            default: false,
        },
    },
    {
        //auto createdAt, updatedAt
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = {
    UserSchema,
    User,
};
