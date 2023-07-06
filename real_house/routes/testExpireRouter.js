const express = require("express");
const {
    createChange,
    createExpire,
    getExpireChange,
} = require("../controllers/testExpireController");

const testExpireRouter = express.Router();

testExpireRouter.get("/get", getExpireChange);
testExpireRouter.post("/create", createExpire);
testExpireRouter.post("/create-change", createChange);

module.exports = testExpireRouter;
