import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartItems = ({
    photo,
    productId,
    price,
    name,
    quantity,
    incHandler,
    decHandler,
    remHandler
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <img src={photo} alt={name} className="w-24 h-24 object-contain" />
            <article className="flex-1 mx-4">
                <Link to={`/product/${productId}`} className="text-blue-600 hover:underline">
                    {name}
                </Link>
                <span className="block text-gray-800">₹{price}</span>
            </article>
            <div className="flex items-center space-x-2">
                <button
                    onClick={decHandler}
                    className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    -
                </button>
                <p className="text-lg font-semibold">{quantity}</p>
                <button
                    onClick={incHandler}
                    className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    +
                </button>
            </div>
            <button
                onClick={remHandler}
                className="text-red-600 ml-3 hover:text-red-800"
            >
                <FaTrash />
            </button>
        </div>
    );
};

export default CartItems;
