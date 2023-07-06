const express = require("express");
const { getProvince } = require("../controllers/provinceController");

const provinceRouter = express.Router();

provinceRouter.get("/", getProvince);

module.exports = provinceRouter;
