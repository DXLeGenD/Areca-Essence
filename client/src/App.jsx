import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import "./index.css"
import Loader from "./components/loader"
import Header from "./components/header"

const Home = lazy(() => import("./pages/home"))
const Cart = lazy(() => import("./pages/cart"))
const Search = lazy(() => import("./pages/search"))
const Login = lazy(() => import("./pages/login"))
const Register = lazy(() => import("./pages/register"))
const OrderSuccess = lazy(() => import("./pages/orderSuccess"))
const OrderCancel = lazy(() => import("./pages/orderCancel"))
const NotFound = lazy(() => import("./components/notfound"))
const Orders = lazy(() => import("./pages/order"))




const App = () => {
    console.log("Hello World!!")
    return (
        <Router>
            {/* Header */}
            <Header />
            <Suspense fallback={<Loader />}>
                <Routes >
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/success" element={<OrderSuccess />} />
                    <Route path="/cancel" element={<OrderCancel />} />




                    <Route path="*" element={<NotFound />} />


                </Routes>
            </Suspense>
        </Router >
    )
}

export default App
