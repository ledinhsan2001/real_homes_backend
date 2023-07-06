const express = require("express");
const {
    getAll,
    getDetail,
    create,
    put,
    drop,
} = require("../controllers/newsTypeController");

const newsTypeRouter = express.Router();
newsTypeRouter.get("/", getAll);
// newsTypeRouter.get("/detail", getDetail);
// newsTypeRouter.post("/create", create);
// newsTypeRouter.put("/put/", put);
// newsTypeRouter.delete("/delete", drop);

module.exports = newsTypeRouter;
