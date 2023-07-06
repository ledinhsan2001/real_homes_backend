const express = require("express");
const { create, get } = require("../controllers/paymentController");
const authJwt = require("../middlewares/authJWT");

const paymentRouter = express.Router();

paymentRouter.get("/get", [authJwt.verifyToken], get);
paymentRouter.post("/create", [authJwt.verifyToken], create);

module.exports = paymentRouter;
