var bcrypt = require("bcryptjs");
import bancanho from "../data/banCanHo.json";
import tracsctiontypes from "../data/transactiontype.json";
import realhometypes1 from "../data/realhometype1.json";
import realhometypes2 from "../data/realhometype2.json";
import { Image } from "../models/image";
import realHome from "../models/realHome";
import price from "../models/price";
import area from "../models/area";
import { Description } from "../models/description";
import { TransactionType } from "../models/transactionType";
import realHomeType from "../models/realHomeType";
import { User } from "../models/user";
import { price_buysell, price_rental, area_data } from "../data/price";
import { FormatGetNummber } from "../utils/FormatGetNumber";

const Role = require("../models/role");
const mongoose = require("mongoose");

const data_body = bancanho.body;
const sub_header_realhomeType = bancanho.title;

const name_realhometype_MuaBan = realhometypes1.headerUrl;
const sub_header_transactionType_MuaBan = realhometypes1.titleHeader.title;

const name_realhometype_ChoThue = realhometypes2.headerUrl;
const sub_header_transactionType_ChoThue = realhometypes2.titleHeader.title;

export const insertDtDbController = async (req, res) => {
    try {
        // // insert province
        // province.forEach(async (item) => {
        //     await Province.create({
        //         _id: item.province_id,
        //         name: item.province_name,
        //     });
        // });

        // // insert simple area and price
        // price_buysell.forEach(async (item, index) => {
        //     await new price({
        //         _id: item._id,
        //         name: item.value,
        //         order: index,
        //     }).save();
        // });
        // price_rental.forEach(async (item, index) => {
        //     await new price({
        //         _id: item._id,
        //         name: item.value,
        //         order: index+10,
        //     }).save();
        // });

        // //transactionType1: mua ban
        // const tracsctiontype1 = await TransactionType.create({
        //     name: tracsctiontypes[0].category,
        //     sub_header: sub_header_transactionType_MuaBan
        // });
        // //realhometype
        // name_realhometype_MuaBan.forEach(async (item) => {
        //     await realHomeType.create({
        //         name: item.titleUrl,
        //         sub_header: sub_header_realhomeType,
        //         transaction_type: tracsctiontype1,
        //     });
        // });
        // //transactionType2: cho thue
        // const tracsctiontype2 = await TransactionType.create({
        //     name: tracsctiontypes[1].category,
        //     sub_header: sub_header_transactionType_ChoThue
        // });
        // //realhometype
        // name_realhometype_ChoThue.forEach(async (item) => {
        //     await realHomeType.create({
        //         name: item.titleUrl,
        //         sub_header: sub_header_realhomeType,
        //         transaction_type: tracsctiontype2,
        //     });
        // });

        //realhome
        data_body.forEach(async (item) => {
            const password = "123";
            const hash_password = bcrypt.hashSync(password, 8);
            const name = item.userPost.name.split(" ");
            if (!name) {
                name[0] = "";
                name[1] = "";
            }
            if (!name[0]) {
                name[0] = "";
            }
            if (!name[1]) {
                name[1] = "";
            }
            const role = await Role.findOne({ name: "user" });
            let phone = item.userPost.phone;
            if (!phone) {
                phone = "0326687333";
            }
            const user = await User.create({
                first_name: name[0],
                last_name: name[1],
                phone: phone,
                password: hash_password,
                link_zalo: item.userPost.zalo,
                roles: [role],
                refresh_token: "",
            });
            const images = await Image.create({
                url: JSON.stringify(item.images),
            });

            const description = await Description.create({
                title_description: item.header,
                short_description: item.sumaryPost.content,
                content_description: item.description.content,
                price: item.attributes[0].price,
                area: item.attributes[0].acreage,
                bedroom: item.attributes[0].bedroom,
                toilet: item.attributes[0].bathroom,
                published: item.attributes[0].published,
            });

            // Insert price and area
            // const price = await price.create({

            // })

            let price_id;
            let area_id;
            let checkUnit = item.attributes[0].price.split(" ");
            let price_number = FormatGetNummber(item?.attributes[0]?.price);
            let area_number = FormatGetNummber(item?.attributes[0]?.acreage);

            //price_number khác số là undefined: thỏa thuận
            // checkunit[1] khác số là undefined : giá không ghi triệu hay tỷ là cho dưới 1 tỷ
            //  checkUnit[1] có chữ mà khác 1 tỷ là cho dưới 1 tỷ
            !price_number || !checkUnit[1] || checkUnit[1] !== "tỷ"
                ? (price_id = "duoi_1ty")
                : (price_id = price_buysell.find(
                      (price) =>
                          price_number >= +price.min &&
                          price_number < +price.max
                  )._id);

            !area_number
                ? //area_number khác số là undefined: thỏa thuận
                  (area_id = "duoi_20m2")
                : (area_id = area_data.find(
                      (area) =>
                          area_number >= +area.min && area_number < +area.max
                  )._id);

            const real_home = await realHome.create({
                user_post: user,
                address: item.address,
                images: images,
                real_home_type_id: "645b56517cc26519dbcaad36",
                transaction_type_id: "645b56517cc26519dbcaad34",
                description: description,
                price_id: price_id,
                area_id: area_id,
            });

            real_home.save();
            return real_home;
        });
        console.log("Insert db successed!");
    } catch (error) {
        console.log(error);
    }
};
