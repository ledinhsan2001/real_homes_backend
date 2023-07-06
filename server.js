const express = require("express");
const cors = require("cors");
const db = require("./real_house/config/connectDB");
require("dotenv").config();
import initRoute from "./real_house/routes";
import "moment/locale/vi";
const app = express();
db.connect();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded ==> đọc được body khi client gửi lên
app.use(express.urlencoded({ extended: true }));

initRoute(app);

// catch error từ các đường dẫn trên

// set port, listen for requests
const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
