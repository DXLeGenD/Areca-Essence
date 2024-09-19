import mongoose, { Schema } from "mongoose";


const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productPic: {
        type: String,
        required: true
    },
    productStock: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

export const Product = mongoose.model("Product", productSchema)