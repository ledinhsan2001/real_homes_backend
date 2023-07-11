var bcrypt = require("bcryptjs");
import tracsctiontypes from "../data/transactiontype.json";
import realhometypes1 from "../data/realhometype1.json";
import realhometypes2 from "../data/realhometype2.json";
import { Image } from "../models/image";
import { RealHome } from "../models/realHome";
import price from "../models/price";
import area from "../models/area";
import Province from "../models/province";
import { NewsType } from "../models/newsType";
import { provincedata } from "../data/province";
import { Description } from "../models/description";
import { TransactionType } from "../models/transactionType";
import realHomeType from "../models/realHomeType";
import { User } from "../models/user";
import { price_buysell, price_rental, area_data } from "../data/price";
import { FormatGetNummber } from "../utils/FormatGetNumber";
import {
    banCanHo,
    banBietThu,
    banCuaHang,
    banDat,
    banDatNenDuAn,
    banKhachSan,
    banKhoXuong,
    banMatTien,
    banNhaRieng,
    banNhaTro,
} from "../data/dataJsonBuySell";
import {
    choThueCanHo,
    choThueDat,
    choThueKhachSan,
    choThueKhoXuong,
    choThueMatBang,
    choThueNguyenCan,
    choThueNhaMatTien,
    choThuePhongTro,
    choThueVanPhong,
    oGhep,
} from "../data/dataJsonRental";
import { Payment } from "../models/payment";
import { NumberDay } from "../models/numberDay";
import paymentHistory from "../models/paymentHistory";
import { FormatDate } from "../utils/FormatDate";

const Role = require("../models/role");

const data_body =
    // banCanHo.body;
    // banBietThu.body;
    // banCuaHang.body;
    // banDat.body;
    // banDatNenDuAn.body;
    // banKhachSan.body;
    // banKhoXuong.body;
    // banMatTien.body;
    // banNhaRieng.body;
    // banNhaTro.body;

    // choThueCanHo.body;
    // choThueDat.body;
    // choThueKhachSan.body;
    // choThueKhoXuong.body;
    // choThueMatBang.body;
    // choThueNguyenCan.body;
    // choThueNhaMatTien.body;
    // choThuePhongTro.body;
    // choThueVanPhong.body;
    oGhep.body;

// const name_realhometype_MuaBan = realhometypes1.headerUrl;
// const sub_header_transactionType_MuaBan = realhometypes1.titleHeader.title;

