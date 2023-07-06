import testChangeExpire from "../models/testChangeExpire";
import testExpire from "../models/testExpire";
require("dotenv").config();

export const getExpireChange = async (req, res) => {
    try {
        const _id = { _id: "649fe17c167cc2229d6af025" };

        const expire = await testChangeExpire.findOneAndUpdate(_id, {
            status: false,
        });

        if (expire) {
            return res.status(200).json({ success: true, data: expire });
        } else {
            return res
                .status(200)
                .json({ success: false, message: "add không thành công" });
        }
    } catch (error) {
        console.log(error);
    }
};

export const createExpire = async (req, res) => {
    try {
        const expireAt = new Date();
        expireAt.setSeconds(expireAt.getSeconds() + 5); // Set expiry after 30 minutes

        const expire = await testExpire.create({
            data: "Some data",
            expireAt: expireAt,
        });

        const deleteTime = expireAt;
        // const deleteTime = new Date(Date.now() + 1 * 60 * 1000);
        setTimeout(async () => {
            // Delete the document from the first collection (automatically by the `expireAt` index)
            // No explicit delete operation needed here, the document will be automatically deleted

            // Update the field in the second collection
            const _id = { _id: "649fe17c167cc2229d6af025" };
            const expire_update = await testChangeExpire.findOneAndUpdate(_id, {
                status: false,
            });
            if (expire_update) {
                console.log("Field updated in the second collection");
            } else {
                console.error("Error updating field:", error);
            }
        }, deleteTime - Date.now());

        if (expire) {
            return res.status(200).json({ success: true, data: expire });
        } else {
            return res
                .status(200)
                .json({ success: false, message: "add không thành công" });
        }
    } catch (error) {
        console.log(error);
    }
};

export const createChange = async (req, res) => {
    const changeExpireExpire = await testChangeExpire.create({
        status: true,
    });

    if (changeExpireExpire) {
        return res
            .status(200)
            .json({ success: true, data: changeExpireExpire });
    } else {
        return res
            .status(200)
            .json({ success: false, message: "add không thành công" });
    }
};
