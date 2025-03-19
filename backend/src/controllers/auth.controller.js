import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { APIResponse } from "../utils/apiResponse.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { Role } from "@prisma/client";

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
              select: {
                id: true,
                username: true,
                lastname: true,
                email: true,
                image: true,
              },
            },
          },
        },
        creator: {
          select: { id: true, username: true, email: true, lastname: true },
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
        lastname: membership.user?.lastname || "Unknown",
        id: membership.user?.id || "Unknown",
        role: membership.role || "Unknown",
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
            { email: creatorEmail, role: "ADMIN" }, // Add creator as a member
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

//========================UPDATE_ADMIN==================================================//

export const updateAdmin = async (req, res) => {
  try {
    const { groupId, member } = req.body;

    // Validate if the user that is performing action is ADMIN
    const checkAdmin = await prisma.membership.findUnique({
      where: {
        email_groupId: {
          email: req.user.email,
          groupId: groupId,
        },
      },
    });

    if (checkAdmin.role != "ADMIN") {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(
            HttpStatus.UNAUTHORIZED,
            null,
            "Only Admin can update member role"
          )
        );
    }

    // Validate required fields
    if (!groupId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Group ID is required")
        );
    }

    if (!member.id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Member ID is requires")
        );
    }

    // Get user's email from their ID
    const user = await prisma.user.findUnique({
      where: { id: member.id },
      select: { email: true },
    });

    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new APIResponse(HttpStatus.NOT_FOUND, null, "User not found"));
    }

    // Check if the user is already a member of the group
    const existingMembership = await prisma.membership.findUnique({
      where: {
        email_groupId: {
          email: user.email,
          groupId: groupId,
        },
      },
    });

    // If the user is already in the group, delete their membership
    if (existingMembership.role != "ADMIN") {
      await prisma.membership.update({
        where: { id: existingMembership.id },
        data: { role: "ADMIN" },
      });
    }

    if (existingMembership.role == "ADMIN") {
      await prisma.membership.update({
        where: { id: existingMembership.id },
        data: { role: "MEMBER" },
      });
    }

    // Now fetch all updated memberships of the group
    const updatedMemberships = await prisma.membership.findMany({
      where: {
        groupId: existingMembership.groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            lastname: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Format response similar to getGroups
    const members = updatedMemberships.map((membership) => ({
      email: membership.email,
      name: membership.user?.username || "Unknown",
      image: membership.user?.image || "/api/placeholder/48/48",
      lastname: membership.user?.lastname || "Unknown",
      id: membership.user?.id || "Unknown",
      role: membership.role || "Unknown",
    }));

    return res
      .status(HttpStatus.OK)
      .json(
        new APIResponse(
          HttpStatus.OK,
          members,
          "Member role updated successfully"
        )
      );
  } catch (error) {
    console.error("Error updating member role", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

//========================DELETE_MEMBER_FROM_GROUP==================================================//

export const deleteMember = async (req, res) => {
  try {
    const { groupId, member } = req.body;

    // Validate if the user that is performing action is ADMIN
    const checkAdmin = await prisma.membership.findUnique({
      where: {
        email_groupId: {
          email: req.user.email,
          groupId: groupId,
        },
      },
    });

    if (checkAdmin.role != "ADMIN") {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(
            HttpStatus.UNAUTHORIZED,
            null,
            "Only Admin can remove members"
          )
        );
    }

    // Validate required fields
    if (!groupId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Group ID is required")
        );
    }

    if (!member.id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Member ID is requires")
        );
    }

    // Get user's email from their ID
    const user = await prisma.user.findUnique({
      where: { id: member.id },
      select: { email: true },
    });

    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new APIResponse(HttpStatus.NOT_FOUND, null, "User not found"));
    }

    // Check if the user is already a member of the group
    const existingMembership = await prisma.membership.findUnique({
      where: {
        email_groupId: {
          email: user.email,
          groupId: groupId,
        },
      },
    });

    // If the user is already in the group, delete their membership
    if (existingMembership) {
      await prisma.membership.delete({
        where: {
          id: existingMembership.id,
        },
      });
    }

    // Now fetch all updated memberships of the group
    const updatedMemberships = await prisma.membership.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            lastname: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Format response similar to getGroups
    const members = updatedMemberships.map((membership) => ({
      email: membership.email,
      name: membership.user?.username || "Unknown",
      image: membership.user?.image || "/api/placeholder/48/48",
      lastname: membership.user?.lastname || "Unknown",
      id: membership.user?.id || "Unknown",
      role: membership.role || "Unknown",
    }));

    return res
      .status(HttpStatus.OK)
      .json(
        new APIResponse(
          HttpStatus.OK,
          members,
          "Member removed from group successfully"
        )
      );
  } catch (error) {
    console.error("Error removing member", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

//========================UPDATE_NEW_MEMBERS==================================================//

export const updateNewMembers = async (req, res) => {
  try {
    const { groupId, upData } = req.body;

    // Validate required fields
    if (!groupId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(HttpStatus.BAD_REQUEST, null, "Group ID is required")
        );
    }

    if (!upData || !Array.isArray(upData) || upData.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            HttpStatus.BAD_REQUEST,
            null,
            "New members array is required"
          )
        );
    }

    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new APIResponse(HttpStatus.NOT_FOUND, null, "Group not found"));
    }

    const results = [];

    // Process all new members
    for (const memberEmail of upData) {
      // Get user by email
      const user = await prisma.user.findUnique({
        where: { email: memberEmail },
        select: { email: true },
      });

      if (!user) {
        results.push({
          email: memberEmail,
          status: "failed",
          message: "User not found",
        });
        continue;
      }

      // Check if the user is already a member of the group
      const existingMembership = await prisma.membership.findUnique({
        where: {
          email_groupId: {
            email: user.email,
            groupId,
          },
        },
      });

      // If the user is not already in the group, create new membership
      if (!existingMembership) {
        await prisma.membership.create({
          data: {
            email: user.email,
            groupId,
          },
        });
      } else if (existingMembership) {
        return res
          .status(HttpStatus.CONFLICT)
          .json(
            new APIResponse(
              HttpStatus.CONFLICT,
              null,
              "Members already part of group"
            )
          );
      }
    }

    // Now fetch all updated memberships of the group
    const updatedMemberships = await prisma.membership.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            lastname: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Format response similar to getGroups
    const members = updatedMemberships.map((membership) => ({
      email: membership.email,
      name: membership.user?.username || "Unknown",
      image: membership.user?.image || "/api/placeholder/48/48",
      lastname: membership.user?.lastname || "Unknown",
      id: membership.user?.id || "Unknown",
      role: membership.role || "Unknown",
    }));

    return res
      .status(HttpStatus.OK)
      .json(new APIResponse(HttpStatus.OK, members, "New members processed"));
  } catch (error) {
    console.error("Error adding new members", error);
    return res
      .status(HttpStatus.INTERNAL_ERROR)
      .json(new APIResponse(HttpStatus.INTERNAL_ERROR, null, error.message));
  }
};

