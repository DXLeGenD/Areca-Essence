import { FaPlus } from "react-icons/fa";

const ProductCard = ({ photo, name, price, description, handler }) => {
    return (
        <div className="relative w-64 h-80 p-4 bg-white flex flex-col items-center justify-between shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <img src={photo} alt={name} className="w-full h-48 object-contain mb-2" />
            <p className="text-lg font-semibold">{name}</p>
            <span className="text-xl font-bold text-gray-800">₹{price}</span>
            <span className="text-xl font-bold text-gray-800">{description}</span>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                <button
                    onClick={handler}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-xl hover:bg-blue-600 transition-transform transform hover:rotate-12"
                >
                    <FaPlus />
                </button>
            </div>
            <p className="absolute bottom-2 left-2 text-sm text-gray-500" style={{ display: "none" }}>{/* hidden */}</p>
        </div>
    );
};

export default ProductCard;
