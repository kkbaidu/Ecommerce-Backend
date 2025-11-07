// @ts-nocheck
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import * as CustomError from "../errors/index.js";
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from "../utils/index.js";

export const getAllUsers = async (req: any, res: any) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req: any, res: any) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req: any, res: any) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

// update user with user.save()
export const updateUser = async (req: any, res: any) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (req: any, res: any) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

export default {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
