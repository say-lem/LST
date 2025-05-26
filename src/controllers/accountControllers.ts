import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../utils/errorClasses";
import { CreateUserRequest } from "../interfaces/userInterface";
import { registerAccount, getAllAccounts } from "../services/accountServices";

//Controller to handle user registration.
export const register = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerAccount(req.body);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to retrieve all user accounts.
export const getAllUsersAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllAccounts();

    if (!users.length) {
      throw new NotFoundError("No users found");
    }

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
