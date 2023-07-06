const express = require("express");
const {
    getAllTypeRHByTransType,
    getDetailRHT,
    getAllRHT,
    addRealHomeType,
    putRealHomeType,
    deleteRealHomeType,
} = require("../controllers/realHomeTypeController");
const { isAdmin } = require("../middlewares/authJWT");

const realHomeTypeRouter = express.Router();

realHomeTypeRouter.get("/", getAllRHT);
realHomeTypeRouter.get("/detail", getDetailRHT);
realHomeTypeRouter.get(
    "/list-re-type-by-trans-type/:transaction_type_id",
    getAllTypeRHByTransType
);
realHomeTypeRouter.post("/add", addRealHomeType);
realHomeTypeRouter.put("/put/:id", putRealHomeType);
realHomeTypeRouter.delete("/delete/:id", deleteRealHomeType);

module.exports = realHomeTypeRouter;
