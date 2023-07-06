const express = require("express");
const {
    getAllByUser,
    getAllLimit,
    getAll,
    getDetail,
    create,
    put,
    drop,
    getNewPost,
    getAllByUserPublic,
    getAllByUserUnPayment,
    dropImgOnCloud,
    putSold,
} = require("../controllers/realHomeController");
const { verifyToken } = require("../middlewares/authJWT");

const realHomeRouter = express.Router();
realHomeRouter.get("/", getAll);
realHomeRouter.get("/limit", getAllLimit);
realHomeRouter.get("/all-public", getAllByUserPublic);
realHomeRouter.get("/all-by-user", [verifyToken], getAllByUser);
realHomeRouter.get(
    "/all-by-user-unpayment",
    [verifyToken],
    getAllByUserUnPayment
);
realHomeRouter.get("/new-post", getNewPost);
realHomeRouter.get("/detail", getDetail);
realHomeRouter.post("/create", [verifyToken], create);
realHomeRouter.put("/put", [verifyToken], put);
realHomeRouter.put("/put-sold", [verifyToken], putSold);
realHomeRouter.delete("/delete", [verifyToken], drop);
realHomeRouter.post("/delete-image", [verifyToken], dropImgOnCloud);

module.exports = realHomeRouter;
