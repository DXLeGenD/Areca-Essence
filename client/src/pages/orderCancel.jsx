import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa'; // Error icon
import { ImSpinner2 } from 'react-icons/im'; // Loading spinner
import { useNavigate } from 'react-router-dom';

const OrderCancel = () => {
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();




    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            navigate('/cart');
        }
    }, [countdown, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {countdown ? (
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <FaTimesCircle className="text-red-500 h-12 w-12 mx-auto" />
                    <h1 className="text-2xl font-bold text-red-600 mt-4">Order Failed</h1>
                    <p className="text-gray-600 mt-4">Redirecting in {countdown} seconds...</p>
                    <button
                        onClick={() => navigate('/cart')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Return to Cart
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default OrderCancel;
