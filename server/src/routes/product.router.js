import { uploadProduct, retrieveProducts } from "../controllers/product.controller.js"
import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { Product } from "../models/product.model.js"
const productRoute = Router()


productRoute.route("/upload").post(upload.fields([
    {
        name: "productPic",
        maxCount: 1
    },

]), uploadProduct)
productRoute.route("/retrieve").get(retrieveProducts)

export { productRoute }