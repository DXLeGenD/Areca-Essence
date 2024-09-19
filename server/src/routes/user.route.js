import { loginUser, logoutUser, registerUser, retrieveEmail, retrieveUserDetails } from "../controllers/user.controller.js";
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const userRoute = Router()

userRoute.route("/register").post(upload.none(), registerUser)
userRoute.route("/login").post(upload.none(), loginUser)
userRoute.route("/retrieveuser").post(retrieveUserDetails)

//secure routes
userRoute.route("/logout").post(verifyJWT, logoutUser)
userRoute.route("/retrieveemail").get(retrieveEmail)

export { userRoute }