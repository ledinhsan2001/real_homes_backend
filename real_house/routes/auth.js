const express = require("express");
const {
    loginController,
    registerController,
    refreshTokenController,
    changePass,
    sendOTP,
    verifyOTP,
    addAdminController,
    loginAdminController,
} = require("../controllers/authController");
const authJwt = require("../middlewares/authJWT");

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/login-admin", loginAdminController);
authRouter.post("/register", registerController);
authRouter.post(
    "/add-admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    addAdminController
);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.post("/change-passs", [authJwt.verifyToken], changePass);
authRouter.post("/reset-passs", sendOTP);
authRouter.post("/verify-otp", verifyOTP);

module.exports = authRouter;
