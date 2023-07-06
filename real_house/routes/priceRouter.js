const express = require("express");
const { getPrice } = require("../controllers/priceController");

const priceRouter = express.Router();

priceRouter.get("/", getPrice);

module.exports = priceRouter;
