const express = require("express");
const { getArea } = require("../controllers/areaController");

const areaRouter = express.Router();

areaRouter.get("/", getArea);

module.exports = areaRouter;
