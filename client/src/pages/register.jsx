import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        phone: ''
    });
    const navigation = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("api/v1/user/register", {
            email: formData.email.toLowerCase(),
            name: formData.name,
            password: formData.password,
            gender: formData.gender,
            phone: formData.phone
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            navigation("/")
        }).catch((err) => {
            if (err.response) {

                console.error("Error Response:", err.response.data);
                console.error("Status Code:", err.response.status);
            } else if (err.request) {
                console.error("No Response:", err.request);
            } else {
                console.error("Error", err.message);
            }
        });

    };



    return (
        <div className="flex items-center justify-center min-h-screen mt-5 bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>



                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <div className="flex flex-row justify-center gap-4  mt-2 ">
                            <div>
                                <input
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    value="Male"
                                    onChange={handleChange}
                                    required
                                    className="mr-2"
                                />
                                <label htmlFor="male" className="text-sm text-gray-700 ">Male</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    value="Female"
                                    onChange={handleChange}
                                    required
                                    className="mr-2"
                                />
                                <label htmlFor="female" className="text-sm text-gray-700">Female</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="other"
                                    name="gender"
                                    value="Other"
                                    onChange={handleChange}
                                    required
                                    className="mr-2"
                                />
                                <label htmlFor="other" className="text-sm text-gray-700">Other</label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
