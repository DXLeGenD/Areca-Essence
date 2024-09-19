import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCart";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import "../index.css";
import axios from "axios";

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/api/v1/product/retrieve");
                setProducts(response.data.data.productDetails);
            } catch (error) {
                console.error("Error fetching product data", error);
            }
        };

        fetchProducts();
    }, []);


    const addToCartHandler = (productId, name, price, photo) => {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingProductIndex = cart.findIndex(item => item.productId === productId);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {

            cart.push({
                productId,
                quantity: 1,
                name,
                price: Number(price),
                photo
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success(`${name} added to cart`);
    };

    return (
        <>
            <div className="p-8 px-[5%] max-w-screen-xl mx-auto w-full flex flex-col">
                <section id="coverImage" className="w-full h-[20rem] bg-cover bg-center"></section>

                <h1 className="text-2xl font-bold mt-12 mb-4 flex justify-between items-center">
                    Latest Products
                    <Link to="/search" className="text-base text-blue-600 hover:underline">More</Link>
                </h1>

                {/* Product List Section */}
                <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product._id} // Use _id for the key
                                name={product.productName}
                                price={product.productPrice}
                                stock={product.productStock}
                                photo={product.productPic}
                                description={product.description}
                                handler={() => addToCartHandler(product._id, product.productName, product.productPrice, product.productPic)} // Fix product._id here as well
                            />
                        ))
                    ) : (
                        <p className="m-auto">No products available</p>
                    )}
                </main>

                <ToastContainer />
            </div>
        </>
    );
};

export default Home;
