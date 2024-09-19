import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Order = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("/api/v1/user/retrieveemail")
            .then((res) => {

                setUser(res.data.data.userId.email)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [user])

    useEffect(() => {
        axios.get("/api/v1/order/retrieveorder")
            .then((res) => {

                setOrders(res.data.data.orderDetails)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    return (
        <div className="container mx-auto mt-8 ">
            <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
            <table className="min-w-full bg-white border" >
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left border">Product Name</th>
                        <th className="px-4 py-2 text-left border">Quantity</th>
                        <th className="px-4 py-2 text-left border">Total Price</th>
                        <th className="px-4 py-2 text-left border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border">{order.productName}</td>
                                <td className="px-4 py-2 border">{Number(order.productQuantity)}</td>
                                <td className="px-4 py-2 border">₹{order.productTotalPrice}</td>
                                <td className="px-4 py-2 border">{order.progress}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-4 py-2 border text-center">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Order;
