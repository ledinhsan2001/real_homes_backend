const express = require("express");
import { insertDtDbController } from "../controllers/insertDtDbController";

const insertRouter = express.Router();

insertRouter.post("/", insertDtDbController);

module.exports = insertRouter;
