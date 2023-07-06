const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const Role = require("../models/role");
// const promisify = require("util").promisify;
// const verify = promisify(jwt.verify).bind(jwt);
require("dotenv").config();

const verifyToken = (req, res, next) => {
    let token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res
            .status(403)
            .send({ success: false, message: "Không có token được cung cấp!" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .send({ success: false, message: "Không có quyền truy cập!" });
        }
        //so Date.now() > exp 3 số nên * 1000 để so sánh
        var date_now = Date.now();
        var exp = decoded.exp * 1000;
        if (date_now > exp) {
            return res
                .status(401)
                .send({ success: false, message: "Không có quyền truy cập!" });
        }
        req.expiresIn = exp;

        //decoded => id gán req.userId
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (user) {
        const roles = await Role.find({
            _id: { $in: user.roles },
        });
        if (!roles) {
            return res
                .status(500)
                .json({ success: false, message: "role trống" });
        }
        let count = 0;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                count++;
            }
        }
        if (count !== 0) {
            next();
        } else {
            return res
                .status(403)
                .json({ success: false, message: "Yêu cầu quyền Admin!" });
        }
    } else {
        return res
            .status(500)
            .json({ success: false, message: "Tài khoản không tồn tại" });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
};
module.exports = authJwt;
