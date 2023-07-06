const express = require("express");
const {
    getDetail,
    getAll,
    create,
    put,
    drop,
} = require("../controllers/numberDayController");

const numberDayRouter = express.Router();
numberDayRouter.get("/", getAll);
numberDayRouter.get("/detail", getDetail);
numberDayRouter.post("/create", create);
numberDayRouter.put("/put", put);
numberDayRouter.delete("/delete", drop);

module.exports = numberDayRouter;
