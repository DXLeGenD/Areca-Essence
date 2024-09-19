import { Router } from "express";
import { retrieveOrder, placeOrder, checkOutHandler } from "../controllers/order.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const orderRoute = Router()

orderRoute.route("/retrieveorder").get(retrieveOrder)
orderRoute.route("/placeorder").post(upload.none(), placeOrder)
orderRoute.route("/checkout").post(upload.none(), checkOutHandler)


export { orderRoute }