//========================GET_POSTS==================================================//

export const getPosts = async (req, res) => {
  try {
    const groupId = req.query.groupId;

    if (!groupId) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(
          new APIResponse(HttpStatus.NOT_FOUND, null, "groupId not provided")
        );
    }

    // Check if the group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: groupId }, // Make sure to use "id" not "groupId"
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
        .json(new APIResponse(HttpStatus.NOT_FOUND, null, "group not found"));
    }

    // Get all posts for this group with their authors, comments, and likes
    const posts = await prisma.post.findMany({
      where: { groupId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format posts for frontend consumption
    const formattedPosts = posts.map((post) => {
      // Format comments
      const formattedComments = post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: comment.author.id,
          name: comment.author.username || "Unknown",
          lastname: comment.author.lastname || "Unknown",
          image: comment.author.image || "/api/placeholder/48/48",
        },
      }));

      // Format likes
      const formattedLikes = post.likes.map((like) => ({
        id: like.id,
        userId: like.user.id,
        userName: like.user.username || "Unknown",
      }));

      // Return formatted post
      return {
        id: post.id,
        caption: post.caption || "",
        content: post.content || "",
        mediaUrl: post.mediaUrl || null,
        mediaType: post.mediaType || null,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        group: {
          id: post.groupId,
          name: existingGroup.name,
        },
        author: {
          id: post.author.id,
          name: post.author.username || "Unknown",
          lastname: post.author.lastname || "Unknown",
          email: post.author.email,
          image: post.author.image || "/api/placeholder/48/48",
        },
        comments: formattedComments,
        commentCount: formattedComments.length,
        likes: formattedLikes,
        likeCount: formattedLikes.length,
      };
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new APIResponse(
          HttpStatus.OK,
          formattedPosts,
          "Posts retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error Fetching Posts", error);
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
              select: {
                id: true,
                username: true,
                lastname: true,
                email: true,
                image: true,
              },
            },
          },
        },
        creator: {
          select: { id: true, username: true, email: true, lastname: true },
        },
        posts: true,
      },
    });

    // Format response similar to getGroups
    const members = updatedGroup.memberships.map((membership) => ({
      email: membership.email,
      name: membership.user?.username || "Unknown",
      image: membership.user?.image || "/api/placeholder/48/48",
      lastname: membership.user?.lastname || "Unknown",
      id: membership.user?.id || "Unknown",
      role: membership.role || "Unknown",
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
