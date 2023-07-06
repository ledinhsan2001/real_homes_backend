const express = require("express");
const {
    getUser,
    putUser,
    getUserPublic,
    getAllUser,
    getAllUserLimit,
    drop,
} = require("../controllers/userController");
import authJwt from "../middlewares/authJWT";

const userRouter = express.Router();
// isAdmin
userRouter.get("/get-all-limit", getAllUserLimit);
userRouter.get("/get-all", getAllUser);
userRouter.get("/detail-public", getUserPublic);
userRouter.get("/detail", [authJwt.verifyToken], getUser);
userRouter.put("/put", [authJwt.verifyToken], putUser);
userRouter.delete("/drop", [authJwt.verifyToken, authJwt.isAdmin], drop);

module.exports = userRouter;
