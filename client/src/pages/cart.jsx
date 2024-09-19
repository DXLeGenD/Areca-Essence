import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CartItemCard from "../components/cartItem";
import { loadStripe } from "@stripe/stripe-js";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [isValidCouponCode, setIsValidCouponCode] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [email, setEmail] = useState(null)
    const shippingCharges = 0;
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("/api/v1/user/retrieveemail")
            .then((res) => {
                setEmail(res.data.data.userId.email.toLowerCase())
            })
            .catch((err) => {
                console.log(err)
            })
    }, [email])





    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(storedCartItems);
        // console.log(storedCartItems)
    }, []);

    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setSubtotal(newSubtotal);
    }, [cartItems]);

    const total = subtotal + (subtotal ? shippingCharges : 0) - (isValidCouponCode ? discount : 0);

    const updateCart = (updatedCart) => {
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const increaseQuantity = (productId) => {
        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
    };

    const decreaseQuantity = (productId) => {
        const updatedCart = cartItems.map(item =>
            item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCart(updatedCart);
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const checkOutHandler = async () => {
        const stripe = await loadStripe("pk_test_51Po0L02NDuVlVmYHCzMCsiUk2qn8JO7VjhMAYwgU9OJPq7tbW77XcsdoSqGoSoi7MzRScRb1Kws1V4iGH6OuU4AH00ADz3F7mc")
        const products = cartItems.map(item => ({
            name: item.name,
            photo: item.photo,
            quantity: item.quantity,
            price: Math.round(parseFloat((item.price * 100).toFixed(2)))
        }));
        const body = {
            products
        }
        const header = {
            "Content-Type": "application/json"
        }

        const response = await fetch("/api/v1/order/checkout", {
            method: "POST",
            headers: header,
            body: JSON.stringify(body)
        })

        localStorage.setItem("order", JSON.stringify(cartItems))
        localStorage.setItem("address", JSON.stringify(address))


        const session = await response.json()

        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        })
        if (result.error) {
            console.log(result.error)
        }
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        updateCart(updatedCart);
    };


    return (
        <div className="px-2 flex flex-row md:p-8 md:px-16 h-[calc(100vh-4rem)]">
            <main className="w-full flex flex-wrap">
                <div className="md:w-7/12 overflow-y-auto w-full">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItemCard
                                key={item.productId}
                                photo={item.photo}
                                name={item.name}
                                productId={item.productId}
                                price={item.price}
                                quantity={item.quantity}
                                incHandler={() => increaseQuantity(item.productId)}
                                decHandler={() => decreaseQuantity(item.productId)}
                                remHandler={() => removeFromCart(item.productId)}
                            />
                        ))
                    ) : (
                        <div className="flex w-full h-full justify-center items-center">
                            <p className="text-center text-xl font-semibold text-gray-600">
                                No Items in the Cart
                            </p>
                        </div>
                    )}
                </div>
                <aside className="md:w-5/12 p-16 flex flex-col items-baseline justify-start space-y-6 w-full">
                    <p className="text-lg font-bold">Subtotal: ₹{subtotal}</p>
                    <p className="text-lg font-bold">
                        Discount: <span className="text-red-600">- ₹{isValidCouponCode ? discount : 0}</span>
                    </p>
                    <p className="text-lg font-bold">
                        <b>Total: ₹{total}</b>
                    </p>

                    <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="p-4 border border-gray-400 rounded mt-4"
                    />

                    {couponCode &&
                        (isValidCouponCode ? (
                            <span className="text-green-600">
                                ₹{discount} off using the <code>{couponCode}</code>
                            </span>
                        ) : (
                            <span className="text-red-600 flex items-center">
                                Invalid Coupon <VscError className="ml-2" />
                            </span>
                        ))}

                    {cartItems.length > 0 && (
                        <button
                            onClick={async () => {

                                if (email) {
                                    // console.log("running")

                                    setIsModalOpen(true);
                                } else {
                                    // console.log("running2")
                                    navigate("/login");
                                }
                            }}
                            className="inline-block px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-xl border border-blue-500 hover:border-blue-600 transition-colors duration-300 text-center w-fit"
                        >
                            Checkout
                        </button>
                    )}

                </aside>
            </main>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                        <h2 className="text-2xl font-semibold mb-6">Enter Shipping Address</h2>
                        <input
                            type="text"
                            name="addressLine1"
                            placeholder="Address Line 1"
                            value={address.addressLine1}
                            onChange={handleInputChange}
                            className="p-2 border w-full mb-4"
                            required
                        />
                        <input
                            type="text"
                            name="addressLine2"
                            placeholder="Address Line 2"
                            value={address.addressLine2}
                            onChange={handleInputChange}
                            className="p-2 border w-full mb-4"
                        />

                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={address.city}
                            onChange={handleInputChange}
                            className="p-2 border w-full mb-4"
                            required
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={address.state}
                            onChange={handleInputChange}
                            className="p-2 border w-full mb-4"
                            required
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={address.pincode}
                            onChange={handleInputChange}
                            className="p-2 border w-full mb-4"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter Contact Number"
                            value={address.phone}
                            onChange={handleInputChange}
                            className="p-2 border w-full mb-4"
                            required
                        />
                        <button
                            type="button"
                            onClick={checkOutHandler}
                            className="px-6 py-3 bg-blue-500 text-white rounded-md"
                        >
                            Checkout and Pay
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 ml-4 text-red-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Cart;
