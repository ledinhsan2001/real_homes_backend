const express = require("express");
const authJwt = require("../middlewares/authJWT");
const paymentHistoryRouter = express.Router();
const {
    getAll,
    getAllLimit,
    getLimitByUser,
} = require("../controllers/paymentHistoryController");

paymentHistoryRouter.get("/getAll", getAll);
paymentHistoryRouter.get(
    "/getAllLimit",
    [authJwt.verifyToken, authJwt.isAdmin],
    getAllLimit
);
paymentHistoryRouter.get(
    "/get-limit-by-user",
    [authJwt.verifyToken],
    getLimitByUser
);

module.exports = paymentHistoryRouter;
