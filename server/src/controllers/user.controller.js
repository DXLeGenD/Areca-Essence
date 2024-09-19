import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
const registerUser = asyncHandler(async (req, res, next) => {
    //read the data from the front end
    // console.log(req.body)
    let { email, password, phone, gender, name, } = req.body


    //validate the data
    if (
        [email, password, name, gender, phone].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    email = email.toLowerCase()


    // console.log(email)


    //check if the user is already exists
    const checkUserExist = await User.findOne({ email })
    if (checkUserExist) {
        throw new ApiError(401, "User Already Exists!!!")
    }


    //save the data to the mongo
    const user = await User.create({
        email,
        password,
        name,
        gender: gender.toLowerCase(),
        phone
    })
    // console.log(user)
    //check User is created or not
    if (!user) {
        throw new ApiError(500, "Unable create the user")
    }

    //remove password and refreshtoken 
    const response = await User.findById(user._id).select("-refreshToken")

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    response, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})



const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body
    if (!email && !password) {
        throw new ApiError(400, "email and password are required")
    }
    email = email.toLowerCase()


    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOneAndUpdate(req.user._id,
        {
            refreshToken: undefined
        }).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }

    if (user) {
        res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, user, "Successfully logged out"));
    }
})


const retrieveUserDetails = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken ||
        req.header("Authentication")?.replace("Bearer ", "")

    const userId = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    if (!userId) {
        throw new ApiError(400, "Invalid Refresh Token!")
    }
    const user = await User.findById(userId._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(400, "Invalid Refresh Token!!!")
    }
    return res.status(200)
        .json(new ApiResponse(200, {
            user
        }, "User details successfully fetched"))
})

const retrieveEmail = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken ||
        req.header("Authentication")?.replace("Bearer ", "")
    if (!accessToken) {
        return res.status(200)
            .json(new ApiResponse(200, { email: "asas" }, "no access token"))
    }

    const userId = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200)
        .json(new ApiResponse(200, { userId }, "Email id is successfully fetched"))

})

export { registerUser, loginUser, logoutUser, retrieveUserDetails, retrieveEmail }