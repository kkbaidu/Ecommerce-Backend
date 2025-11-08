import { Request, Response } from "express";
import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import * as CustomError from "../errors/index.js";
import path from "path";

const createProduct = async (req: Request, res: Response) => {
  // @ts-ignore
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};

const uploadImage = async (req: Request, res: Response) => {
  // @ts-ignore
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  // @ts-ignore
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
export default {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
