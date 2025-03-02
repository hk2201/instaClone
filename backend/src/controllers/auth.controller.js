import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { APIResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../utils/httpStatus.js";

const saltRounds = 10;

//========================NORMAL_SIGNUP==================================================//

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
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

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

//========================GOOGLE_LOGIN==================================================//

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
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

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

//========================GET_GROUPS==================================================//

export const getGroups = async (req, res) => {
  try {
    const userEmail = req.user.email; // Using 'email' instead of 'id'
    // console.log(userEmail);
    // Fetch groups the user is part of
    const groups = await prisma.group.findMany({
      where: {
        memberships: {
          some: {
            email: userEmail, // Match email instead of userId
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: { id: true, username: true, email: true, image: true },
            },
          },
        },
        creator: {
          select: { id: true, username: true, email: true },
        },
        posts: true, // Include posts to count them
      },
    });

    // Format response
    const formattedGroups = groups.map((group) => {
      // Extract members from memberships
      const members = group.memberships.map((membership) => ({
        email: membership.email, // Store email instead of userId
        name: membership.user?.username || "Unknown",
        image: membership.user?.image || "/api/placeholder/48/48",
      }));

      return {
        id: group.id,
        name: group.name,
        memberCount: `${members.length} members`,
        postCount: (group.posts?.length || 0).toString(),
        image: group.image || "/api/placeholder/48/48",
        members,
        description: group.description || "",
        createdAt: group.createdAt,
        creatorId: group.creatorId, // Still keeping creator by ID
      };
    });

    return res
      .status(HttpStatus.OK)
      .json(new APIResponse(HttpStatus.OK, formattedGroups));
  } catch (error) {
    console.error("Error fetching groups:", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

//========================POST_GROUPS==================================================//

export const postGroups = async (req, res) => {
  try {
    const { groupName, description, image, members } = req.body;
    // console.log(req.body);
    const creatorEmail = req.user.email; // Get creator's email

    // Create the group with memberships using emails
    const newGroup = await prisma.group.create({
      data: {
        description,
        image,
        creatorId: req.user.id, // Keep tracking creator by ID
        memberships: {
          create: [
            { email: creatorEmail }, // Add creator as a member
            ...members.map((email) => ({ email })), // Store member emails
          ],
        },
        name: groupName,
      },
      include: {
        memberships: true, // Include member emails
      },
    });

    return res
      .status(HttpStatus.CREATED)
      .json(new APIResponse(HttpStatus.CREATED, newGroup));
  } catch (error) {
    console.error("Error creating group:", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

//========================NORMAL_LOGIN==================================================//

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
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

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

//========================UPDATE_GROUP_INFO==================================================//

export const updateGroupInfo = async (req, res) => {
  try {
    const { id, name, description, image } = req.body;

    // Validate required fields
    if (!id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Group ID is required")
        );
    }

    // Check if the group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
      include: {
        memberships: true,
        creator: {
          select: { id: true, email: true },
        },
      },
    });

    if (!existingGroup) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new APIResponse(HttpStatus.NOT_FOUND, null, "Group not found"));
    }

    // Authorization check: Only creator or admin should be able to update the group
    // if (existingGroup.creatorId !== req.user.id) {
    //   return res
    //     .status(HttpStatus.FORBIDDEN)
    //     .json(
    //       new APIResponse(
    //         HttpStatus.FORBIDDEN,
    //         null,
    //         "You don't have permission to update this group"
    //       )
    //     );
    // }

    // Update group information
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        name: name || existingGroup.name,
        description:
          description !== undefined ? description : existingGroup.description,
        image: image !== undefined ? image : existingGroup.image,
        updatedAt: new Date(),
      },
      include: {
        memberships: {
          include: {
            user: {
              select: { id: true, username: true, email: true, image: true },
            },
          },
        },
        creator: {
          select: { id: true, username: true, email: true },
        },
        posts: true,
      },
    });

    // Format response similar to getGroups
    const members = updatedGroup.memberships.map((membership) => ({
      email: membership.email,
      name: membership.user?.username || "Unknown",
      image: membership.user?.image || "/api/placeholder/48/48",
    }));

    const formattedGroup = {
      id: updatedGroup.id,
      name: updatedGroup.name,
      memberCount: `${members.length} members`,
      postCount: (updatedGroup.posts?.length || 0).toString(),
      image: updatedGroup.image || "/api/placeholder/48/48",
      members,
      description: updatedGroup.description || "",
      createdAt: updatedGroup.createdAt,
      updatedAt: updatedGroup.updatedAt,
      creatorId: updatedGroup.creatorId,
    };

    return res
      .status(HttpStatus.OK)
      .json(new APIResponse(HttpStatus.OK, formattedGroup));
  } catch (error) {
    console.error("Error updating group info:", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};
