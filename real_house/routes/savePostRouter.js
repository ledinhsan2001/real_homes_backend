const express = require("express");
const {
    get,
    create,
    drop,
    getAllLimit,
} = require("../controllers/savePostController");
const authJwt = require("../middlewares/authJWT");

const savePostRouter = express.Router();

savePostRouter.get("/", [authJwt.verifyToken], get);
savePostRouter.get("/all-limit", [authJwt.verifyToken], getAllLimit);
savePostRouter.post("/create", [authJwt.verifyToken], create);
savePostRouter.delete("/delete", [authJwt.verifyToken], drop);

module.exports = savePostRouter;
