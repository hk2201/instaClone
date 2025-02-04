import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { APIResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../utils/httpStatus.js";

const saltRounds = 10;

export const signup = async (req, res) => {
  try {
    const { email, password, username, lastname } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            HttpStatus.BAD_REQUEST,
            null,
            "Email and password are required"
          )
        );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(HttpStatus.CONFLICT)
        .json(
          new APIResponse(HttpStatus.CONFLICT, null, "User already exists")
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        username,
        lastname,
      },
    });

    // Generate JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Omit passwordHash from response
    const { passwordHash, ...safeUser } = newUser;

    return res.status(HttpStatus.CREATED).json(
      new APIResponse(HttpStatus.CREATED, {
        user: safeUser,
        token,
      })
    );
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

export const googlelogin = async (req, res) => {
  try {
    const { email, username, lastname } = req.body;

    // Validate input
    if (!email) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Email is required")
        );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user if they don't exist
      user = await prisma.user.create({
        data: {
          email,
          username,
          lastname: lastname || "", // Default to empty string if lastname is missing
          passwordHash: null, // No password needed for Google-authenticated users
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Omit passwordHash from response
    const { passwordHash, ...safeUser } = user;

    return res.status(HttpStatus.OK).json(
      new APIResponse(HttpStatus.OK, {
        user: safeUser,
        token,
      })
    );
  } catch (error) {
    console.error("Google Login Error:", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(HttpStatus.UNAUTHORIZED, null, "Invalid credentials")
        );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(HttpStatus.UNAUTHORIZED, null, "Invalid credentials")
        );
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Omit passwordHash from response
    const { passwordHash, ...safeUser } = user;

    return res.status(HttpStatus.OK).json(
      new APIResponse(HttpStatus.OK, {
        user: safeUser,
        token,
      })
    );
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};
