import express from "express";
import {
  signup,
  login,
  googlelogin,
  getGroups,
  postGroups,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// /api/v1/auth/signup
router.post("/signup", signup);


router.post("/login", login);

router.post("/googlelogin", googlelogin);

router.get("/getGroups", authMiddleware, getGroups);

router.post("/postGroups", authMiddleware, postGroups);

export default router;
