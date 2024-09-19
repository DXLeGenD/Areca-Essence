import mongoose, { Schema } from "mongoose";


const addressSchema = new Schema({
    areaLineOne: {
        type: String,
    },
    areaLineTwo: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const Address = mongoose.model("Address", addressSchema)