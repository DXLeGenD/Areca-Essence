// import React, { useState, useEffect } from 'react';
// import { FaCheckCircle } from 'react-icons/fa';
// import { ImSpinner2 } from 'react-icons/im';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';


// const OrderSuccess = () => {
//     const [countdown, setCountdown] = useState(3);
//     const [isLoading, setIsLoading] = useState(true);
//     const navigate = useNavigate();



//     (async function backendWork() {
//         const address = JSON.parse(localStorage.getItem("address") || "[]");
//         const orders = JSON.parse(localStorage.getItem("order") || "[]");
//         if (address.length > 0) {
//             await axios.post("/api/v1/address/createaddress", {
//                 areaLineOne: address.addressLine1,
//                 areaLineTwo: address.addressLine2,
//                 city: address.city,
//                 state: address.state,
//                 contactNumber: address.phone,
//                 pincode: address.pincode
//             }).then((res) => {

//             }).catch((err) => console.log(err))
//         }

//         if (orders.length > 0) {
//             await axios.post("/api/v1/order/placeorder", {
//                 orders
//             }).then((res) => {
//                 localStorage.removeItem("cart")
//                 localStorage.removeItem("order")
//             }).catch((err) => console.log(err))
//         }
//         setIsLoading(false)
//     })()


//     useEffect(() => {
//         if (!isLoading && countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//             return () => clearTimeout(timer);
//         } else if (!isLoading && countdown === 0) {
//             navigate('/orders');
//         }
//     }, [countdown, isLoading, navigate]);

//     return (
//         <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//             {isLoading ? (
//                 <div className="flex flex-col items-center justify-center">
//                     <ImSpinner2 className="animate-spin h-12 w-12 text-blue-600" />
//                     <p className="mt-4 text-lg text-gray-600">Processing your order...</p>
//                 </div>
//             ) : (
//                 <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//                     <FaCheckCircle className="text-green-500 h-12 w-12 mx-auto" />
//                     <h1 className="text-2xl font-bold text-green-600 mt-4">Order Placed Successfully!</h1>
//                     <p className="text-gray-600 mt-4">Redirecting in {countdown} seconds...</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderSuccess;
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderSuccess = () => {
    const [countdown, setCountdown] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [hasRun, setHasRun] = useState(false); // Flag to prevent rerunning backend work


    // Async function for backend operations
    const backendWork = async () => {
        const address = JSON.parse(localStorage.getItem("address") || "[]");
        const orders = JSON.parse(localStorage.getItem("order") || "[]");

        // Handle address saving
        if (address.length > 0) {
            try {
                await axios.post("/api/v1/address/createaddress", {
                    areaLineOne: address.addressLine1,
                    areaLineTwo: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    contactNumber: address.phone,
                    pincode: address.pincode
                });
            } catch (err) {
                console.log(err);
            }
        }

        // Handle order placement
        if (orders.length > 0) {
            try {
                await axios.post("/api/v1/order/placeorder", { orders });
                localStorage.removeItem("cart");
                localStorage.removeItem("order");
            } catch (err) {
                console.log(err);
            }
        }

        // Set loading state to false after backend operations
        setIsLoading(false);
    };

    useEffect(() => {
        if (!hasRun) {
            backendWork();
            setHasRun(true); // Set flag to true after the first run
        }
    }, [hasRun]);// Empty dependency array to ensure this runs only once

    // Handle countdown for redirect
    useEffect(() => {
        if (!isLoading && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer); // Clean up timer
        } else if (!isLoading && countdown === 0) {
            navigate('/orders');
        }
    }, [countdown, isLoading, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <ImSpinner2 className="animate-spin h-12 w-12 text-blue-600" />
                    <p className="mt-4 text-lg text-gray-600">Processing your order...</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <FaCheckCircle className="text-green-500 h-12 w-12 mx-auto" />
                    <h1 className="text-2xl font-bold text-green-600 mt-4">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mt-4">Redirecting in {countdown} seconds...</p>
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