// const name_realhometype_ChoThue = realhometypes2.headerUrl;
// const sub_header_transactionType_ChoThue = realhometypes2.titleHeader.title;

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

        //real_homes_type
        // random new_type
        const arr = [5, 10, 15, 30];
        data_body.forEach(async (item) => {
            if (!item) return;
            // const password = "123";
            // const hash_password = bcrypt.hashSync(password, 8);
            // const name = item.userPost?.infor?.name?.split(" ") || [];
            // if (!name) {
            //     name[0] = "Lê";
            //     name[1] = "A" + Math.floor(Math.random() * 10);
            // } else {
            //     if (!name[0]) {
            //         name[0] = "Lê";
            //     }
            //     if (!name[1]) {
            //         name[1] = "A" + Math.floor(Math.random() * 10);
            //     }
            // }
            // const role = await Role.findOne({ name: "user" });
            let phone = item.userPost?.infor?.phone;
            // if (!phone) {
            //     phone = "";
            //     for (let i = 0; i < 10; i++) {
            //         phone += Math.floor(Math.random() * 10);
            //     }
            // }
            // let avt = item.userPost?.infor?.avt;
            // let address;
            // let email;
            // const inforExtra = item.userPost?.extraInfor;
            // inforExtra.map((i) => {
            //     if (i.name === "Địa chỉ:") {
            //         address = i.value;
            //     }
            //     if (i.name === "Email:") {
            //         email = i.value;
            //     }
            // });

            let user;
            const exist_phone = await User.findOne({ phone: phone });
            // if (!exist_phone) {
            //     user = await User.create({
            //         first_name: name[0],
            //         last_name: name[1],
            //         phone: phone,
            //         password: hash_password,
            //         avt,
            //         address,
            //         link_zalo: item.userPost.infor?.zalo,
            //         email,
            //         roles: [role],
            //         refresh_token: "",
            //         active: true,
            //     });
            // } else {
            user = exist_phone;
            // }

            let obj_urls = {};
            let urls = [];
            item.images.map((i) => {
                (obj_urls["url"] = i), (obj_urls["public_id"] = "");
                urls.push(obj_urls);
            });
            const images = await Image.create({
                url: JSON.stringify(urls),
            });

            const description = await Description.create({
                title_description: item.header,
                short_description:
                    item?.sumaryPost?.content ||
                    "Anh/chị muốn biết thông tin chi tiết vui lòng liên hệ cho tôi qua số: 0326687233",
                content_description: item.description.content,
                price: item.attributes[0].price,
                area: item.attributes[0].acreage,
                bedroom: item.attributes[0]?.bedroom || 0,
                toilet: item.attributes[0]?.bathroom || 0,
            });

            let price_id;
            let area_id;
            let checkUnit = item.attributes[0].price?.split(" ");
            // only get number "20.4 tỷ" => 20
            let price_number = FormatGetNummber(item?.attributes[0]?.price);
            let area_number = FormatGetNummber(item?.attributes[0]?.acreage);

            //price_number khác số là undefined: thỏa thuận
            // checkunit[1] là undefined or giá không ghi triệu hay tỷ là cho dưới 1 tỷ
            //  checkUnit[1] có chữ mà khác 1 tỷ là cho dưới 1 tỷ
            !price_number || !checkUnit[1] || checkUnit[1] !== "tỷ"
                ? (price_id = "duoi_1ty")
                : (price_id = price_buysell.find(
                      (price) =>
                          price_number >= +price.min &&
                          price_number < +price.max
                  )._id);

            !area_number
                ? //area_number khác số là undefined
                  (area_id = "duoi_20m2")
                : (area_id = area_data.find(
                      (area) =>
                          area_number >= +area.min && area_number < +area.max
                  )._id);

            let start_date;
            let province;
            let province_split;
            let province_trim;
            let news_type_name;
            let arr_post_characteristic = item.post_characteristic.content;

            arr_post_characteristic.map(async (i) => {
                if (i.name === "Ngày bắt đầu:") {
                    start_date = i.content;
                }
                if (i.name === "Khu vực:") {
                    province_split = i.content.split(",");
                    province_trim = province_split.pop().trim();
                    province = provincedata.find((i) =>
                        i.province_name.includes(province_trim)
                    );
                }
                if (i.name === "Gói tin:") {
                    news_type_name = i.content;
                }
            });

            const news_type = await NewsType.findOne({ name: news_type_name });

            const real_home = await RealHome.create({
                user_post: user,
                address: item.address,
                start_date,
                images: images,
                real_home_type_id: "645b56517cc26519dbcaad62",
                transaction_type_id: "645b56517cc26519dbcaad4a",
                description: description,
                price_id: price_id,
                area_id: area_id,
                province_id: +province?.province_id || 48,
                active: true,
                news_type_id: news_type?._id,
            });

            function TaoSoNgauNhien(min, max) {
                // 0->4
                return Math.floor(Math.random() * (max - min)) + min;
            }
            let number_day_random = +arr[TaoSoNgauNhien(0, 4)];

            const obj_number_day = await NumberDay.findOne({
                number_day: +number_day_random,
            });

            let end_date = FormatDate(+number_day_random);

            const expireAt = new Date();
            expireAt.setDate(expireAt.getDate() + +number_day_random); // Set expiry after numberday

            let VND = news_type.unit_price * obj_number_day.number_day;

            const obj_payment = await Payment.create({
                user: user,
                news_type: news_type,
                number_day: obj_number_day,
                real_home: real_home,
                total_price: +VND,
                start_date: start_date,
                expiration_date: end_date,
                expireAt: expireAt,
            });

            if (obj_payment) {
                const deleteTime = expireAt;
                setTimeout(async () => {
                    // Delete the document from the first collection (automatically by the `expireAt` index)
                    // No explicit delete operation needed here, the document will be automatically deleted

                    // Update the field after document payment deleted
                    const expire_update = await RealHome.findByIdAndUpdate(
                        { _id: real_home._id },
                        {
                            active: false,
                        }
                    );

                    // if (expire_update) {
                    //     console.log("Field updated success.");
                    // } else {
                    //     console.error("Error updating field:", error);
                    // }
                }, deleteTime - Date.now());

                const history_payment = await paymentHistory.create({
                    payment: obj_payment,
                });

                obj_payment.save();
                history_payment.save();
            }

            real_home.save();
        });
        console.log("Insert db successed!");
    } catch (error) {
        console.log(error);
    }
};
