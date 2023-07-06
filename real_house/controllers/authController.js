const { User } = require("../models/user");
const Role = require("../models/role");
var bcrypt = require("bcryptjs");
const Token = require("../token/gendecToken");
const randToken = require("rand-token");
const catchAsync = require("../middlewares/catchAsync");
require("dotenv").config();

const loginController = async (req, res) => {
    const { phone1, password } = req.body;
    const user = await User.findOne({ phone: phone1 });
    // case Registered but have not verify phone (active===false).
    if (user && user.active !== false) {
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (passwordIsValid) {
            // tao token với thông tin là id
            const dataForAccessToken = {
                id: user._id,
            };
            const accessToken = await Token.generateToken(
                dataForAccessToken,
                process.env.SECRET_KEY,
                process.env.EXPIRES_IN
            );

            if (!accessToken) {
                return res.status(401).send({
                    success: false,
                    message: "Đăng nhập không thành công, vui lòng thử lại.",
                });
            }

            const refreshToken = randToken.generate(50); // tạo 1 refresh token ngẫu nhiên
            if (!refreshToken) {
                return res.status(401).send({
                    success: false,
                    message: "Đăng nhập không thành công, vui lòng thử lại.",
                });
            }

            // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            const update_ref_token = await Token.updateRefreshToken(
                user.phone,
                refreshToken
            );
            if (update_ref_token) {
                const roleId = user.roles[0];
                const nameRole = await Role.findById({ _id: roleId });
                return res.status(200).json({
                    success: true,
                    message: "Đăng nhập thành công.",
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    roles: ["ROLE_" + nameRole.name.toUpperCase()],
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            } else {
                return res.status(400).json({
                    accessToken: null,
                    success: false,
                    message: "Cập nhật refresh token lỗi!",
                });
            }
        } else {
            return res.status(400).json({
                accessToken: null,
                success: false,
                message: "Mật khẩu không đúng!",
            });
        }
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Tài khoản không tồn tại." });
    }
};

const loginAdminController = async (req, res) => {
    const { phone1, password } = req.body;
    const user = await User.findOne({ phone: phone1 });
    // case Registered but have not verify phone (active===false).
    if (user && user.active !== false) {
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (passwordIsValid) {
            if (user.roles.includes(1)) {
                // tao token với thông tin là id
                const dataForAccessToken = {
                    id: user._id,
                };
                const accessToken = await Token.generateToken(
                    dataForAccessToken,
                    process.env.SECRET_KEY,
                    process.env.EXPIRES_IN
                );

                if (!accessToken) {
                    return res.status(401).send({
                        success: false,
                        message:
                            "Đăng nhập không thành công, vui lòng thử lại.",
                    });
                }

                const refreshToken = randToken.generate(50); // tạo 1 refresh token ngẫu nhiên
                if (!refreshToken) {
                    return res.status(401).send({
                        success: false,
                        message:
                            "Đăng nhập không thành công, vui lòng thử lại.",
                    });
                }

                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                const update_ref_token = await Token.updateRefreshToken(
                    user.phone,
                    refreshToken
                );
                if (update_ref_token) {
                    // const roleId = user.roles[0];
                    // const nameRole = await Role.findById({ _id: roleId });
                    return res.status(200).json({
                        success: true,
                        message: "Đăng nhập thành công.",
                        // id: user._id,
                        // first_name: user.first_name,
                        // last_name: user.last_name,
                        // phone: user.phone,
                        // roles: ["ROLE_" + nameRole.name.toUpperCase()],
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                } else {
                    return res.status(400).json({
                        accessToken: null,
                        success: false,
                        message: "Cập nhật refresh token lỗi!",
                    });
                }
            } else {
                return res.status(401).json({
                    accessToken: null,
                    success: false,
                    message: "Bạn không có quyền truy cập!",
                });
            }
        } else {
            return res.status(400).json({
                accessToken: null,
                success: false,
                message: "Mật khẩu không đúng!",
            });
        }
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Tài khoản không tồn tại." });
    }
};

const registerController = catchAsync(async (req, res) => {
    const { first_name, last_name, phone, password, repassword } = req.body;
    const exist_phone = await User.findOne({ phone: phone });
    if (password !== repassword) {
        return res
            .status(400)
            .json({ success: false, message: "Mật khẩu nhập lại không khớp!" });
    }
    // if (!exist_phone) {
    const user = new User({
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        password: bcrypt.hashSync(password, 8),
    });
    const role = await Role.findOne({ name: "user" });
    if (role) {
        user.roles = [role];
    }
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require("twilio")(accountSid, authToken);

        let OTP = "";
        for (let i = 0; i < 4; i++) {
            OTP += Math.floor(Math.random() * 10);
        }

        //    send OTP
        await client.messages.create({
            body: `Mã OTP của bạn là: ${OTP}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+84${phone}`,
        });

        // save otp in db
        user.OTP = OTP;
        await user.save();

        return res.status(201).json({
            success: true,
            message: `Mã OTP đã gửi đến: (+84) ${phone}`,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Gửi mã OTP thất bại. Vui lòng thử lại!",
        });
    }
    // } else {
    //     return res
    //         .status(400)
    //         .json({ success: false, message: "Tài khoản này đã tồn tại!" });
    // }
});

const addAdminController = catchAsync(async (req, res) => {
    const { password, avt, email_admin, first_name, last_name, phone_admin } =
        req.body;
    try {
        const user = new User({
            first_name: first_name,
            last_name: last_name,
            phone: phone_admin,
            email: email_admin,
            avt: avt,
            active: true,
            password: bcrypt.hashSync(password, 8),
        });
        const ar_role = await Role.find({ name: { $in: ["user", "admin"] } });
        if (ar_role) {
            let roles = [];
            ar_role.forEach((item) => roles.push(item._id));
            user.roles = roles;
        }
        await user.save();

        return res.status(201).json({
            success: true,
            message: `Tạo admin thành công.`,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Tạo admin không thành công!",
        });
    }
});

const refreshTokenController = async (req, res) => {
    // Lấy access token từ header

    // let token = req.headers["x-access-token"];// or
    const accessTokenFromHeader = req.headers.authorization.split(" ")[1];
    // const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
        return res.status(400).json({ error: "Không tìm thấy access token." });
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return res.status(400).json({ error: "Không tìm thấy refresh token." });
    }

    // Decode access token đó
    const decoded = await Token.decodeToken(
        accessTokenFromHeader,
        process.env.SECRET_KEY
    );
    if (!decoded) {
        return res.status(400).json({ error: "Access token không hợp lệ." });
    }

    const id = decoded.payload.id; // Lấy username từ payload

    const user = await User.findById({ _id: id });
    if (!user) {
        return res.status(401).json({ error: "User không tồn tại." });
    }

    if (refreshTokenFromBody !== user.refresh_token) {
        return res.status(400).json({ error: "Refresh token không hợp lệ." });
    }

    // Tạo access token mới
    const dataForAccessToken = {
        id: user._id,
    };

    const accessToken = await Token.generateToken(
        dataForAccessToken,
        process.env.SECRET_KEY,
        process.env.EXPIRES_IN
    );
    if (!accessToken) {
        return res.status(400).json({
            error: "Tạo access token không thành công, vui lòng thử lại.",
        });
    }
    return res.json({
        accessToken: accessToken,
    });
};

const changePass = async (req, res) => {
    const id = req.userId;
    const { oldPass, newPass, rePass } = req.body;
    const user_exist = await User.findById({ _id: id });
    if (user_exist) {
        const ispass = bcrypt.compareSync(oldPass, user_exist.password);
        if (ispass) {
            if (newPass === rePass) {
                const user = await User.findOneAndUpdate(
                    { _id: id },
                    { password: bcrypt.hashSync(newPass, 8) }
                );
                if (user) {
                    return res.status(200).json({
                        success: true,
                        message: "Bạn đã cập nhật mật khẩu thành công.",
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Cập nhật mật khẩu không thành công.",
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Mật khẩu nhập lại không khớp!",
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không chính xác!",
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Không tìm thấy tài khoản.",
        });
    }
};

//case forgot password
const sendOTP = async (req, res) => {
    const { phone } = req.body;
    const exist_phone = await User.findOne({ phone: phone });
    if (exist_phone) {
        try {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const client = require("twilio")(accountSid, authToken);
            let OTP = "";
            for (let i = 0; i < 4; i++) {
                OTP += Math.floor(Math.random() * 10);
            }

            //    send OTP
            await client.messages.create({
                body: `Mã OTP của bạn là: ${OTP}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+84${phone}`,
            });
            const update = await User.findOneAndUpdate(
                { phone: phone },
                { OTP: OTP }
            );
            if (update) {
                return res.status(201).send({
                    success: true,
                    message: `Mã OTP đã gửi đến: (+84) ${phone}`,
                });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: "Cập nhật OTP thất bại" });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Gửi mã OTP thất bại. Vui lòng thử lại!",
            });
        }
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Số điện thoại không tồn tại" });
    }
};

// Case created account but have not verify then can forgot password to verify
// verify register OTP
const verifyOTP = async (req, res) => {
    const { phone, OTP, newpassword } = req.body;
    const exist_phone = await User.findOne({ phone: phone });
    if (exist_phone) {
        if (exist_phone.OTP === OTP) {
            let clausewhere = {};
            clausewhere["OTP"] = "";
            if (newpassword) {
                clausewhere["password"] = bcrypt.hashSync(newpassword, 8);
            }
            const update = await User.findOneAndUpdate(
                { phone: phone },
                clausewhere
            );
            if (update) {
                return res.status(200).json({
                    success: true,
                    message: newpassword
                        ? `Mã OTP chính xác. Bạn đã đổi mật khẩu thành công.`
                        : `Mã OTP chính xác. Bạn đã tạo tài khoản thành công!`,
                });
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: "Cập nhật OTP thất bại" });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Mã OTP chưa chính xác. Vui lòng thử lại!",
            });
        }
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Số điện thoại không tồn tại" });
    }
};

const authController = {
    loginController,
    loginAdminController,
    registerController,
    addAdminController,
    refreshTokenController,
    changePass,
    sendOTP,
    verifyOTP,
};
module.exports = authController;
