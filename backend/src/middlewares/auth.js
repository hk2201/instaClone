import jwt from "jsonwebtoken";
import { APIResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../utils/httpStatus.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(HttpStatus.UNAUTHORIZED, null, "Unauthorized access")
        );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(new APIResponse(HttpStatus.UNAUTHORIZED, null, "Invalid token"));
  }
};
