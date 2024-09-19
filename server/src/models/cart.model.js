import mongoose, { Schema } from "mongoose";


const cartSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productPic: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    email: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Cart = mongoose.model("Cart", cartSchema)