import mongoose, { Schema } from "mongoose";


const orderSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productPic: {
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productTotalPrice: {
        type: Number,
        required: true,
        index: true
    },
    progress: {
        type: String,
        default: "Processing",
        enum: ["Processing", "Shipped", "Delivered"]
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const Order = mongoose.model("Order", orderSchema)