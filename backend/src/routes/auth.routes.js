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
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import multer from "multer";
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
}); // 25MB

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

router.post("/addPost", authMiddleware, upload.single("image"), addPost);

export default router;
