import 'dotenv/config'
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';

// require('dotenv').config()



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, "../../client/dist")))

// app.use((req, res, next) => {
//     res.setHeader("Content-Security-Policy", "script-src 'self' https://m.stripe.network");
//     next();
// });


//importing routes
import { userRoute } from './routes/user.route.js'
import { productRoute } from "./routes/product.router.js"
import { orderRoute } from './routes/order.route.js';
import { addressRouter } from "./routes/address.route.js"

//using routes
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute)
app.use("/api/v1/address", addressRouter)
app.get("*", (req, res, next) => {
    return res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"))
})
export { app }