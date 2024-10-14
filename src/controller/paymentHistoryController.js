const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();


const serverKeyMidtrans = Buffer.from(process.env.SERVER_KEY_MIDTRANS).toString('base64');

exports.checkoutPayment = async (req, res) => {
    const { userId } = req.body;

    try {
        const checkouts = await prisma.checkout.findMany({
            where: {
                userId: userId,
            },
            include: {
                payment: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({
            checkouts,
            message: 'success get checkout with payment'
        });
    } catch (error) {
        console.log('failed get checkout with payment', error);
        res.status(500).json({ message: 'Failed to fetch checkouts' });
    }
};

exports.checkStatusPayment = async (req, res) => {
    const { transaction_status, order_id, payment_type } = req.body

    try {
        if (transaction_status === 'settlement' || transaction_status === 'capture') {
            const findOrder = await prisma.payment.update({
                where: {
                    transactionId: order_id
                },
                data: {
                    paymentStatus: 'SUCCESS',
                    paymentType: payment_type
                }
            })
            console.log('settlement', findOrder);
            return res.status(200).json({ findOrder, message: 'success get after payment notif' });
        } else {
            const findOrder = await prisma.payment.update({
                where: {
                    transactionId: order_id
                },
                data: {
                    paymentStatus: 'PENDING',
                    paymentType: payment_type
                }
            });
            console.log('pending', findOrder);

            return res.status(200).json({ findOrder, message: 'success get after payment notif' });
        }
    } catch (error) {
        console.log('failed get after payment notif', error);
        res.status(500).json({ message: 'failed get after payment notif' });
    }

}