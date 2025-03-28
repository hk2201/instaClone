import express from "express";
import {
  signup,
  login,
  googlelogin,
  getGroups,
  postGroups,
  updateGroupInfo,
  deleteMember,
  updateAdmin,
  updateNewMembers,
  getPosts,
  addPost,
  get_upload_signature,
  updateLikes,
  getUser,
  updateUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();

// /api/v1/auth/signup
router.post("/signup", signup);

router.post("/login", login);

router.post("/googlelogin", googlelogin);

router.get("/getGroups", authMiddleware, getGroups);

router.post("/postGroups", authMiddleware, postGroups);

router.put("/updateGroupInfo", authMiddleware, updateGroupInfo);

router.delete("/deleteMember", authMiddleware, deleteMember);

router.put("/updateAdmin", authMiddleware, updateAdmin);

router.put("/updateNewMembers", authMiddleware, updateNewMembers);

router.get("/getPosts", authMiddleware, getPosts);

router.post("/addPost", authMiddleware, addPost);

router.get("/get_upload_signature", authMiddleware, get_upload_signature);

router.post("/updateLikes", authMiddleware, updateLikes);

router.get("/getUser", authMiddleware, getUser);

router.put("/updateUser", authMiddleware, updateUser);

export default router;
