const Province = require("../models/province");
require("dotenv").config();

export const getProvince = async (req, res) => {
    try {
        const provinces = await Province.find({}, { __v: 0 });

        if (provinces.length > 0) {
            res.status(200).json({ success: true, data: provinces });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Danh sách tỉnh trống." });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Danh sách tỉnh trống." });
    }
};
