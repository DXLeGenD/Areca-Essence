import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import image from "../assets/logo.jpg"
import { FaBars, FaTimes } from "react-icons/fa";


const Header = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const getLinkClass = (path) => (
        location.pathname === path ? "text-blue-600 font-bold" : "text-gray-800"
    );

    useEffect(() => {
        axios.get("/api/v1/user/retrieveemail")
            .then((res) => {
                console.log(user)
                setUser(res.data.data.userId.email.toLowerCase())
                console.log(user)

            })
            .catch((err) => {
                console.log(err)
            })
    }, [user])


    const userLogout = async () => {
        await axios.post("/api/v1/user/logout")
            .then((res) => {
                document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                setUser(null);

                window.location.reload();
            })
            .catch((err) => console.log(err));
    }



    return (
        <>
            <nav className="flex z-20 justify-between items-center p-5 bg-white shadow-md">
                <div className="text-2xl ml-2">
                    <img src={image} alt="Areca Essence" className="w-8 sm:w-12" />
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-xl">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Menu Links */}
                <div className={`flex md:flex ${isOpen ? "block" : "hidden"} flex-col md:flex-row lg:items-center md:gap-5 w-full md:w-auto bg-white md:bg-transparent md:static absolute top-20 left-0 md:top-0 md:left-0 p-5 md:p-0 shadow-md md:shadow-none`}>
                    <Link
                        to="/"
                        className={`${getLinkClass("/")} text-xl hover:text-gray-600 lg:mt-0 mt-2`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/search"
                        className={`${getLinkClass("/search")} text-xl hover:text-gray-600 lg:mt-0 mt-2`}
                    >
                        Search
                    </Link>
                    <Link
                        to="/cart"
                        className={`${getLinkClass("/cart")} text-xl hover:text-gray-600 lg:mt-0 mt-2`}
                    >
                        Cart
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to="/orders"
                                className={`${getLinkClass("/orders")} text-xl hover:text-gray-600 lg:mt-0 mt-2`}
                            >
                                Orders
                            </Link>
                            <Link
                                onClick={userLogout}
                                to="/"
                                className="text-gray-800 text-xl hover:text-gray-600 lg:mt-0 mt-2"
                            >
                                Sign Out
                            </Link>
                        </>
                    ) : (
                        <Link
                            onClick={() => setIsOpen(false)}
                            to="/login"
                            className={`${getLinkClass("/login")} text-xl hover:text-gray-600 lg:mt-0 mt-2`}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Header;
