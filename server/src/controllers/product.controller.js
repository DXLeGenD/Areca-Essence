import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { Product } from "../models/product.model.js"

const uploadProduct = asyncHandler(async (req, res, _) => {
    const { productName, productStock, productPrice, description } = req.body;

    // console.log(productName);
    const productPic = req.files?.productPic[0]?.path;
    if (!productPic) {
        throw new ApiError(401, "Image is Required");
    }
    // console.log(productPic)

    const uploadedPic = await uploadToCloudinary(productPic);
    // console.log(uploadedPic)
    if (!uploadedPic || !uploadedPic.url) {
        throw new ApiError(500, "Unable to upload image on Cloudinary");
    }

    const uploaded = await Product.create({
        productName,
        productPic: uploadedPic.url,
        productStock: Number(productStock),
        productPrice: Number(productPrice),
        description
    });

    if (!uploaded) {
        throw new ApiError(500, "Unable to upload the product details");
    }

    return res.status(200).json(
        new ApiResponse(200, { productDetails: uploaded }, "Product Uploaded Successfully")
    );
});

const retrieveProducts = asyncHandler(async (req, res, _) => {
    const productDetails = await Product.find({})
    if (!productDetails) {
        throw new ApiError(500, "Internal Server Error!!!")
    }
    return res.status(200)
        .json(new ApiResponse(200,
            {
                productDetails
            }, "Succesfully Retrived product Details"))
})

export {
    uploadProduct,
    retrieveProducts
}