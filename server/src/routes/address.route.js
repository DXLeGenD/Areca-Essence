import { createAddress, getAddress } from "../controllers/address.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const addressRouter = Router();

// addressRouter.post("/create", createAddress);
// addressRouter.get("/get", getAddress);
addressRouter.route("/createaddress").post(upload.none(), createAddress)
addressRouter.route("/getaddress").get(getAddress)
export { addressRouter };
