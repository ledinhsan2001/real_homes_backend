import PaymentHistory from "../models/paymentHistory";
import { NewsType } from "../models/newsType";
import { NumberDay } from "../models/numberDay";
import { Payment } from "../models/payment";
import { RealHome } from "../models/realHome";
import { User } from "../models/user";
import { FormatDate } from "../utils/FormatDate";
import SavePost from "../models/SavePost";
require("dotenv").config();
const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: process.env.CLIENT_ID_PAYPAL,
    client_secret: process.env.SECRET_PAYPAL,
});

export const create = async (req, res) => {
    const { news_type, unit_price, number_day, total_price, id_post } =
        req.body;

    let cal_price = +total_price / 23;
    let cal_unit_price = +unit_price / 23;
    const global_total_price = Math.floor(cal_price * 100) / 100;
    const global_unit_price = Math.floor(cal_unit_price * 100) / 100;

    let news_type_name;
    if (news_type === 0) {
        news_type_name = "đặc biệt";
    }
    if (news_type === 1) {
        news_type_name = "đặc sắc";
    }
    if (news_type === 2) {
        news_type_name = "thường";
    }

    try {
        var create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: `${process.env.BASE_CLIENT_URL}/rieng-tu/payment-success?total_price=${global_total_price}&VND=${total_price}&id_post=${id_post}&news_type=${news_type}&number_day=${number_day}`,
                cancel_url: `${process.env.BASE_CLIENT_URL}/rieng-tu/payment-fail`,
            },

            transactions: [
                {
                    item_list: {},
                    amount: {
                        currency: "USD",
                        total: global_total_price.toString(),
                    },
                    description: `Tin ${news_type_name}, Id_post: ${id_post}, price: ${global_unit_price} USD, ${number_day} ngày`,
                },
            ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                return res
                    .status(400)
                    .json({ success: false, messages: "Tạo thanh toán lỗi!" });
            } else {
                const arrLink = payment.links;
                const link = arrLink.find(
                    (item) => item.rel === "approval_url"
                );
                // href: 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9U395837P0714915M',
                res.status(200).json({ success: true, data: link.href });
            }
        });
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Thanh toán không thành công!" });
    }
};

export const get = (req, res) => {
    // receive ID
    const user_id = req.userId;
    const PayerID = req.query.PayerID;

    const total_price = req.query.total_price;
    const VND = req.query.VND;
    const id_post = req.query.id_post;
    const news_type_id = req.query.news_type;
    const number_day = req.query.number_day;

    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: total_price.toString(),
                },
            },
        ],
    };

    const paymentId = req.query.paymentId;
    paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async function (error, payment) {
            if (error) {
                return res.status(400).json({
                    success: false,
                    messages: "Thanh toán Không thành công!",
                });
            } else {
                // Get Payment Response
                // console.log(JSON.stringify(payment));

                try {
                    const user = await User.findOne({ _id: user_id });
                    const obj_news_type = await NewsType.findOne({
                        _id: news_type_id,
                    });
                    const obj_number_day = await NumberDay.findOne({
                        number_day: +number_day,
                    });

                    // update active
                    const obj_real_home = await RealHome.findByIdAndUpdate(
                        { _id: id_post },
                        { active: true, news_type_id: obj_news_type._id },
                        {
                            new: true,
                        }
                    );

                    let start_date = FormatDate();
                    let end_date = FormatDate(+number_day);

                    const expireAt = new Date();
                    expireAt.setDate(expireAt.getDate() + +number_day); // Set expiry after numberday

                    const obj_payment = await Payment.create({
                        user: user,
                        news_type: obj_news_type,
                        number_day: obj_number_day,
                        real_home: obj_real_home,
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
                            const expire_update =
                                await RealHome.findByIdAndUpdate(
                                    { _id: id_post },
                                    {
                                        active: false,
                                    }
                                );

                            if (expire_update) {
                                console.log("Field updated success.");
                            } else {
                                console.error("Error updating field:", error);
                            }
                        }, deleteTime - Date.now());

                        const history_payment = await PaymentHistory.create({
                            payment: obj_payment,
                        });

                        obj_payment.save();
                        history_payment.save();

                        return res.status(200).json({
                            success: true,
                            messages: "Thanh toán thành công!",
                            data: payment,
                        });
                    } else {
                        return res.status(400).json({
                            success: false,
                            messages: "Thanh toán không thành công!",
                        });
                    }
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        messages: "Thanh toán không thành công!",
                    });
                }
            }
        }
    );
};

// Create Payment Response
// {
//   id: 'PAYID-MSEYBSA0K7977732N362542H',
//   intent: 'sale',
//   state: 'created',
//   payer: { payment_method: 'paypal' },
//   transactions: [
//     {
//       amount: [Object],
//       description: 'This is the payment description.',
//       item_list: [Object],
//       related_resources: []
//     }
//   ],
//   create_time: '2023-06-14T08:56:40Z',
//   links: [
//     {
//       href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MSEYBSA0K7977732N362542H',
//       rel: 'self',
//       method: 'GET'
//     },
//     {
//       href: 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9U395837P0714915M',
//       rel: 'approval_url',
//       method: 'REDIRECT'
//     },
//     {
//       href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MSEYBSA0K7977732N362542H/execute',
//       rel: 'execute',
//       method: 'POST'
//     }
//   ],
//   httpStatusCode: 201
// }
