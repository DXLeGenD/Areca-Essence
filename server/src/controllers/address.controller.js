import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Address } from "../models/address.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const createAddress = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new ApiError(401, "No token provided");
    }

    let userId;
    try {
        userId = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(400, "Invalid Token");
    }

    const email = userId?.email;

    if (!email) {
        throw new ApiError(400, "Invalid user data in token");
    }

    const { areaLineOne, areaLineTwo, city, state, contactNumber, pincode } = req.body;


    if ([state, city, contactNumber, email, pincode].some(field => !field?.trim())) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const newAddress = await Address.create({
        areaLineOne,
        areaLineTwo,
        city,
        state,
        pincode,
        contactNumber,
        email
    });

    if (!newAddress) {
        throw new ApiError(500, "Unable to save address");
    }

    return res.status(201).json(new ApiResponse(201, { newAddress }, "Address created successfully"));
});

const getAddress = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new ApiError(401, "No token provided");
    }

    let userId;
    try {
        userId = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(400, "Invalid Token");
    }

    const email = userId?.email;

    if (!email) {
        throw new ApiError(400, "Invalid user data in token");
    }

    const addressDetails = await Address.findOne({ email });

    if (!addressDetails) {
        throw new ApiError(404, "Address not found");
    }

    return res.status(200).json(new ApiResponse(200, { addressDetails }, "Address retrieved successfully"));
});

export {
    createAddress,
    getAddress
};
