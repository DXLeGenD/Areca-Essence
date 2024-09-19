import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
            <h2 className="text-4xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
            <p className="text-lg text-gray-600 mt-2">
                Oops! The page you are looking for doesn't exist.
            </p>
            <Link to="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
