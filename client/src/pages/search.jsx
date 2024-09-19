import { useState, useEffect } from "react";
import ProductCard from "../components/productCart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Search = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [maxPrice, setMaxPrice] = useState(100000);
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const productsPerPage = 3;

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


    const filteredProducts = products
        .filter(product =>
            product.productName.toLowerCase().includes(search.toLowerCase()) &&
            Number(product.productPrice) <= maxPrice &&
            (category === "" || product.category === category)
        )
        .sort((a, b) => {
            if (sort === "asc") return Number(a.productPrice) - Number(b.productPrice);
            if (sort === "dsc") return Number(b.productPrice) - Number(a.productPrice);
            return 0;
        });


    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const addToCartHandler = (productId, name, price, photo) => {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingProductIndex = cart.findIndex(item => item.productId === productId);
        console.log(existingProductIndex)
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
    useEffect(() => {
        setPage(filteredProducts.length)
    }, [filteredProducts])

    return (
        <>
            <ToastContainer />
            <div className="flex p-8 min-h-[calc(100vh-6.5vh)]">
                <aside className="w-[20rem] shadow-lg p-8 bg-white">
                    <h2 className="text-2xl font-bold mb-4">Filters</h2>
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Sort</h4>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full p-2 border rounded-lg border-gray-300"
                        >
                            <option value="">None</option>
                            <option value="asc">Price (Low to High)</option>
                            <option value="dsc">Price (High to Low)</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Max Price: {maxPrice || ""}</h4>
                        <input
                            type="range"
                            min={100}
                            max={100000}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <h4 className="font-bold mb-2">Category</h4>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border rounded-lg border-gray-300"
                        >
                            <option value="">ALL</option>
                            <option value="Plate">Plates</option>
                            <option value="Cup">Cups</option>
                            <option value="Bowl">Bowls</option>
                        </select>
                    </div>
                </aside>
                <main className="flex-1 p-8 w-fit h-fit">
                    <h1 className="text-2xl font-bold mb-4">Products</h1>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 border rounded-lg border-gray-300 mb-4 text-xl"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    name={product.productName}
                                    price={product.productPrice}
                                    stock={product.productStock}
                                    photo={product.productPic}
                                    description={product.description}
                                    handler={() => addToCartHandler(product._id, product.productName, product.productPrice, product.productPic)}
                                />
                            ))
                        }
                    </div>

                    <article className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 0 || page === 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="flex items-center">
                            {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </article>
                </main>
            </div>
        </>
    );
};

export default Search;
