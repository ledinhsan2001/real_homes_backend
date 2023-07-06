const express = require("express");
const authJwt = require("../middlewares/authJWT");
const {
    getAll,
    create,
    put,
    drop,
} = require("../controllers/blogTypeController");

const blogTypeRouter = express.Router();

blogTypeRouter.get("/all", getAll);
blogTypeRouter.post("/create", create);
blogTypeRouter.put("/put", put);
blogTypeRouter.delete("/drop", drop);

module.exports = blogTypeRouter;
