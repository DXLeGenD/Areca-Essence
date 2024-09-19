import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



const placeOrder = asyncHandler(async (req, res, next) => {
    const { orders } = req.body

    if (orders.length <= 0) {
        throw new ApiError(402, "Empty Order")
    }

    const accessToken = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new ApiError(401, "Access token is missing or invalid");
    }

    let userId;
    try {
        userId = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const email = userId?.email;
    if (!email) {
        throw new ApiError(400, "Invalid user data in token");
    }

    orders.map(async (product) => {
        const placedOrder = await Order.create({
            productName: product.name,
            productPic: product.photo,
            productQuantity: Number(product.quantity),
            productTotalPrice: Number(product.price * product.quantity),
            email
        })

        if (!placedOrder) {
            throw new ApiError(500, "Unable store the orders to database")
        }

    })

    return res.status(200)
        .json("Order Placde Successfully")
})

const retrieveOrder = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new ApiError(401, "Access token is missing or invalid");
    }

    let userId;
    try {
        userId = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const email = userId?.email;
    if (!email) {
        throw new ApiError(400, "Invalid user data in token");
    }

    try {
        const orderDetails = await Order.find({ email }).lean();

        if (!orderDetails.length) {
            throw new ApiError(404, "No orders found for this user");
        }

        return res.status(200).json(new ApiResponse(200, { orderDetails }, "Order details retrieved successfully"));
    } catch (err) {
        next(err);
    }
});

const checkOutHandler = asyncHandler(async (req, res, next) => {
    const { products } = req.body

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.name
            },
            unit_amount: product.price
        },
        quantity: product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel"
    })

    return res.json({ id: session.id })
})


export { placeOrder, retrieveOrder, checkOutHandler }