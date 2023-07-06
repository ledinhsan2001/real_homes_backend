import blogRouter from "./blogRouter.js";
import blogTypeRouter from "./blogTypeRouter.js";
import paymentHistoryRouter from "./paymentHistoryRouter.js";
import paymentRouter from "./paymentRouter";
import provinceRouter from "./provinceRouter.js";
import savePostRouter from "./savePostRouter";

const authRouter = require("./auth");
const authJwt = require("../middlewares/authJWT");
const userRouter = require("./user");
const realHomeTypeRouter = require("./realHomeTypeRouter");
const transactionTypeRouter = require("./transactionTypeRouter");
const numberDayRouter = require("./numberDayRouter");
const newsTypeRouter = require("./newsTypeRouter");
const insertDataDb = require("./insertDataDb");
const priceRouter = require("./priceRouter");
const areaRouter = require("./areaRouter");
const realHomeRouter = require("./realHomeRouter");
const catchError = require("../middlewares/catchErr");

const initRoute = (app) => {
    app.use("/api/insert-data-db", insertDataDb);
    app.use("/api/get-price", priceRouter);
    app.use("/api/get-area", areaRouter);
    app.use("/api/get-province", provinceRouter);
    app.use("/api/user", userRouter);
    app.use("/api/auth", authRouter);

    app.use("/api/admin/transaction-type", transactionTypeRouter);
    app.use("/api/admin/real-home-type", realHomeTypeRouter);
    app.use("/api/admin/news-type", newsTypeRouter);
    app.use("/api/admin/number-day", numberDayRouter);

    app.use("/api/payment", paymentRouter);
    app.use("/api/payment-history", paymentHistoryRouter);
    app.use("/api/real-home", realHomeRouter);
    app.use("/api/save-post", savePostRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/blog-type", blogTypeRouter);

    app.use(catchError);

    return app.use("/", (req, res) => {
        console.log("server starting....");
    });
};

export default initRoute;
